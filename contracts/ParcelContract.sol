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

    uint constant _grantAmount = 10;
    uint constant _maxParcels = 50;
    mapping (address => bool) _hasClaimed;
    // TODO: parcel awards should be random, but for now increment through
    // until all are awarded
    uint _availbleParcel = 0;

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
    function grant(address _to) public onlyOwner {
        require(_to != address(0));
        require(_availbleParcel < (_maxParcels - _grantAmount));
        for (uint i = 0; i < _grantAmount; i++) {
            grantOne(_to, _availbleParcel);
        }
    }

    // Public for now
    function grantOne(address _to, uint _tokenId) public onlyOwner {
        //_approve(_to, _tokenId);
        safeTransferFrom(msg.sender, _to, _tokenId);
        _availbleParcel++;
    }
}
