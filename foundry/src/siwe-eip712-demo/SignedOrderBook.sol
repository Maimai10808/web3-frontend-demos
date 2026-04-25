// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract SignedOrderBook is EIP712 {
    using ECDSA for bytes32;

    struct Order {
        address maker;
        address token;
        address recipient;
        uint256 amount;
        uint256 deadline;
        bytes32 nonce;
    }

    bytes32 public constant ORDER_TYPEHASH =
        keccak256(
            "Order(address maker,address token,address recipient,uint256 amount,uint256 deadline,bytes32 nonce)"
        );

    mapping(bytes32 => bool) public usedNonces;

    event OrderExecuted(
        address indexed maker,
        address indexed recipient,
        address indexed token,
        uint256 amount,
        bytes32 nonce
    );

    constructor() EIP712("SignedOrderBook", "1") {}

    function hashOrder(Order calldata order) public view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        ORDER_TYPEHASH,
                        order.maker,
                        order.token,
                        order.recipient,
                        order.amount,
                        order.deadline,
                        order.nonce
                    )
                )
            );
    }

    function recoverSigner(
        Order calldata order,
        bytes calldata signature
    ) public view returns (address) {
        bytes32 digest = hashOrder(order);
        return ECDSA.recover(digest, signature);
    }

    function executeOrder(
        Order calldata order,
        bytes calldata signature
    ) external {
        require(block.timestamp <= order.deadline, "Order expired");
        require(!usedNonces[order.nonce], "Nonce already used");
        require(order.maker != address(0), "Invalid maker");
        require(order.token != address(0), "Invalid token");
        require(order.recipient != address(0), "Invalid recipient");
        require(order.amount > 0, "Invalid amount");

        address signer = recoverSigner(order, signature);

        require(signer == order.maker, "Invalid signer");

        usedNonces[order.nonce] = true;

        bool success = IERC20(order.token).transferFrom(
            order.maker,
            order.recipient,
            order.amount
        );

        require(success, "Token transfer failed");

        emit OrderExecuted(
            order.maker,
            order.recipient,
            order.token,
            order.amount,
            order.nonce
        );
    }
}
