// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {BaseGuildToken} from "../src/BaseGuildToken.sol";

contract BaseGuildTokenTest is Test {
    BaseGuildToken token;
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    uint256 constant INITIAL = 1_000 ether;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function setUp() public {
        token = new BaseGuildToken("Base Guild Token", "BGT", INITIAL);
    }

    function test_Metadata() public view {
        assertEq(token.name(), "Base Guild Token");
        assertEq(token.symbol(), "BGT");
        assertEq(token.decimals(), 18);
    }

    function test_InitialSupplyGoesToDeployer() public view {
        assertEq(token.totalSupply(), INITIAL);
        assertEq(token.balanceOf(address(this)), INITIAL);
        assertEq(token.owner(), address(this));
    }

    function test_Transfer() public {
        vm.expectEmit(true, true, false, true);
        emit Transfer(address(this), alice, 100 ether);
        assertTrue(token.transfer(alice, 100 ether));
        assertEq(token.balanceOf(alice), 100 ether);
        assertEq(token.balanceOf(address(this)), INITIAL - 100 ether);
    }

    function test_TransferRevertsOnInsufficientBalance() public {
        vm.prank(alice);
        vm.expectRevert(BaseGuildToken.InsufficientBalance.selector);
        token.transfer(bob, 1);
    }

    function test_TransferRevertsToZeroAddress() public {
        vm.expectRevert(BaseGuildToken.ZeroAddress.selector);
        token.transfer(address(0), 1);
    }

    function test_ApproveAndTransferFrom() public {
        token.approve(alice, 50 ether);
        assertEq(token.allowance(address(this), alice), 50 ether);

        vm.prank(alice);
        token.transferFrom(address(this), bob, 30 ether);

        assertEq(token.balanceOf(bob), 30 ether);
        assertEq(token.allowance(address(this), alice), 20 ether);
    }

    function test_TransferFromRevertsWithoutAllowance() public {
        vm.prank(alice);
        vm.expectRevert(BaseGuildToken.InsufficientAllowance.selector);
        token.transferFrom(address(this), bob, 1);
    }

    function test_InfiniteAllowanceIsNotDecreased() public {
        token.approve(alice, type(uint256).max);
        vm.prank(alice);
        token.transferFrom(address(this), bob, 10 ether);
        assertEq(token.allowance(address(this), alice), type(uint256).max);
    }

    function test_OwnerCanMint() public {
        token.mint(alice, 5 ether);
        assertEq(token.balanceOf(alice), 5 ether);
        assertEq(token.totalSupply(), INITIAL + 5 ether);
    }

    function test_NonOwnerCannotMint() public {
        vm.prank(alice);
        vm.expectRevert(BaseGuildToken.NotOwner.selector);
        token.mint(alice, 1);
    }

    function test_Burn() public {
        token.burn(100 ether);
        assertEq(token.balanceOf(address(this)), INITIAL - 100 ether);
        assertEq(token.totalSupply(), INITIAL - 100 ether);
    }

    function test_BurnRevertsOnInsufficientBalance() public {
        vm.prank(alice);
        vm.expectRevert(BaseGuildToken.InsufficientBalance.selector);
        token.burn(1);
    }

    function test_TransferOwnership() public {
        token.transferOwnership(alice);
        assertEq(token.owner(), alice);

        vm.expectRevert(BaseGuildToken.NotOwner.selector);
        token.mint(address(this), 1);
    }

    function test_TransferOwnershipRevertsOnZeroAddress() public {
        vm.expectRevert(BaseGuildToken.ZeroAddress.selector);
        token.transferOwnership(address(0));
    }

    function testFuzz_TransferConservesSupply(address to, uint256 amount) public {
        vm.assume(to != address(0));
        amount = bound(amount, 0, INITIAL);
        token.transfer(to, amount);
        assertEq(token.totalSupply(), INITIAL);
        assertEq(token.balanceOf(address(this)) + (to == address(this) ? 0 : token.balanceOf(to)), INITIAL);
    }
}
