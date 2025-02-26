// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TokenTemplate.sol";

// Uniswap V2 interfaces
interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface IUniswapV2Router02 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
    
    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity);
    
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);
    
    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

interface IUniswapV2Pair {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function balanceOf(address owner) external view returns (uint256);
}

/**
 * @title UniswapHandler
 * @dev Helper contract to create and manage Uniswap liquidity for GhostPad tokens
 */
contract UniswapHandler is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    
    address public immutable uniswapRouterAddress;
    address public immutable uniswapFactoryAddress;
    address public immutable wethAddress;
    
    struct LiquidityInfo {
        address pair;
        bool isLocked;
        uint256 unlockTime;
    }
    
    mapping(address => LiquidityInfo) public liquidityInfo;
    
    event LiquidityAdded(
        address indexed token,
        address indexed pair,
        uint256 amountToken,
        uint256 amountETH,
        uint256 liquidity
    );
    
    event LiquidityLocked(
        address indexed token,
        address indexed pair,
        uint256 lockPeriod,
        uint256 unlockTime
    );
    
    /**
     * @dev Constructor
     * @param _uniswapRouterAddress The address of the Uniswap V2 Router
     */
    constructor(address _uniswapRouterAddress) {
        require(_uniswapRouterAddress != address(0), "Router address cannot be zero");
        uniswapRouterAddress = _uniswapRouterAddress;
        
        IUniswapV2Router02 router = IUniswapV2Router02(_uniswapRouterAddress);
        uniswapFactoryAddress = router.factory();
        wethAddress = router.WETH();
    }
    
    /**
     * @dev Create a Uniswap pair for a token
     * @param tokenAddress The address of the token
     * @return pairAddress The address of the created pair
     */
    function createPair(address tokenAddress) public returns (address pairAddress) {
        require(tokenAddress != address(0), "Token address cannot be zero");
        
        IUniswapV2Factory factory = IUniswapV2Factory(uniswapFactoryAddress);
        
        // Check if pair already exists
        pairAddress = factory.getPair(tokenAddress, wethAddress);
        
        // If pair doesn't exist, create it
        if (pairAddress == address(0)) {
            pairAddress = factory.createPair(tokenAddress, wethAddress);
        }
        
        return pairAddress;
    }
    
    /**
     * @dev Add liquidity to a token/ETH pair
     * @param tokenAddress The address of the token
     * @param tokenAmount The amount of tokens to add to the liquidity pool
     * @param ethAmount The amount of ETH to add to the liquidity pool
     * @param lockPeriod The period in seconds to lock the liquidity (0 for no locking)
     * @return liquidity The amount of LP tokens received
     */
    function addLiquidity(
        address tokenAddress,
        uint256 tokenAmount,
        uint256 ethAmount,
        uint256 lockPeriod
    ) external payable returns (uint256 liquidity) {
        require(tokenAddress != address(0), "Token address cannot be zero");
        require(tokenAmount > 0, "Token amount must be greater than 0");
        require(msg.value == ethAmount, "Sent ETH must match ethAmount");
        
        // Create or get the pair
        address pairAddress = createPair(tokenAddress);
        
        // Approve token transfer to router
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenAmount);
        IERC20(tokenAddress).safeApprove(uniswapRouterAddress, tokenAmount);
        
        // Add liquidity
        IUniswapV2Router02 router = IUniswapV2Router02(uniswapRouterAddress);
        
        (uint256 amountToken, uint256 amountETH, uint256 lpTokens) = router.addLiquidityETH{value: ethAmount}(
            tokenAddress,
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(this), // LP tokens are sent to this contract
            block.timestamp + 1800 // 30 minutes from now
        );
        
        // Send any remaining tokens back to sender
        if (amountToken < tokenAmount) {
            IERC20(tokenAddress).safeTransfer(msg.sender, tokenAmount.sub(amountToken));
        }
        
        // Send any remaining ETH back to sender
        if (amountETH < ethAmount) {
            payable(msg.sender).transfer(ethAmount.sub(amountETH));
        }
        
        // Update liquidity info
        liquidityInfo[tokenAddress] = LiquidityInfo({
            pair: pairAddress,
            isLocked: lockPeriod > 0,
            unlockTime: lockPeriod > 0 ? block.timestamp.add(lockPeriod) : 0
        });
        
        // If token is a TokenTemplate and lockPeriod > 0, lock liquidity in the token contract
        if (lockPeriod > 0) {
            try TokenTemplate(payable(tokenAddress)).lockLiquidity(pairAddress) {
                emit LiquidityLocked(tokenAddress, pairAddress, lockPeriod, liquidityInfo[tokenAddress].unlockTime);
            } catch {
                // If the token doesn't have the lockLiquidity function, it's fine
                // The LP tokens are still locked in this contract
            }
        }
        
        emit LiquidityAdded(tokenAddress, pairAddress, amountToken, amountETH, lpTokens);
        
        return lpTokens;
    }
    
    /**
     * @dev Transfer LP tokens to the owner after the lock period
     * Only callable by the owner and only if lock period has ended
     * @param tokenAddress The address of the token
     */
    function transferLPTokens(address tokenAddress) external onlyOwner {
        LiquidityInfo storage info = liquidityInfo[tokenAddress];
        require(info.pair != address(0), "Pair doesn't exist");
        require(!info.isLocked || block.timestamp >= info.unlockTime, "Liquidity is still locked");
        
        // Get LP token balance
        uint256 lpBalance = IERC20(info.pair).balanceOf(address(this));
        require(lpBalance > 0, "No LP tokens to transfer");
        
        // Transfer LP tokens to owner
        IERC20(info.pair).safeTransfer(owner(), lpBalance);
        
        // Update lock status
        info.isLocked = false;
    }
    
    /**
     * @dev Get liquidity information for a token
     * @param tokenAddress The address of the token
     * @return pair The address of the Uniswap pair
     * @return isLocked Whether the liquidity is locked
     * @return unlockTime The timestamp when the liquidity can be unlocked
     * @return lpBalance The amount of LP tokens held by this contract
     */
    function getLiquidityInfo(address tokenAddress) external view returns (
        address pair,
        bool isLocked,
        uint256 unlockTime,
        uint256 lpBalance
    ) {
        LiquidityInfo storage info = liquidityInfo[tokenAddress];
        pair = info.pair;
        isLocked = info.isLocked;
        unlockTime = info.unlockTime;
        
        if (pair != address(0)) {
            lpBalance = IERC20(pair).balanceOf(address(this));
        } else {
            lpBalance = 0;
        }
    }
    
    /**
     * @dev Check if a pair exists for a token
     * @param tokenAddress The address of the token
     * @return exists Whether the pair exists
     */
    function pairExists(address tokenAddress) external view returns (bool exists) {
        address pair = IUniswapV2Factory(uniswapFactoryAddress).getPair(tokenAddress, wethAddress);
        return pair != address(0);
    }
    
    /**
     * @dev Allow the contract to receive ETH
     */
    receive() external payable {}
} 