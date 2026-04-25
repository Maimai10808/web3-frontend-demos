// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";

abstract contract DeploymentMetaWriter is Script {
    struct ContractDeployment {
        string exportName;
        string artifactName;
        address deployedAddress;
    }

    function _contractDeployment(
        string memory exportName,
        string memory artifactName,
        address deployedAddress
    ) internal pure returns (ContractDeployment memory) {
        return
            ContractDeployment({
                exportName: exportName,
                artifactName: artifactName,
                deployedAddress: deployedAddress
            });
    }

    function _writeDeploymentMeta(
        string memory networkName,
        ContractDeployment[] memory contracts
    ) internal {
        string memory generatedDir = _generatedDir();
        vm.createDir(generatedDir, true);

        vm.writeFile(
            _deploymentMetaPath(),
            _deploymentMetaJson(networkName, contracts)
        );
    }

    function _generatedDir() internal view returns (string memory) {
        return string.concat(vm.projectRoot(), "/generated");
    }

    function _deploymentMetaPath() internal view returns (string memory) {
        return string.concat(_generatedDir(), "/deployment.meta.json");
    }

    function _deploymentMetaJson(
        string memory networkName,
        ContractDeployment[] memory contracts
    ) internal view returns (string memory) {
        string memory json = string.concat(
            "{\n",
            '  "deploymentId": "chain-',
            vm.toString(block.chainid),
            '",\n',
            '  "chainId": ',
            vm.toString(block.chainid),
            ",\n",
            '  "networkName": "',
            networkName,
            '",\n',
            '  "contracts": {\n'
        );

        for (uint256 i = 0; i < contracts.length; i++) {
            json = string.concat(json, _contractJson(contracts[i]));

            if (i + 1 < contracts.length) {
                json = string.concat(json, ",\n");
            } else {
                json = string.concat(json, "\n");
            }
        }

        return string.concat(json, "  }\n", "}\n");
    }

    function _contractJson(
        ContractDeployment memory deployment
    ) internal pure returns (string memory) {
        return
            string.concat(
                '    "',
                deployment.exportName,
                '": {\n',
                '      "artifactName": "',
                deployment.artifactName,
                '",\n',
                '      "address": "',
                vm.toString(deployment.deployedAddress),
                '"\n',
                "    }"
            );
    }
}
