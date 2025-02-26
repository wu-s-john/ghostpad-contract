// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

// Mock Hasher contract for testing purposes
contract Hasher {
    // This is a simplified version just for testing
    // In production, you would use a real MiMC-based implementation

    function MiMCSponge(uint256 in_xL, uint256 in_xR) external pure returns (uint256 xL, uint256 xR) {
        // Just a simple mock implementation for testing
        xL = uint256(keccak256(abi.encodePacked(in_xL)));
        xR = uint256(keccak256(abi.encodePacked(in_xR)));
    }
} 