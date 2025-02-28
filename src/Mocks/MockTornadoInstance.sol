// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "../interfaces/ITornadoInstance.sol";

// Mock Tornado instance for testing
contract MockTornadoInstance is ITornadoInstance {
    uint256 private _denomination;
    bytes32 private _lastRoot;
    
    // Store commitments and nullifier hashes like in the real contract
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifierHashes;
    
    // Events to match the real Tornado contract
    event Deposit(bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp);
    event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee);
    
    constructor(uint256 denomination_) {
        _denomination = denomination_;
        _lastRoot = bytes32(uint256(123456789)); // Dummy root for testing
    }
    
    function denomination() external view override returns (uint256) {
        return _denomination;
    }
    
    function deposit(bytes32 commitment) external payable override {
        require(msg.value == _denomination, "Invalid deposit amount");
        require(!commitments[commitment], "Commitment already exists");
        
        // Record the commitment
        commitments[commitment] = true;
        
        // Emit Deposit event with fake leaf index
        emit Deposit(commitment, 0, block.timestamp);
    }
    
    function withdraw(
        bytes calldata /*proof*/,
        bytes32 /*root*/,
        bytes32 nullifierHash,
        address payable recipient,
        address payable relayer,
        uint256 fee,
        uint256 /*refund*/
    ) external payable override {
        require(!nullifierHashes[nullifierHash], "Note has been spent");
        require(fee <= _denomination, "Fee exceeds transfer value");
        
        // Make sure the contract has enough ETH to process the withdrawal
        require(address(this).balance >= _denomination, "Insufficient funds in Tornado instance");
        
        // Mark nullifier as spent
        nullifierHashes[nullifierHash] = true;
        
        // Process the withdrawal (simplified)
        uint256 amount = _denomination - fee;
        
        // Send fee to relayer if needed
        if (fee > 0 && relayer != address(0)) {
            (bool relayerSuccess, ) = relayer.call{value: fee}("");
            require(relayerSuccess, "Fee transfer failed");
        }
        
        // Send remaining amount to recipient
        (bool recipientSuccess, ) = recipient.call{value: amount}("");
        require(recipientSuccess, "ETH transfer failed");
        
        emit Withdrawal(recipient, nullifierHash, relayer, fee);
    }
    
    function getLastRoot() external view override returns (bytes32) {
        return _lastRoot;
    }
    
    function isSpent(bytes32 nullifierHash) external view override returns (bool) {
        return nullifierHashes[nullifierHash];
    }
} 