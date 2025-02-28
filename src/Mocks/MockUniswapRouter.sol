// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

// Mock Uniswap Router for testing
contract MockUniswapRouter {
    address public factory;
    address public WETH;
    address public mockPair;
    
    // Track reserves for testing swap effects
    mapping(address => uint256) public tokenReserves;
    uint256 public ethReserves = 10 ether;
    
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
        // Just return the input amounts and some fake liquidity
        // Update the token reserves when adding liquidity
        tokenReserves[token] = amountTokenDesired;
        ethReserves = msg.value;
        
        return (amountTokenDesired, msg.value, 1000000);
    }
    
    // Update swapExactETHForTokens to handle tokens correctly
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts) {
        // Ensure path is valid
        require(path.length >= 2, "Invalid path");
        require(path[0] == WETH, "Path must start with WETH");
        
        address payable token = payable(path[1]);
        uint256 tokenAmount = calculateSwapAmount(msg.value, address(token));
        
        // Update reserves
        ethReserves += msg.value;
        tokenReserves[address(token)] -= tokenAmount;
        
        // We won't actually do the transfer since it's mocked
        // TokenTemplate(token).transfer(to, tokenAmount);
        
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