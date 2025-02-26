// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 token for testing purposes
contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
    
    // Convenience function to mint more tokens
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
} 