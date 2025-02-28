#!/bin/bash

# Stop any running anvil instance
echo "Stopping any running Anvil instances..."
pkill -f anvil || true

# Start a fresh anvil instance
echo "Starting fresh Anvil instance..."
anvil > /dev/null 2>&1 &

# Wait for anvil to be ready
echo "Waiting for Anvil to be ready..."
sleep 2

echo "Anvil reset complete!" 