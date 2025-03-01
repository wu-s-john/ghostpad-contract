// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "forge-std/Script.sol";
import "forge-std/StdJson.sol"; // Add StdJson import
import "../src/GhostPad.sol";
import "../src/TokenTemplate.sol";
import "../src/UniswapHandler.sol";
import "../src/Verifier.sol";
import "../src/mocks/MockTornadoInstance.sol";
import "../src/mocks/MockUniswapFactory.sol";
import "../src/mocks/MockUniswapRouter.sol";
import "../src/mocks/MockUniswapPair.sol";

// Development deployment script - automatically deploys all mock contracts
contract DeployDevScript is Script {
    using stdJson for string;
    
    function setUp() public {}

    function run(address payable governanceAddress) public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // If governance address is not provided, use deployer address
        if (governanceAddress == address(0)) {
            governanceAddress = payable(vm.addr(deployerPrivateKey));
        }
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy core contracts
        Verifier verifier = new Verifier();
        TokenTemplate tokenTemplate = new TokenTemplate();
        
        // Define WETH address
        address wethAddress = address(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2); // Mainnet WETH address
        
        // Deploy mock Uniswap contracts
        MockUniswapFactory mockFactory = new MockUniswapFactory(address(0));
        
        MockUniswapPair mockPair = new MockUniswapPair(
            address(0), // token0 (mock token)
            wethAddress // token1 (WETH)
        );
        
        MockUniswapRouter mockRouter = new MockUniswapRouter(
            address(mockFactory),
            wethAddress
        );
        
        // Configure the router to use our pair
        mockRouter.setMockPair(address(mockPair));
        
        // Deploy UniswapHandler with mock router
        UniswapHandler uniswapHandler = new UniswapHandler(address(mockRouter));
        
        // Deploy mock Tornado instances
        address[] memory tornadoInstances = new address[](4);
        
        // Define denominations with proper wei values for casting
        uint256[] memory denominations = new uint256[](4);
        denominations[0] = 100000000000000000;  // 0.1 ether
        denominations[1] = 1000000000000000000;  // 1 ether
        denominations[2] = 10000000000000000000;  // 10 ether 
        denominations[3] = 100000000000000000000;  // 100 ether
        
        for (uint256 i = 0; i < 4; i++) {
            MockTornadoInstance mockInstance = new MockTornadoInstance(denominations[i]);
            tornadoInstances[i] = address(mockInstance);
        }
        
        // Deploy GhostPad with all mock dependencies
        GhostPad ghostPad = new GhostPad(
            address(tokenTemplate),
            governanceAddress,
            tornadoInstances,
            address(uniswapHandler)
        );
        
        // Set initial governance fee (3%)
        ghostPad.updateGovernanceFee(300);
        
        // Log deployment summary
        console.log("=== GhostPad Development Deployment Complete ===");
        console.log("TokenTemplate:", address(tokenTemplate));
        console.log("Verifier:", address(verifier));
        console.log("MockUniswapFactory:", address(mockFactory));
        console.log("MockUniswapPair:", address(mockPair));
        console.log("MockUniswapRouter:", address(mockRouter));
        console.log("UniswapHandler:", address(uniswapHandler));
        
        console.log("--- Mock Tornado Instances ---");
        for (uint256 i = 0; i < 4; i++) {
            console.log(string(abi.encodePacked("Tornado_cash_", uint8(i+1), " (", uint2str(denominations[i] / 1e18), " ETH):")), tornadoInstances[i]);
        }
        
        console.log("GhostPad:", address(ghostPad));
        console.log("Governance:", governanceAddress);
        console.log("Governance Fee: 3%");
        console.log("=========================================");

        // Create JSON with contract addresses
        string memory contractsJson = "";
        contractsJson = stdJson.serialize("contracts", "tokenTemplate", address(tokenTemplate));
        contractsJson = stdJson.serialize("contracts", "verifier", address(verifier));
        contractsJson = stdJson.serialize("contracts", "mockUniswapFactory", address(mockFactory));
        contractsJson = stdJson.serialize("contracts", "mockUniswapPair", address(mockPair));
        contractsJson = stdJson.serialize("contracts", "mockUniswapRouter", address(mockRouter));
        contractsJson = stdJson.serialize("contracts", "uniswapHandler", address(uniswapHandler));
        contractsJson = stdJson.serialize("contracts", "ghostPad", address(ghostPad));
        contractsJson = stdJson.serialize("contracts", "governance", governanceAddress);
        
        // Add tornado instances to JSON
        string memory instancesJson = "";
        for (uint256 i = 0; i < 4; i++) {
            string memory key = string(abi.encodePacked("tornadoInstance", uint2str(denominations[i] / 1e18), "ETH"));
            instancesJson = stdJson.serialize("tornadoInstances", key, tornadoInstances[i]);
        }
        
        // Combine and write JSON to file
        string memory jsonOutput = stdJson.serialize("deployment", "contracts", contractsJson);
        jsonOutput = stdJson.serialize("deployment", "tornadoInstances", instancesJson);
        
        // Write the JSON to a file
        console.log(jsonOutput);
        
        // vm.writeJson(jsonOutput, "./deployments/dev.json");
        // console.log("Deployment addresses written to ./deployments/dev.json");

        vm.stopBroadcast();
    }
    
    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}