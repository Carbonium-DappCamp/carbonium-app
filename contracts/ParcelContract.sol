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
    string public baseURI = 'ipfs://QmasZiB9nwU1NwDDVP11CHfqLJQnP8kgUcgZ7Y1v4AYX68/';

    uint constant _maxParcels = 50;
    //mapping (address => bool) _hasClaimed; // TODO: only allow one claim per ETH address?

    uint _parcelGrants = 0;

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

    function getRandomUnusedTokenId() public view returns (uint) {
        uint tokenID = uint(keccak256(abi.encodePacked(msg.sender, block.timestamp))) % _maxParcels;
        uint count = 0;
        while (ownerOf(tokenID) != owner()) {
            tokenID = uint(keccak256(abi.encodePacked(msg.sender, block.timestamp, count))) % _maxParcels;
            count++;
        }
        
        return tokenID;
    }

    // Grant a batch of parcel NFTs to a new owner.
    function grant(address _to, uint _count) public onlyOwner {
        require(_to != address(0), "Token burn is not supported");
        require(_parcelGrants < (_maxParcels - _count), "Request is more than available");
        for (uint i = 0; i < _count; i++) {
            uint newId = getRandomUnusedTokenId();
            grantOne(_to, newId);
        }
    }

    // Public for now, could be made private
    function grantOne(address _to, uint _tokenId) public onlyOwner {
        safeTransferFrom(msg.sender, _to, _tokenId);
        _parcelGrants++;
    }
}
