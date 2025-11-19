# 📁 Project Structure

Complete file structure documentation for ALDO DeFi Ecosystem.

---

## 🗂️ Root Directory

```
CreateTokenALDO/
├── contracts/              # Smart contracts (Solidity)
├── scripts/               # Deployment scripts
├── test/                  # Contract tests
├── src/                   # React frontend
├── public/                # Static files
├── artifacts/             # Compiled contracts (auto-generated)
├── cache/                 # Hardhat cache (auto-generated)
├── node_modules/          # Dependencies (auto-generated)
├── hardhat.config.js      # Hardhat configuration
├── package.json           # Project dependencies
├── .env                   # Environment variables (DO NOT COMMIT)
├── .gitignore            # Git ignore rules
├── README.md             # Main documentation
├── QUICK-START.md        # Quick start guide
└── LICENSE               # MIT License
```

---

## 📜 Smart Contracts (`/contracts`)

```
contracts/
├── ALDOToken.sol          # ERC-20 Token Contract
│   ├── Mintable (owner only)
│   ├── Burnable
│   ├── Standard ERC-20 functions
│   └── OpenZeppelin based
│
├── ALDOMarketplace.sol    # NFT Marketplace (ERC-721)
│   ├── NFT Minting
│   ├── Listing/Unlisting
│   ├── Buy/Sell with ALDO
│   └── Burn functionality
│
└── ALDOEcosystem.sol      # DeFi Ecosystem (Main)
    ├── Staking System (4 tiers)
    ├── Governance (DAO)
    ├── Vesting System
    ├── Airdrop Distribution
    └── Admin Functions
```

### Contract Breakdown

#### ALDOToken.sol
```solidity
Functions:
├── mint(address, uint256)           # Create new tokens
├── burn(uint256)                    # Destroy tokens
├── transfer(address, uint256)       # Send tokens
├── approve(address, uint256)        # Approve spending
├── balanceOf(address)               # Check balance
└── totalSupply()                    # Get total supply
```

#### ALDOMarketplace.sol
```solidity
Functions:
├── mintNFT(string)                  # Create NFT
├── listNFT(uint256, uint256)        # List for sale
├── unlistNFT(uint256)               # Remove listing
├── buyNFT(uint256)                  # Purchase NFT
├── burnNFT(uint256)                 # Destroy NFT
└── tokenURI(uint256)                # Get metadata
```

#### ALDOEcosystem.sol
```solidity
Functions:
├── Staking:
│   ├── stake(uint256)
│   ├── unstake(uint256)
│   ├── claimRewards()
│   └── getStakeInfo(address)
│
├── Governance:
│   ├── createProposal(string, string)
│   ├── vote(uint256, bool)
│   ├── executeProposal(uint256)
│   └── getProposal(uint256)
│
├── Vesting:
│   ├── createVestingSchedule(...)
│   ├── claimVested(uint256)
│   ├── revokeVesting(address, uint256)
│   └── getVestingInfo(address, uint256)
│
└── Airdrop:
    ├── createAirdrop(uint256, address[], uint256)
    ├── claimAirdrop(uint256)
    └── getAirdropInfo(uint256)
```

---

## 🚀 Scripts (`/scripts`)

```
scripts/
├── deploy.js              # Deploy Token & Marketplace
│   └── Used for initial deployment
│
└── deploy-ecosystem.js    # Deploy Ecosystem Contract
    ├── Deploys ALDOEcosystem
    ├── Links to existing token
    └── Outputs deployment info
```

---

## ⚛️ Frontend (`/src`)

```
src/
├── components/            # React components
│   ├── Token/
│   │   ├── TokenDashboard.jsx
│   │   ├── MintToken.jsx
│   │   ├── TransferToken.jsx
│   │   └── TransferETH.jsx
│   │
│   ├── Ecosystem/
│   │   ├── StakingDashboard.jsx
│   │   ├── Governance.jsx
│   │   ├── Vesting.jsx
│   │   └── Airdrop.jsx
│   │
│   ├── NFT/
│   │   ├── NFTDashboard.jsx
│   │   ├── CreateNFT.jsx
│   │   ├── NFTMarketplace.jsx
│   │   └── MyNFTs.jsx
│   │
│   ├── Common/
│   │   ├── LandingPage.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TokenStatistics.jsx
│   │   └── TransactionHistory.jsx
│   │
│   └── [Component Files Listed Below]
│
├── contexts/              # React Context API
│   └── Web3Context.jsx
│       ├── Wallet connection (MetaMask + Privy)
│       ├── Contract instances
│       ├── Balance management
│       └── Network handling
│
├── utils/                 # Utility files
│   └── contracts.js
│       ├── Contract addresses
│       ├── ABIs (Application Binary Interface)
│       └── Constants
│
├── App.js                 # Main application component
├── App.css               # Global styles
├── index.js              # React entry point
└── index.css             # Tailwind imports
```

