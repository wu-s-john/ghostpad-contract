// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

// Mock Uniswap Factory for testing
contract MockUniswapFactory {
    mapping(address => mapping(address => address)) public getPair;
    address public mockPair;
    
    // Constructor with optional parameter
    constructor(address _mockPair) {
        // If a non-zero address is provided, use it as the mock pair address
        if (_mockPair != address(0)) {
            mockPair = _mockPair;
        } else {
            // Otherwise use a default address
            mockPair = address(0x1234567890123456789012345678901234567890);
        }
    }
    
    function createPair(address tokenA, address tokenB) external returns (address pair) {
        if (getPair[tokenA][tokenB] == address(0)) {
            getPair[tokenA][tokenB] = mockPair;
            getPair[tokenB][tokenA] = mockPair; // Also set the reverse mapping
        }
        return getPair[tokenA][tokenB];
    }
} 