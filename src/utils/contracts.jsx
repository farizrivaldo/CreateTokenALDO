// export const CONTRACTS = {
//   TOKEN_ADDRESS: "0xDB9ba19139D849A3E509F0D5e20536C4821e975e",
//   MARKETPLACE_ADDRESS: "0x679C0F7EC386689C3b12d3d636351A5ef646C098",
// };

// export const TOKEN_ABI = [
//   "function name() view returns (string)",
//   "function symbol() view returns (string)",
//   "function totalSupply() view returns (uint256)",
//   "function balanceOf(address) view returns (uint256)",
//   "function transfer(address to, uint256 amount) returns (bool)",
//   "function mint(address to, uint256 amount)",
//   "function burn(uint256 amount)",
//   "function owner() view returns (address)",
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function allowance(address owner, address spender) view returns (uint256)",
//   "event Transfer(address indexed from, address indexed to, uint256 value)"
// ];

// export const MARKETPLACE_ABI = [
//   "function mintNFT(string memory tokenURI) returns (uint256)",
//   "function listNFT(uint256 tokenId, uint256 price)",
//   "function unlistNFT(uint256 tokenId)",
//   "function buyNFT(uint256 tokenId)",
//   "function burnNFT(uint256 tokenId)",
//   "function ownerOf(uint256 tokenId) view returns (address)",
//   "function tokenURI(uint256 tokenId) view returns (string)",
//   "function getTotalSupply() view returns (uint256)",
//   "function exists(uint256 tokenId) view returns (bool)",
//   "function listings(uint256) view returns (uint256 price, address seller, bool isListed)",
//   "function owner() view returns (address)",
//   "event NFTMinted(uint256 indexed tokenId, address indexed owner, string tokenURI)",
//   "event NFTListed(uint256 indexed tokenId, uint256 price, address indexed seller)",
//   "event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price)",
//   "event NFTUnlisted(uint256 indexed tokenId, address indexed seller)"
// ];


export const CONTRACTS = {
  TOKEN_ADDRESS: "0xDB9ba19139D849A3E509F0D5e20536C4821e975e",
  MARKETPLACE_ADDRESS: "0x679C0F7EC386689C3b12d3d636351A5ef646C098",
  ECOSYSTEM_ADDRESS: "0xFc041ecbaC08fD33c73266a60cBa673C15d5b4E4", // Update after deployment
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

export const ECOSYSTEM_ABI = [
  // Staking Functions
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function claimRewards() external",
  "function calculateRewards(address user) view returns (uint256)",
  "function getStakeInfo(address user) view returns (uint256 stakedAmount, uint256 pendingRewards, uint256 totalClaimed, uint8 tier, string tierName, uint256 apyRate)",
  "function stakes(address) view returns (uint256 amount, uint256 startTime, uint256 lastClaimTime, uint256 totalRewardsClaimed, uint8 tier, bool isActive)",
  "function totalStaked() view returns (uint256)",
  
  // Governance Functions
  "function createProposal(string title, string description) returns (uint256)",
  "function vote(uint256 proposalId, bool support)",
  "function executeProposal(uint256 proposalId)",
  "function getProposal(uint256 proposalId) view returns (address proposer, string title, string description, uint256 forVotes, uint256 againstVotes, uint256 endTime, bool executed, bool isActive)",
  "function proposals(uint256) view returns (uint256 id, address proposer, string title, string description, uint256 startTime, uint256 endTime, uint256 forVotes, uint256 againstVotes, bool executed, bool exists)",
  "function proposalCount() view returns (uint256)",
  "function hasVoted(uint256, address) view returns (bool)",
  
  // Vesting Functions
  "function createVestingSchedule(address beneficiary, uint256 amount, uint256 duration, uint256 cliffDuration, bool revocable)",
  "function claimVested(uint256 scheduleIndex)",
  "function revokeVesting(address beneficiary, uint256 scheduleIndex)",
  "function getVestingInfo(address beneficiary, uint256 scheduleIndex) view returns (uint256 totalAmount, uint256 claimedAmount, uint256 vestedAmount, uint256 claimableAmount, uint256 startTime, uint256 endTime, bool revoked)",
  
  // Airdrop Functions
  "function createAirdrop(uint256 amountPerUser, address[] eligibleUsers, uint256 duration) returns (uint256)",
  "function claimAirdrop(uint256 airdropId)",
  "function getAirdropInfo(uint256 airdropId) view returns (uint256 totalAmount, uint256 amountPerUser, uint256 endTime, bool active, bool userClaimed, bool userEligible)",
  "function airdropCount() view returns (uint256)",
  
  // Admin Functions
  "function depositRewards(uint256 amount)",
  "function emergencyWithdraw()",
  "function owner() view returns (address)",
  
  // Constants
  "function BRONZE_MIN() view returns (uint256)",
  "function SILVER_MIN() view returns (uint256)",
  "function GOLD_MIN() view returns (uint256)",
  "function PLATINUM_MIN() view returns (uint256)",
  "function BRONZE_APY() view returns (uint256)",
  "function SILVER_APY() view returns (uint256)",
  "function GOLD_APY() view returns (uint256)",
  "function PLATINUM_APY() view returns (uint256)",
  "function MIN_PROPOSAL_STAKE() view returns (uint256)",
  "function VOTING_PERIOD() view returns (uint256)",
  
  // Events
  "event Staked(address indexed user, uint256 amount, uint8 tier)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 reward)",
  "event TierUpgraded(address indexed user, uint8 oldTier, uint8 newTier)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title)",
  "event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId)",
  "event VestingScheduleCreated(address indexed beneficiary, uint256 amount, uint256 duration)",
  "event VestingClaimed(address indexed beneficiary, uint256 amount)",
  "event VestingRevoked(address indexed beneficiary, uint256 scheduleIndex)",
  "event AirdropCreated(uint256 indexed airdropId, uint256 totalAmount)",
  "event AirdropClaimed(uint256 indexed airdropId, address indexed user, uint256 amount)"
];