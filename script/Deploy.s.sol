// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {BaseGuildToken} from "../src/BaseGuildToken.sol";

/// Usage (Base Sepolia):
///   forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --private-key $PRIVATE_KEY
contract Deploy is Script {
    function run() external returns (BaseGuildToken token) {
        string memory name = vm.envOr("TOKEN_NAME", string("Base Guild Token"));
        string memory symbol = vm.envOr("TOKEN_SYMBOL", string("BGT"));
        uint256 supply = vm.envOr("TOKEN_SUPPLY", uint256(1_000_000 ether));

        vm.startBroadcast();
        token = new BaseGuildToken(name, symbol, supply);
        vm.stopBroadcast();

        console.log("BaseGuildToken deployed at:", address(token));
    }
}
