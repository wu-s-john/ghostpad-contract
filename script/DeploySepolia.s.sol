// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma abicoder v2;

import "forge-std/Script.sol";
import "../src/GhostPad.sol";
import "../src/TokenTemplate.sol";
import "../src/UniswapHandler.sol";
import "../src/Mocks/MockTornadoInstance.sol";

contract DeploySepoliaScript is Script {
    function run(address uniswapRouter, address governance, address[] memory tornadoInstances) public {
        // Start recording transactions for deployment
        vm.startBroadcast();

        // Deploy TokenTemplate
        TokenTemplate tokenTemplate = new TokenTemplate();
        console.log("TokenTemplate deployed at:", address(tokenTemplate));

        // Deploy mock tornado instances if needed
        address[] memory instances;
        if (tornadoInstances.length == 0) {
            // Deploy mock tornado instances
            instances = new address[](3);
            instances[0] = address(new MockTornadoInstance(0.1 ether));
            instances[1] = address(new MockTornadoInstance(1 ether));
            instances[2] = address(new MockTornadoInstance(10 ether));
            console.log("Deployed mock tornado instances:", instances[0], instances[1], instances[2]);
        } else {
            instances = tornadoInstances;
        }

        // Use the real Uniswap Router address for Sepolia
        address sepoliaUniswapRouter = 0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3;
        
        // Deploy UniswapHandler with the real Sepolia Uniswap Router
        UniswapHandler uniswapHandler = new UniswapHandler(sepoliaUniswapRouter);
        console.log("UniswapHandler deployed at:", address(uniswapHandler));

        // Deploy GhostPad with TokenTemplate, governance, tornado instances and Uniswap handler
        GhostPad ghostPad = new GhostPad(
            address(tokenTemplate),
            governance == address(0) ? msg.sender : governance,
            instances, 
            address(uniswapHandler)
        );
        console.log("GhostPad deployed at:", address(ghostPad));

        // Set up GhostPad as the owner of UniswapHandler
        uniswapHandler.transferOwnership(address(ghostPad));
        console.log("Transferred UniswapHandler ownership to GhostPad");

        // Stop broadcasting
        vm.stopBroadcast();
    }
} 