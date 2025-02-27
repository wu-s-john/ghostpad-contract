// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title ITornadoInstance
 * @dev Interface for Tornado Cash instance
 */
interface ITornadoInstance {
    /**
     * @dev Get the denomination of the instance
     * @return The denomination value
     */
    function denomination() external view returns (uint256);
    
    /**
     * @dev Deposit into the Tornado instance
     * @param commitment The commitment hash
     */
    function deposit(bytes32 commitment) external payable;
    
    /**
     * @dev Withdraw from the Tornado instance
     * @param proof The ZK proof
     * @param root The Merkle root
     * @param nullifierHash The nullifier hash
     * @param recipient The recipient address
     * @param relayer The relayer address
     * @param fee The relayer fee
     * @param refund The refund amount
     */
    function withdraw(
        bytes calldata proof,
        bytes32 root,
        bytes32 nullifierHash,
        address payable recipient,
        address payable relayer,
        uint256 fee,
        uint256 refund
    ) external payable;
    
    /**
     * @dev Get the last Merkle root
     * @return The last Merkle root
     */
    function getLastRoot() external view returns (bytes32);
    
    /**
     * @dev Check if a nullifier hash has been spent
     * @param nullifierHash The nullifier hash to check
     * @return Whether the nullifier has been spent
     */
    function isSpent(bytes32 nullifierHash) external view returns (bool);
} 