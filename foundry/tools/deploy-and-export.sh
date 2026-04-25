#!/usr/bin/env bash

set -e

export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export NETWORK_NAME=localhost

rm -rf generated ../generated

forge build

forge script script/siwe-eip712-demo/DeployDemo.s.sol:DeployDemo \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast

npm run export:deployment

echo ""
echo "Foundry local generated:"
ls -la generated

echo ""
echo "Project-level generated:"
ls -la ../generated
