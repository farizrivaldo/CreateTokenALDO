# 📖 API Reference

Complete API documentation for ALDO DeFi Ecosystem smart contracts.

---

## 📜 Table of Contents

1. [ALDOToken Contract](#aldotoken-contract)
2. [ALDOMarketplace Contract](#aldomarketplace-contract)
3. [ALDOEcosystem Contract](#aldoecosystem-contract)
   - [Staking Functions](#staking-functions)
   - [Governance Functions](#governance-functions)
   - [Vesting Functions](#vesting-functions)
   - [Airdrop Functions](#airdrop-functions)
4. [Events](#events)
5. [Error Codes](#error-codes)

---

## 🪙 ALDOToken Contract

**Address**: `0xDB9ba19139D849A3E509F0D5e20536C4821e975e`  
**Type**: ERC-20 Token  
**Network**: Sepolia Testnet

### Read Functions

#### `name()` → `string`
Returns the token name.

```javascript
const name = await tokenContract.name();
// Returns: "ALDO Token"
```

#### `symbol()` → `string`
Returns the token symbol.

```javascript
const symbol = await tokenContract.symbol();
// Returns: "ALDO"
```

#### `decimals()` → `uint8`
Returns token decimals.

```javascript
const decimals = await tokenContract.decimals();
// Returns: 18
```

#### `totalSupply()` → `uint256`
Returns total token supply.

```javascript
const supply = await tokenContract.totalSupply();
// Returns: Total supply in wei
```

#### `balanceOf(address account)` → `uint256`
Returns balance of an address.

**Parameters:**
- `account` (address): Wallet address to check

```javascript
const balance = await tokenContract.balanceOf("0x...");
// Returns: Balance in wei
```

#### `allowance(address owner, address spender)` → `uint256`
Returns approved spending amount.

**Parameters:**
- `owner` (address): Token owner
- `spender` (address): Approved spender

```javascript
const allowance = await tokenContract.allowance(ownerAddr, spenderAddr);
```

#### `owner()` → `address`
Returns contract owner address.

```javascript
const owner = await tokenContract.owner();
```

### Write Functions

#### `mint(address to, uint256 amount)`
Mints new tokens (Owner only).

**Parameters:**
- `to` (address): Recipient address
- `amount` (uint256): Amount in wei

```javascript
const tx = await tokenContract.mint(
  "0x...",
  ethers.utils.parseEther("1000")
);
await tx.wait();
```

**Requirements:**
- ✅ Caller must be owner
- ✅ `to` address cannot be zero

#### `burn(uint256 amount)`
Burns tokens from caller's balance.

**Parameters:**
- `amount` (uint256): Amount to burn in wei

```javascript
const tx = await tokenContract.burn(
  ethers.utils.parseEther("100")
);
await tx.wait();
```

**Requirements:**
- ✅ Caller must have sufficient balance

#### `transfer(address to, uint256 amount)` → `bool`
Transfers tokens to another address.

**Parameters:**
- `to` (address): Recipient
- `amount` (uint256): Amount in wei

```javascript
const tx = await tokenContract.transfer(
  "0x...",
  ethers.utils.parseEther("50")
);
await tx.wait();
```

#### `approve(address spender, uint256 amount)` → `bool`
Approves spender to use tokens.

**Parameters:**
- `spender` (address): Address to approve
- `amount` (uint256): Amount in wei

```javascript
const tx = await tokenContract.approve(
  ecosystemAddress,
  ethers.utils.parseEther("10000")
);
await tx.wait();
```

---

## 🎨 ALDOMarketplace Contract

**Address**: `0x679C0F7EC386689C3b12d3d636351A5ef646C098`  
**Type**: ERC-721 NFT  
**Network**: Sepolia Testnet

### Read Functions

#### `getTotalSupply()` → `uint256`
Returns total number of NFTs minted.

```javascript
const total = await marketplaceContract.getTotalSupply();
```

#### `ownerOf(uint256 tokenId)` → `address`
Returns owner of specific NFT.

**Parameters:**
- `tokenId` (uint256): NFT ID

```javascript
const owner = await marketplaceContract.ownerOf(1);
```

#### `tokenURI(uint256 tokenId)` → `string`
Returns metadata URI for NFT.

**Parameters:**
- `tokenId` (uint256): NFT ID

```javascript
const uri = await marketplaceContract.tokenURI(1);
```

#### `exists(uint256 tokenId)` → `bool`
Checks if NFT exists.

```javascript
const exists = await marketplaceContract.exists(1);
```

#### `listings(uint256 tokenId)` → `(uint256 price, address seller, bool isListed)`
Returns listing information.

```javascript
const listing = await marketplaceContract.listings(1);
// listing.price, listing.seller, listing.isListed
```

### Write Functions

#### `mintNFT(string memory tokenURI)` → `uint256`
Creates a new NFT.

**Parameters:**
- `tokenURI` (string): Metadata URI (IPFS or data URI)

```javascript
const metadata = {
  name: "My NFT",
  description: "Description here",
  image: "https://..."
};
const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

const tx = await marketplaceContract.mintNFT(tokenURI);
const receipt = await tx.wait();
const tokenId = receipt.events[0].args.tokenId;
```

**Returns**: NFT token ID

#### `listNFT(uint256 tokenId, uint256 price)`
Lists NFT for sale.

**Parameters:**
- `tokenId` (uint256): NFT ID to list
- `price` (uint256): Price in ALDO (wei)

```javascript
const tx = await marketplaceContract.listNFT(
  1,
  ethers.utils.parseEther("100")
);
await tx.wait();
```

**Requirements:**
- ✅ Caller must own NFT
- ✅ NFT not already listed

#### `unlistNFT(uint256 tokenId)`
Removes NFT from sale.

**Parameters:**
- `tokenId` (uint256): NFT ID

```javascript
const tx = await marketplaceContract.unlistNFT(1);
await tx.wait();
```

#### `buyNFT(uint256 tokenId)`
Purchases a listed NFT.

**Parameters:**
- `tokenId` (uint256): NFT ID to buy

```javascript
// First approve ALDO tokens
await tokenContract.approve(
  marketplaceAddress,
  priceInWei
);

// Then buy NFT
const tx = await marketplaceContract.buyNFT(1);
await tx.wait();
```

**Requirements:**
- ✅ NFT must be listed
- ✅ Buyer must approve ALDO tokens
- ✅ Buyer has sufficient ALDO

#### `burnNFT(uint256 tokenId)`
Destroys an NFT (Owner only).

**Parameters:**
- `tokenId` (uint256): NFT ID to burn

```javascript
const tx = await marketplaceContract.burnNFT(1);
await tx.wait();
```

---

## 🏦 ALDOEcosystem Contract

**Address**: `[Update after deployment]`  
**Type**: DeFi Platform  
**Network**: Sepolia Testnet

---

## Staking Functions

### Read Functions

#### `stakes(address user)` → `StakeInfo`
Returns user's stake information.

```javascript
const stakeInfo = await ecosystemContract.stakes(userAddress);
/*
{
  amount: BigNumber,
  startTime: BigNumber,
  lastClaimTime: BigNumber,
  totalRewardsClaimed: BigNumber,
  tier: 0-4, // 0=NONE, 1=BRONZE, 2=SILVER, 3=GOLD, 4=PLATINUM
  isActive: boolean
}
*/
```

#### `getStakeInfo(address user)` → `(uint256, uint256, uint256, StakeTier, string, uint256)`
Returns formatted stake info.

**Returns:**
- `stakedAmount` (uint256): Amount staked
- `pendingRewards` (uint256): Unclaimed rewards
- `totalClaimed` (uint256): Total rewards claimed
- `tier` (uint8): Current tier (0-4)
- `tierName` (string): Tier name
- `apyRate` (uint256): APY rate in basis points

```javascript
const info = await ecosystemContract.getStakeInfo(userAddress);
```

#### `calculateRewards(address user)` → `uint256`
Calculates pending rewards for user.

```javascript
const rewards = await ecosystemContract.calculateRewards(userAddress);
// Returns: Pending rewards in wei
```

#### `totalStaked()` → `uint256`
Returns total amount staked in platform.

```javascript
const total = await ecosystemContract.totalStaked();
```

#### Constants

```javascript
// Tier Requirements
const BRONZE_MIN = await ecosystemContract.BRONZE_MIN();    // 1,000 ALDO
const SILVER_MIN = await ecosystemContract.SILVER_MIN();    // 5,000 ALDO
const GOLD_MIN = await ecosystemContract.GOLD_MIN();        // 25,000 ALDO
const PLATINUM_MIN = await ecosystemContract.PLATINUM_MIN(); // 100,000 ALDO

// APY Rates (basis points)
const BRONZE_APY = await ecosystemContract.BRONZE_APY();    // 1000 = 10%
const SILVER_APY = await ecosystemContract.SILVER_APY();    // 1500 = 15%
const GOLD_APY = await ecosystemContract.GOLD_APY();        // 2000 = 20%
const PLATINUM_APY = await ecosystemContract.PLATINUM_APY(); // 3000 = 30%
```

### Write Functions

#### `stake(uint256 amount)`
Stakes ALDO tokens.

**Parameters:**
- `amount` (uint256): Amount to stake in wei

```javascript
// First approve tokens
await tokenContract.approve(
  ecosystemAddress,
  ethers.utils.parseEther("1000")
);

// Then stake
const tx = await ecosystemContract.stake(
  ethers.utils.parseEther("1000")
);
await tx.wait();
```

**Requirements:**
- ✅ Amount > 0
- ✅ User approved ecosystem contract
- ✅ User has sufficient ALDO

**Effects:**
- Auto-claims pending rewards if already staking
- Updates tier based on new total amount
- Emits `Staked` event

#### `unstake(uint256 amount)`
Unstakes tokens.

**Parameters:**
- `amount` (uint256): Amount to unstake in wei

```javascript
const tx = await ecosystemContract.unstake(
  ethers.utils.parseEther("500")
);
await tx.wait();
```

**Requirements:**
- ✅ User has active stake
- ✅ Sufficient staked amount

**Effects:**
- Auto-claims pending rewards
- Updates tier
- Returns tokens to user

#### `claimRewards()`
Claims pending staking rewards.

```javascript
const tx = await ecosystemContract.claimRewards();
await tx.wait();
```

**Requirements:**
- ✅ User has active stake
- ✅ Pending rewards > 0

---

## Governance Functions

### Read Functions

#### `proposalCount()` → `uint256`
Returns total number of proposals.

```javascript
const count = await ecosystemContract.proposalCount();
```

#### `proposals(uint256 proposalId)` → `Proposal`
Returns proposal details.

```javascript
const proposal = await ecosystemContract.proposals(1);
/*
{
  id: BigNumber,
  proposer: address,
  title: string,
  description: string,
  startTime: BigNumber,
  endTime: BigNumber,
  forVotes: BigNumber,
  againstVotes: BigNumber,
  executed: boolean,
  exists: boolean
}
*/
```

#### `getProposal(uint256 proposalId)` → `(...)`
Returns formatted proposal info.

**Returns:**
- `proposer` (address)
- `title` (string)
- `description` (string)
- `forVotes` (uint256)
- `againstVotes` (uint256)
- `endTime` (uint256)
- `executed` (bool)
- `isActive` (bool)

```javascript
const proposal = await ecosystemContract.getProposal(1);
```

#### `hasVoted(uint256 proposalId, address voter)` → `bool`
Checks if address has voted.

```javascript
const voted = await ecosystemContract.hasVoted(1, userAddress);
```

#### `MIN_PROPOSAL_STAKE()` → `uint256`
Minimum stake required to create proposal.

```javascript
const minStake = await ecosystemContract.MIN_PROPOSAL_STAKE();
// Returns: 10,000 ALDO (in wei)
```

#### `VOTING_PERIOD()` → `uint256`
Duration of voting period.

```javascript
const period = await ecosystemContract.VOTING_PERIOD();
// Returns: 7 days (in seconds)
```

### Write Functions

#### `createProposal(string title, string description)` → `uint256`
Creates a new proposal.

**Parameters:**
- `title` (string): Proposal title
- `description` (string): Detailed description

```javascript
const tx = await ecosystemContract.createProposal(
  "Increase staking rewards",
  "Proposal to increase APY rates by 5%..."
);
const receipt = await tx.wait();
const proposalId = receipt.events[0].args.proposalId;
```

**Requirements:**
- ✅ Caller has ≥10,000 ALDO staked

**Returns**: Proposal ID

#### `vote(uint256 proposalId, bool support)`
Votes on a proposal.

**Parameters:**
- `proposalId` (uint256): Proposal to vote on
- `support` (bool): true = FOR, false = AGAINST

```javascript
const tx = await ecosystemContract.vote(1, true); // Vote FOR
await tx.wait();
```

**Requirements:**
- ✅ Proposal exists
- ✅ Voting period active
- ✅ User hasn't voted yet
- ✅ User has active stake

**Effects:**
- Voting power = User's staked amount

#### `executeProposal(uint256 proposalId)`
Executes a passed proposal (Owner only).

**Parameters:**
- `proposalId` (uint256): Proposal to execute

```javascript
const tx = await ecosystemContract.executeProposal(1);
await tx.wait();
```

**Requirements:**
- ✅ Caller is owner
- ✅ Voting ended
- ✅ Not executed yet
- ✅ FOR votes > AGAINST votes

---

## Vesting Functions

### Read Functions

#### `getVestingInfo(address beneficiary, uint256 scheduleIndex)` → `(...)`
Returns vesting schedule details.

**Parameters:**
- `beneficiary` (address): User address
- `scheduleIndex` (uint256): Schedule index (0, 1, 2...)

**Returns:**
- `totalAmount` (uint256)
- `claimedAmount` (uint256)
- `vestedAmount` (uint256)
- `claimableAmount` (uint256)
- `startTime` (uint256)
- `endTime` (uint256)
- `revoked` (bool)

```javascript
const vestingInfo = await ecosystemContract.getVestingInfo(userAddress, 0);
```

### Write Functions

#### `createVestingSchedule(address beneficiary, uint256 amount, uint256 duration, uint256 cliffDuration, bool revocable)`
Creates a vesting schedule (Owner only).

**Parameters:**
- `beneficiary` (address): Who receives tokens
- `amount` (uint256): Total amount to vest (wei)
- `duration` (uint256): Vesting duration (seconds)
- `cliffDuration` (uint256): Cliff period (seconds)
- `revocable` (bool): Can owner revoke?

```javascript
// Approve first
await tokenContract.approve(
  ecosystemAddress,
  ethers.utils.parseEther("10000")
);

// Create vesting
const tx = await ecosystemContract.createVestingSchedule(
  beneficiaryAddress,
  ethers.utils.parseEther("10000"),
  30 * 24 * 60 * 60, // 30 days
  0,                   // No cliff
  true                 // Revocable
);
await tx.wait();
```

**Requirements:**
- ✅ Caller is owner
- ✅ Valid beneficiary
- ✅ Amount > 0
- ✅ Duration > 0
- ✅ Cliff ≤ Duration
- ✅ Owner approved tokens

#### `claimVested(uint256 scheduleIndex)`
Claims vested tokens.

**Parameters:**
- `scheduleIndex` (uint256): Schedule index

```javascript
const tx = await ecosystemContract.claimVested(0);
await tx.wait();
```

**Requirements:**
- ✅ Schedule exists
- ✅ Not revoked
- ✅ Cliff period passed
- ✅ Claimable amount > 0

#### `revokeVesting(address beneficiary, uint256 scheduleIndex)`
Revokes a vesting schedule (Owner only).

**Parameters:**
- `beneficiary` (address): User address
- `scheduleIndex` (uint256): Schedule index

```javascript
const tx = await ecosystemContract.revokeVesting(userAddress, 0);
await tx.wait();
```

**Requirements:**
- ✅ Caller is owner
- ✅ Schedule revocable
- ✅ Not already revoked

**Effects:**
- Transfers vested tokens to beneficiary
- Returns unvested tokens to owner

---

## Airdrop Functions

### Read Functions

#### `airdropCount()` → `uint256`
Returns total number of airdrops.

```javascript
const count = await ecosystemContract.airdropCount();
```

#### `getAirdropInfo(uint256 airdropId)` → `(...)`
Returns airdrop information.

**Parameters:**
- `airdropId` (uint256): Airdrop ID

**Returns:**
- `totalAmount` (uint256)
- `amountPerUser` (uint256)
- `endTime` (uint256)
- `active` (bool)
- `userClaimed` (bool)
- `userEligible` (bool)

```javascript
const airdropInfo = await ecosystemContract.getAirdropInfo(1);
```

### Write Functions

#### `createAirdrop(uint256 amountPerUser, address[] eligibleUsers, uint256 duration)` → `uint256`
Creates an airdrop (Owner only).

**Parameters:**
- `amountPerUser` (uint256): Amount each user gets (wei)
- `eligibleUsers` (address[]): List of eligible addresses
- `duration` (uint256): Claim duration (seconds)

```javascript
const eligibleAddresses = [
  "0x123...",
  "0x456...",
  "0x789..."
];

const totalAmount = ethers.utils.parseEther("100").mul(eligibleAddresses.length);

// Approve first
await tokenContract.approve(ecosystemAddress, totalAmount);

// Create airdrop
const tx = await ecosystemContract.createAirdrop(
  ethers.utils.parseEther("100"),
  eligibleAddresses,
  7 * 24 * 60 * 60 // 7 days
);
const receipt = await tx.wait();
const airdropId = receipt.events[0].args.airdropId;
```

**Requirements:**
- ✅ Caller is owner
- ✅ Eligible users > 0
- ✅ Amount per user > 0
- ✅ Owner approved total amount

**Returns**: Airdrop ID

#### `claimAirdrop(uint256 airdropId)`
Claims airdrop tokens.

**Parameters:**
- `airdropId` (uint256): Airdrop ID

```javascript
const tx = await ecosystemContract.claimAirdrop(1);
await tx.wait();
```

**Requirements:**
- ✅ Airdrop active
- ✅ Before end time
- ✅ User not claimed yet
- ✅ User is eligible

---

## 📡 Events

### Token Events

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
```

### Staking Events

```solidity
event Staked(address indexed user, uint256 amount, StakeTier tier);
event Unstaked(address indexed user, uint256 amount);
event RewardsClaimed(address indexed user, uint256 reward);
event TierUpgraded(address indexed user, StakeTier oldTier, StakeTier newTier);
```

### Governance Events

```solidity
event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
event ProposalExecuted(uint256 indexed proposalId);
```

### Vesting Events

```solidity
event VestingScheduleCreated(address indexed beneficiary, uint256 amount, uint256 duration);
event VestingClaimed(address indexed beneficiary, uint256 amount);
event VestingRevoked(address indexed beneficiary, uint256 scheduleIndex);
```

### Airdrop Events

```solidity
event AirdropCreated(uint256 indexed airdropId, uint256 totalAmount);
event AirdropClaimed(uint256 indexed airdropId, address indexed user, uint256 amount);
```

### NFT Events

```solidity
event NFTMinted(uint256 indexed tokenId, address indexed owner, string tokenURI);
event NFTListed(uint256 indexed tokenId, uint256 price, address indexed seller);
event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
event NFTUnlisted(uint256 indexed tokenId, address indexed seller);
```

---

## ⚠️ Error Codes

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot stake 0" | Amount is 0 | Enter amount > 0 |
| "Transfer failed" | Token transfer failed | Check approval & balance |
| "No active stake" | User not staking | Stake tokens first |
| "Insufficient staked amount" | Unstaking more than staked | Check staked amount |
| "Need 10k ALDO staked to propose" | < 10k staked | Stake more tokens |
| "Already voted" | User voted already | Can't vote twice |
| "Voting ended" | Voting period over | Too late to vote |
| "Proposal rejected" | AGAINST > FOR | Proposal failed |
| "Cliff not reached" | Too early to claim | Wait for cliff period |
| "Already claimed" | Airdrop claimed | One claim per user |
| "Not eligible" | User not in list | Not eligible for airdrop |

---

## 🔧 Testing Examples

### Test Staking

```javascript
// Approve
await tokenContract.approve(ecosystemAddress, ethers.utils.parseEther("1000"));

// Stake
await ecosystemContract.stake(ethers.utils.parseEther("1000"));

// Check info
const info = await ecosystemContract.getStakeInfo(userAddress);
console.log("Tier:", info.tierName);
console.log("APY:", info.apyRate / 100, "%");

// Wait some time...
// Claim rewards
await ecosystemContract.claimRewards();

// Unstake
await ecosystemContract.unstake(ethers.utils.parseEther("500"));
```

### Test Governance

```javascript
// Create proposal
await ecosystemContract.createProposal(
  "Test Proposal",
  "This is a test"
);

// Vote
await ecosystemContract.vote(1, true);

// Check results
const proposal = await ecosystemContract.getProposal(1);
console.log("FOR:", ethers.utils.formatEther(proposal.forVotes));
console.log("AGAINST:", ethers.utils.formatEther(proposal.againstVotes));
```

---

**Last Updated**: December 2024

For more examples, see [README.md](README.md)