// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title MockGhostPad
 * @dev A simplified mock of GhostPad for testing the TokenTemplate
 */
contract MockGhostPad {
    uint256 public tornadoDenomination;
    
    constructor(uint256 _denomination) {
        tornadoDenomination = _denomination;
    }
    
    function getTornadoInstance(uint256 index) external view returns (address instance, uint256 denomination) {
        return (address(0), tornadoDenomination);
    }
} 