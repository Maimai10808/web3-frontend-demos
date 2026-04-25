// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DeploymentMetaWriter} from "script/lib/DeploymentMetaWriter.sol";

import {DemoERC20} from "src/siwe-eip712-demo/DemoERC20.sol";
import {TokenFaucet} from "src/siwe-eip712-demo/TokenFaucet.sol";
import {SignedOrderBook} from "src/siwe-eip712-demo/SignedOrderBook.sol";

contract DeployDemo is DeploymentMetaWriter {
    struct DemoDeployment {
        DemoERC20 demoERC20;
        TokenFaucet tokenFaucet;
        SignedOrderBook signedOrderBook;
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        string memory networkName = vm.envOr(
            "NETWORK_NAME",
            string("localhost")
        );

        vm.startBroadcast(deployerPrivateKey);

        DemoDeployment memory deployment = _deployDemoContracts(
            vm.addr(deployerPrivateKey)
        );

        vm.stopBroadcast();

        _exportDemoDeployment(networkName, deployment);
    }

    function _deployDemoContracts(
        address deployer
    ) private returns (DemoDeployment memory deployment) {
        deployment.demoERC20 = new DemoERC20("Demo Token", "DEMO", deployer);

        deployment.tokenFaucet = new TokenFaucet(
            address(deployment.demoERC20),
            100 ether,
            1 days,
            deployer
        );

        deployment.signedOrderBook = new SignedOrderBook();

        deployment.demoERC20.transfer(
            address(deployment.tokenFaucet),
            100_000 ether
        );
    }

    function _exportDemoDeployment(
        string memory networkName,
        DemoDeployment memory deployment
    ) private {
        ContractDeployment[] memory contracts = new ContractDeployment[](3);

        contracts[0] = _contractDeployment({
            exportName: "demoERC20",
            artifactName: "DemoERC20",
            deployedAddress: address(deployment.demoERC20)
        });

        contracts[1] = _contractDeployment({
            exportName: "tokenFaucet",
            artifactName: "TokenFaucet",
            deployedAddress: address(deployment.tokenFaucet)
        });

        contracts[2] = _contractDeployment({
            exportName: "signedOrderBook",
            artifactName: "SignedOrderBook",
            deployedAddress: address(deployment.signedOrderBook)
        });

        _writeDeploymentMeta({networkName: networkName, contracts: contracts});
    }
}
