// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

// Mock Uniswap Pair for testing
contract MockUniswapPair {
    address public token0;
    address public token1;
    mapping(address => uint256) public balanceOf;
    
    // Mock reserves for testing
    uint256 private reserve0;
    uint256 private reserve1;
    uint32 private blockTimestampLast;
    
    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
        reserve0 = 1000;
        reserve1 = 1000;
        blockTimestampLast = uint32(block.timestamp);
    }
    
    function getReserves() external view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        return (uint112(reserve0), uint112(reserve1), blockTimestampLast);
    }
    
    // Mock function to set LP token balance for a user
    function setBalance(address user, uint256 amount) external {
        balanceOf[user] = amount;
    }
    
    // Mock function to update reserves
    function updateReserves(uint256 _reserve0, uint256 _reserve1) external {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
        blockTimestampLast = uint32(block.timestamp);
    }
} 