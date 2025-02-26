// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "forge-std/Script.sol";
import "../src/GhostPad.sol";
import "../src/TokenTemplate.sol";
import "../src/UniswapHandler.sol";
import "../src/Verifier.sol";
import "../src/MetadataVerifier.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Verifiers
        Verifier verifier = new Verifier();
        MetadataVerifier metadataVerifier = new MetadataVerifier();
        
        // Deploy TokenTemplate and UniswapHandler
        TokenTemplate tokenTemplate = new TokenTemplate();
        
        // Deploy UniswapHandler with router address
        address uniswapRouterAddress = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; // Uniswap V2 Router on mainnet
        UniswapHandler uniswapHandler = new UniswapHandler(uniswapRouterAddress);
        
        // Create mock tornado instances array
        // In a real deployment, you would use actual Tornado Cash instances
        address[] memory tornadoInstances = new address[](1);
        tornadoInstances[0] = address(0x12345678); // Mock tornado instance
        
        // Deploy GhostPad
        GhostPad ghostPad = new GhostPad(
            address(tokenTemplate),
            payable(msg.sender), // governance address
            address(metadataVerifier),
            tornadoInstances,
            address(uniswapHandler)
        );

        vm.stopBroadcast();
    }
} 