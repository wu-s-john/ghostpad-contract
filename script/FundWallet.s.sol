// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "forge-std/Script.sol";

contract FundWallet is Script {
    function run() external {
        // Parse arguments
        string memory recipientArg = vm.envOr("RECIPIENT", string(""));
        uint256 amount = 100 ether;
        
        address recipient = vm.parseAddress(recipientArg);
        require(recipient != address(0), "Invalid recipient address");
        
        // Use the first anvil account private key
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Send ETH to the recipient
        (bool success, ) = payable(recipient).call{value: amount}("");
        require(success, "Transfer failed");
        
        vm.stopBroadcast();
        
        console.log("Funded address %s with %d ETH", recipient, amount / 1 ether);
    }
} 