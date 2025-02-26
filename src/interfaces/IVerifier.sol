// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title IVerifier
 * @dev Interface for ZK proof verification
 */
interface IVerifier {
    /**
     * @dev Verify a ZK proof
     * @param proof The ZK proof
     * @param input The public inputs to the proof
     * @return True if the proof is valid, false otherwise
     */
    function verifyProof(bytes calldata proof, uint256[6] memory input) external view returns (bool);
} 