// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "forge-std/Script.sol";
import "../src/GhostPad.sol";
import "../src/TokenTemplate.sol";
import "../src/UniswapHandler.sol";
import "../src/Verifier.sol";

// Production deployment script - requires all external contract addresses to be provided
contract DeployProdScript is Script {
    function setUp() public {}

    function run(
        address uniswapRouterAddress,
        address payable governanceAddress,
        address[] memory tornadoInstances
    ) public {
        // Check required parameters
        require(uniswapRouterAddress != address(0), "Uniswap router address cannot be zero");
        require(governanceAddress != address(0), "Governance address cannot be zero");
        require(tornadoInstances.length > 0, "At least one tornado instance required");

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy core contracts
        Verifier verifier = new Verifier();
        TokenTemplate tokenTemplate = new TokenTemplate();
        UniswapHandler uniswapHandler = new UniswapHandler(uniswapRouterAddress);
        
        // Deploy GhostPad with all dependencies
        GhostPad ghostPad = new GhostPad(
            address(tokenTemplate),
            governanceAddress,
            tornadoInstances,
            address(uniswapHandler)
        );
        
        // Set initial governance fee (3%)
        ghostPad.updateGovernanceFee(300);

        vm.stopBroadcast();
    }
} 