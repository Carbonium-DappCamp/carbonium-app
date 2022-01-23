// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarboniumToken is ERC20{

    uint public INITIAL_SUPPLY = 10000000000000; // TBD: how many?

    constructor() ERC20("Carbonium Token", "CRB") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

}