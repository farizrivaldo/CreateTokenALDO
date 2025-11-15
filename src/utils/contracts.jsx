export const CONTRACTS = {
  TOKEN_ADDRESS: "0xDB9ba19139D849A3E509F0D5e20536C4821e975e",
  MARKETPLACE_ADDRESS: "0x679C0F7EC386689C3b12d3d636351A5ef646C098",
};

export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function owner() view returns (address)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export const MARKETPLACE_ABI = [
  "function mintNFT(string memory tokenURI) returns (uint256)",
  "function listNFT(uint256 tokenId, uint256 price)",
  "function unlistNFT(uint256 tokenId)",
  "function buyNFT(uint256 tokenId)",
  "function burnNFT(uint256 tokenId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function getTotalSupply() view returns (uint256)",
  "function exists(uint256 tokenId) view returns (bool)",
  "function listings(uint256) view returns (uint256 price, address seller, bool isListed)",
  "function owner() view returns (address)",
  "event NFTMinted(uint256 indexed tokenId, address indexed owner, string tokenURI)",
  "event NFTListed(uint256 indexed tokenId, uint256 price, address indexed seller)",
  "event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price)",
  "event NFTUnlisted(uint256 indexed tokenId, address indexed seller)"
];
