// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ParcelContract is
    ERC721("Parcel", "PAR"),
    Ownable
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter public _tokenIds;
    string public baseURI;

    constructor() {
        // Mint 10 parcels initially
        for (uint i = 0; i < 10; i++) {
            mint(msg.sender);
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _baseURIParam) public onlyOwner {
        baseURI = _baseURIParam;
    }

    function mint(address to) public onlyOwner returns (uint256) {
        uint id = _tokenIds.current();
        _safeMint(to, id);

        _tokenIds.increment();

        return id;
    }
}