---

## 📦 Component Details

### Token Components

#### TokenDashboard.jsx
```javascript
Purpose: Display token information and statistics
Features:
├── Balance display
├── Total supply
├── Token statistics with charts
├── Transaction history
└── Quick actions
```

#### MintToken.jsx
```javascript
Purpose: Mint and burn tokens (Owner only)
Features:
├── Mint form (recipient + amount)
├── Burn form (amount)
├── Balance checking
└── Transaction status
```

#### TransferToken.jsx
```javascript
Purpose: Transfer ALDO tokens
Features:
├── Send to any address
├── Max button (send all)
├── Balance validation
└── Transaction confirmation
```

#### TransferETH.jsx
```javascript
Purpose: Transfer Sepolia ETH
Features:
├── Send ETH between wallets
├── Gas estimation
├── Transaction cost calculator
├── Faucet links
└── Quick amount presets
```

### Ecosystem Components

#### StakingDashboard.jsx
```javascript
Purpose: Stake tokens and earn rewards
Features:
├── Stake tokens (4 tiers)
├── View tier benefits
├── Claim rewards
├── Unstake anytime
├── APY calculator
└── Tier progress tracking
```

#### Governance.jsx
```javascript
Purpose: DAO governance and voting
Features:
├── Create proposals (10k ALDO required)
├── Vote FOR/AGAINST
├── View proposal history
├── Execute proposals (owner)
├── Voting power display
└── Time remaining countdown
```

#### Vesting.jsx
```javascript
Purpose: Token vesting management
Features:
├── Create vesting schedules (owner)
├── View all schedules
├── Claim vested tokens
├── Progress visualization
├── Revoke schedules (owner)
└── Multiple schedules per address
```

#### Airdrop.jsx
```javascript
Purpose: Mass token distribution
Features:
├── Create airdrops (owner)
├── Add eligible addresses
├── Set amount per user
├── Time-limited claims
├── Claim airdrop (eligible users)
└── View airdrop status
```

### NFT Components

#### NFTDashboard.jsx
```javascript
Purpose: NFT ecosystem overview
Features:
├── Total NFTs count
├── Your NFTs count
├── Listed NFTs count
├── Quick navigation
└── Statistics display
```

#### CreateNFT.jsx
```javascript
Purpose: Mint new NFTs
Features:
├── Name input
├── Description input
├── Image URL input
├── Preview display
└── Metadata creation
```

#### NFTMarketplace.jsx
```javascript
Purpose: Browse and buy NFTs
Features:
├── View all listed NFTs
├── Filter by price
├── Buy with ALDO tokens
├── NFT details display
└── Seller information
```

#### MyNFTs.jsx
```javascript
Purpose: Manage owned NFTs
Features:
├── View collection
├── List for sale
├── Unlist NFTs
├── Burn NFTs (owner)
└── Transfer NFTs
```

### Common Components

#### LandingPage.jsx
```javascript
Purpose: Welcome page & authentication
Features:
├── Connect MetaMask
├── Account Abstraction (Privy)
├── Feature showcase
├── Network information
└── Faucet links
```

#### Navbar.jsx
```javascript
Purpose: Top navigation bar
Features:
├── Wallet address display
├── Balance display (ETH + ALDO)
├── Disconnect button
├── Add token to MetaMask
└── Network indicator
```

#### Sidebar.jsx
```javascript
Purpose: Side navigation menu
Features:
├── Grouped menu items
├── Active route highlighting
├── Badge indicators (NEW)
├── Collapsible sidebar
└── Icon + description layout
```

