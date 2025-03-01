// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Mock Uniswap Router for testing
contract MockUniswapRouter {
    address public factory;
    address public WETH;
    address public mockPair;
    
    // Track reserves for testing swap effects
    mapping(address => uint256) public tokenReserves;
    uint256 public ethReserves = 10 ether;
    
    // Add this state variable to track token balances for each token
    mapping(address => uint256) public tokenBalances;
    
    // Helper function to set token reserves for testing
    function setTokenReserves(address token, uint256 amount) public {
        tokenReserves[token] = amount;
    }
    
    // Set mockPair directly via this function for more flexibility
    function setMockPair(address _mockPair) public {
        mockPair = _mockPair;
    }
    
    constructor(address _factory, address _weth) {
        factory = _factory;
        WETH = _weth;
        mockPair = address(0x1234567890123456789012345678901234567890); // Default mock pair
    }
    
    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity) {
        // Record that we now have tokens available for swapping
        // Let's keep half the tokens for swapping and put half in the pair
        uint256 tokensForSwap = amountTokenDesired / 2;
        uint256 tokensForLiquidity = amountTokenDesired - tokensForSwap;
        
        // Transfer tokens to ourselves for later swaps
        IERC20(token).transferFrom(msg.sender, address(this), amountTokenDesired);
        
        // Store token balance for swaps
        tokenBalances[token] += tokensForSwap;
        
        // Return values mimicking real Uniswap behavior
        return (amountTokenDesired, msg.value, 1000000);
    }
    
    // Modify the swapExactETHForTokens function to use our stored token balance
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts) {
        // Ensure path is valid
        require(path.length >= 2, "Invalid path");
        require(path[0] == WETH, "Path must start with WETH");
        
        address token = path[1];
        uint256 tokenAmount = calculateSwapAmount(msg.value, token);
        
        // Check if we have enough tokens
        require(tokenBalances[token] >= tokenAmount, "Not enough tokens for swap");
        
        // Reduce our token balance
        tokenBalances[token] -= tokenAmount;
        
        // Transfer tokens to the buyer
        bool success = IERC20(token).transfer(to, tokenAmount);
        require(success, "Token transfer failed");
        
        // Return amounts array
        amounts = new uint256[](path.length);
        amounts[0] = msg.value;
        amounts[1] = tokenAmount;
        
        return amounts;
    }
    
    // Helper to calculate token amount based on ETH input
    function calculateSwapAmount(uint256 ethAmount, address token) public view returns (uint256) {
        // Use x * y = k formula
        uint256 k = tokenReserves[token] * ethReserves;
        uint256 newEthReserve = ethReserves + ethAmount;
        uint256 newTokenReserve = k / newEthReserve;
        
        return tokenReserves[token] - newTokenReserve;
    }
} 