// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CarboniumDistribution is Ownable{

    IERC20 carboniumToken;

    event TokenDistributed(address receiver, uint256 amount);

    constructor(IERC20 _token) {
        carboniumToken = _token;
    }

    function distribute(address[] memory _addresses, uint256[] memory _amounts) external onlyOwner {
        require(_addresses.length == _amounts.length, "Length of addresses is not the same as length of amounts");
        for (uint16 i=0; i < _addresses.length; i++) {
            carboniumToken.transferFrom(msg.sender, _addresses[i], _amounts[i]);
            emit TokenDistributed(_addresses[i], _amounts[i]);
        }
    }

}