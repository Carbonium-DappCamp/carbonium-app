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
    string public baseURI = 'ipfs://QmRRqh8G1RGRNTsRq5xKtAcjvMnmDcmSiFqPYU7ngVkz6c';

    uint constant  _grantAmount = 10;
    mapping (address => bool) _hasClaimed;

    constructor() {
        // Mint all 1000 parcels initially
        for (uint i = 0; i < 1000; i++) {
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

    // Grant a batch of parcel NFTs to a new owner.
    function grant(address _to) public onlyOwner {
        for (uint i = 0; i < _grantAmount; i++) {
            grantOne(_to);
        }
    }

    function grantOne(address _to) public onlyOwner {

    }
}
