// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract TokenFaucet is Ownable {
    IERC20 public immutable token;

    uint256 public immutable claimAmount;
    uint256 public immutable cooldown;

    mapping(address => uint256) public lastClaimedAt;

    event Claimed(address indexed user, uint256 amount, uint256 claimedAt);

    constructor(
        address token_,
        uint256 claimAmount_,
        uint256 cooldown_,
        address initialOwner
    ) Ownable(initialOwner) {
        require(token_ != address(0), "Invalid token");
        require(claimAmount_ > 0, "Invalid claim amount");

        token = IERC20(token_);
        claimAmount = claimAmount_;
        cooldown = cooldown_;
    }

    function claim() external {
        uint256 lastClaim = lastClaimedAt[msg.sender];

        require(
            block.timestamp >= lastClaim + cooldown,
            "Claim cooldown not passed"
        );

        lastClaimedAt[msg.sender] = block.timestamp;

        bool success = token.transfer(msg.sender, claimAmount);
        require(success, "Token transfer failed");

        emit Claimed(msg.sender, claimAmount, block.timestamp);
    }

    function canClaim(address user) external view returns (bool) {
        return block.timestamp >= lastClaimedAt[user] + cooldown;
    }
}
