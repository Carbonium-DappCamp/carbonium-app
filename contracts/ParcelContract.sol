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
    string public baseURI = 'ipfs://QmasZiB9nwU1NwDDVP11CHfqLJQnP8kgUcgZ7Y1v4AYX68';

    uint constant _maxParcels = 50;
    mapping (address => bool) _hasClaimed;
    // TODO: parcel awards should be random, but for now increment through
    // until all are awarded
    uint _availableParcel = 0;

    constructor() {
        // Mint all parcels initially
        for (uint i = 0; i < _maxParcels; i++) {
            mint(msg.sender);
        }
    }

    function getMaxParcels() public pure returns (uint) {
        return _maxParcels;
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
    function grant(address _to, uint _count) public onlyOwner {
        require(_to != address(0));
        require(_availableParcel < (_maxParcels - _count));
        for (uint i = 0; i < _count; i++) {
            grantOne(_to, _availableParcel);
        }
    }

    // Public for now, could be made private
    function grantOne(address _to, uint _tokenId) public onlyOwner {
        safeTransferFrom(msg.sender, _to, _tokenId);
        _availableParcel++;
    }
}
