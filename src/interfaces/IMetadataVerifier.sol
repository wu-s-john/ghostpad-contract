// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title IMetadataVerifier
 * @dev Interface for metadata proof verification
 */
interface IMetadataVerifier {
    /**
     * @dev Verify a metadata proof
     * @param proof The ZK proof
     * @param input The public inputs to the proof
     * @return True if the proof is valid, false otherwise
     */
    function verifyProof(bytes calldata proof, uint256[2] memory input) external returns (bool);
} 