#### TokenStatistics.jsx
```javascript
Purpose: Advanced token analytics
Features:
├── Volume charts (Recharts)
├── Transaction count
├── Top holders list
├── Supply distribution
├── Price trends (mock)
└── Market statistics
```

#### TransactionHistory.jsx
```javascript
Purpose: On-chain transaction tracking
Features:
├── Token transfers (mint/burn/send/receive)
├── NFT transactions (mint/list/sold)
├── Filter by type
├── Etherscan links
├── Real-time updates
└── Summary statistics
```

---

## 🔧 Configuration Files

### hardhat.config.js
```javascript
Purpose: Hardhat development environment setup
Contains:
├── Solidity version (0.8.20)
├── Network configurations (Sepolia)
├── Compiler settings
├── Etherscan verification
└── Path mappings
```

### package.json
```json
Dependencies:
├── Smart Contract:
│   ├── @openzeppelin/contracts
│   ├── hardhat
│   └── ethers
│
└── Frontend:
    ├── react
    ├── react-router-dom
    ├── @privy-io/react-auth
    ├── lucide-react
    └── recharts
```

### .env
```bash
Environment Variables:
├── PRIVATE_KEY              # MetaMask private key
├── SEPOLIA_RPC_URL         # Alchemy/Infura RPC
└── ETHERSCAN_API_KEY       # For verification (optional)
```

---

## 📊 Data Flow

```
┌─────────────┐
│   User      │
└─────┬───────┘
      │
      ▼
┌─────────────────────┐
│  React Components   │
│  (UI Layer)         │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│  Web3Context        │
│  (State Management) │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│  Ethers.js          │
│  (Web3 Provider)    │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│  Smart Contracts    │
│  (Blockchain)       │
└─────────────────────┘
```

---

## 🎯 Component Dependencies

```
App.js
├── Web3Context (Provider)
│   ├── Provides: account, provider, contracts
│   └── Used by: All components
│
├── Router
│   ├── LandingPage (public)
│   ├── Navbar (authenticated)
│   ├── Sidebar (authenticated)
│   └── Routes (authenticated)
│       ├── Token Routes
│       ├── Ecosystem Routes
│       └── NFT Routes
```

---

## 📝 File Naming Conventions

- **Components**: PascalCase (e.g., `TokenDashboard.jsx`)
- **Utilities**: camelCase (e.g., `contracts.js`)
- **Contracts**: PascalCase (e.g., `ALDOToken.sol`)
- **Scripts**: kebab-case (e.g., `deploy-ecosystem.js`)
- **Styles**: kebab-case (e.g., `app.css`)

---

## 🔍 Important Files Quick Reference

| File | Purpose | Location |
|------|---------|----------|
| ALDOEcosystem.sol | Main DeFi contract | `/contracts` |
| Web3Context.jsx | Web3 state management | `/src/contexts` |
| contracts.js | Contract config | `/src/utils` |
| App.js | Main app component | `/src` |
| hardhat.config.js | Hardhat setup | `/` |
| deploy-ecosystem.js | Deployment script | `/scripts` |

---

## 🚨 Files to NEVER Commit

```
.env                    # Private keys & secrets
node_modules/          # Dependencies
artifacts/             # Compiled contracts
cache/                 # Hardhat cache
.DS_Store              # Mac system files
*.log                  # Log files
```

**Always check `.gitignore`!**

---

## 📚 Generated Folders

These are auto-generated and should not be edited manually:

- `artifacts/` - Compiled contract artifacts (JSON)
- `cache/` - Hardhat compilation cache
- `node_modules/` - NPM dependencies
- `build/` - React production build

---

## 🎨 Styling Structure

```
Styling Approach: Tailwind CSS + Custom CSS

├── Tailwind Utilities
│   └── Defined in index.css
│
└── Custom Classes (App.css)
    ├── .card
    ├── .btn
    ├── .gradient-text
    ├── .alert
    └── .modal-overlay
```

---

## 🔗 Component Communication

```
Parent → Child:
└── Props passing

Child → Parent:
└── Callback functions

Global State:
└── Web3Context (React Context API)

Event System:
└── Smart contract events → Frontend listeners
```

---

**Last Updated**: December 2024

For questions about file structure, see [README.md](README.md) or open an [issue](https://github.com/farizrivaldo/CreateTokenALDO/issues).