// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ALDOMarketplace is ERC721URIStorage, Ownable {
    IERC20 public aldoToken;

    uint256 private _tokenIdCounter;

    struct NFTListing {
        uint256 price;
        address seller;
        bool isListed;
    }

    mapping(uint256 => NFTListing) public listings;

    event NFTMinted(uint256 indexed tokenId, address indexed owner, string tokenURI);
    event NFTListed(uint256 indexed tokenId, uint256 price, address indexed seller);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId);
    event NFTBurned(uint256 indexed tokenId);

    // ----------------------------------------------------------
    // FIX: Ownable() tidak menerima parameter di OZ 4.x
    // ----------------------------------------------------------
    constructor(address _aldoTokenAddress)
        ERC721("ALDO NFT", "ALDONFT")
        Ownable()
    {
        aldoToken = IERC20(_aldoTokenAddress);
    }

    // ----------------------------------------------------------
    // MINT NFT
    // ----------------------------------------------------------
    function mintNFT(string memory tokenURI) public returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        emit NFTMinted(newTokenId, msg.sender, tokenURI);
        return newTokenId;
    }

    // ----------------------------------------------------------
    // LIST NFT
    // ----------------------------------------------------------
    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        require(!listings[tokenId].isListed, "Already listed");

        listings[tokenId] = NFTListing(price, msg.sender, true);

        // Move NFT into escrow
        _transfer(msg.sender, address(this), tokenId);

        emit NFTListed(tokenId, price, msg.sender);
    }

    // ----------------------------------------------------------
    // UNLIST NFT
    // ----------------------------------------------------------
    function unlistNFT(uint256 tokenId) public {
        require(listings[tokenId].seller == msg.sender, "Not the seller");
        require(listings[tokenId].isListed, "Not listed");

        listings[tokenId].isListed = false;

        // Return NFT from contract back to seller
        _transfer(address(this), msg.sender, tokenId);

        emit NFTUnlisted(tokenId);
    }

    // ----------------------------------------------------------
    // BUY NFT WITH ALDO TOKEN
    // ----------------------------------------------------------
    function buyNFT(uint256 tokenId) public {
        NFTListing memory listing = listings[tokenId];
        require(listing.isListed, "NFT not listed");
        require(msg.sender != listing.seller, "Cannot buy your own NFT");

        // Transfer ALDO payment
        require(
            aldoToken.transferFrom(msg.sender, listing.seller, listing.price),
            "Token transfer failed"
        );

        // Transfer NFT to buyer
        _transfer(address(this), msg.sender, tokenId);

        listings[tokenId].isListed = false;

        emit NFTSold(tokenId, msg.sender, listing.seller, listing.price);
    }

    // ----------------------------------------------------------
    // BURN NFT (Owner Only)
    // ----------------------------------------------------------
    function burnNFT(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");

        if (listings[tokenId].isListed) {
            listings[tokenId].isListed = false;
        }

        _burn(tokenId);

        emit NFTBurned(tokenId);
    }

    // ----------------------------------------------------------
    // VIEW FUNCTIONS
    // ----------------------------------------------------------
    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }
}
