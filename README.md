# 🚀 ALDO Token DeFi Ecosystem

<div align="center">

![ALDO Token](https://img.shields.io/badge/ALDO-Token-blue?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-purple?style=for-the-badge)

**A Complete Decentralized Finance (DeFi) Platform on Ethereum Sepolia Testnet**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Smart Contracts](#-smart-contracts)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Usage Guide](#-usage-guide)
- [Testing](#-testing)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

**ALDO Token DeFi Ecosystem** is a comprehensive decentralized finance platform built on Ethereum Sepolia testnet. It combines token management, NFT marketplace, staking, governance, vesting, and airdrop functionalities in a single, user-friendly application.

### Key Highlights

- ✅ **Full-Stack DeFi Platform** - Token, NFT, Staking, Governance, Vesting, Airdrop
- ✅ **Dual Authentication** - MetaMask & Account Abstraction (Privy)
- ✅ **Multi-Tier Staking** - 4 tiers with APY up to 30%
- ✅ **DAO Governance** - Community-driven proposals and voting
- ✅ **NFT Marketplace** - Create, buy, and sell NFTs with ALDO tokens
- ✅ **Production Ready** - Audited contracts, secure architecture

---

## ✨ Features

### 💰 Token Management
- **ERC-20 ALDO Token** with mint, burn, and transfer capabilities
- **Real-time Statistics** - Supply, holders, volume analytics
- **Transaction History** - Complete on-chain tracking
- **Token Transfers** - Send ALDO to any address
- **ETH Transfers** - Send Sepolia ETH between wallets
- **MetaMask Integration** - Add ALDO token with one click

### 🏦 DeFi Ecosystem

#### Staking System
- **4 Tier Structure**:
  - 🥉 **Bronze** (1,000+ ALDO) - 10% APY
  - 🥈 **Silver** (5,000+ ALDO) - 15% APY
  - 🥇 **Gold** (25,000+ ALDO) - 20% APY
  - 💎 **Platinum** (100,000+ ALDO) - 30% APY
- **Auto-Compounding Rewards**
- **Real-time APY Calculations**
- **Instant Unstaking**

#### Governance (DAO)
- **Proposal Creation** (requires 10,000 ALDO staked)
- **Weighted Voting** - Voting power = Staked amount
- **7-Day Voting Period**
- **On-Chain Execution**
- **Proposal History & Status**

#### Vesting System
- **Linear Token Vesting**
- **Cliff Period Support**
- **Multi-Schedule Management**
- **Revocable Vesting (Owner)**
- **Progress Tracking**

#### Airdrop Distribution
- **Mass Token Distribution**
- **Eligibility Verification**
- **Time-Limited Claims**
- **One-Time Claim Protection**

### 🎨 NFT Marketplace
- **Mint NFTs** - Create unique digital assets
- **List for Sale** - Set your own prices in ALDO
- **Buy/Sell NFTs** - Trade with ALDO tokens
- **Collection Management** - Track all your NFTs
- **Burn NFTs** (Owner only)

### 🔐 Authentication
- **MetaMask** - Traditional wallet connection
- **Account Abstraction** - Login with Google/Email (Privy)
- **Gasless Transactions** - AA mode support
- **Social Recovery** - Email-based account recovery

---

## 🛠 Tech Stack

### Smart Contracts
- **Solidity** ^0.8.20
- **OpenZeppelin** Contracts v5.4.0
- **Hardhat** Development Environment
- **Ethers.js** v5.7.2

### Frontend
- **React** 19.2.0
- **React Router** DOM v7.9.5
- **Ethers.js** v5.7.2
- **Tailwind CSS** v3.4.1
- **Lucide React** Icons
- **Recharts** for Analytics
- **Privy** for Account Abstraction

### Infrastructure
- **Ethereum Sepolia** Testnet
- **Alchemy RPC** Provider
- **Etherscan** Block Explorer
- **IPFS** (Optional for NFT metadata)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ALDO DeFi Platform                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Frontend  │  │  Smart      │  │  Blockchain │    │
│  │   (React)   │──│  Contracts  │──│  (Sepolia)  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│        │                  │                             │
│        │                  │                             │
│  ┌─────▼──────┐    ┌──────▼───────┐                    │
│  │  MetaMask  │    │ ALDO Token   │                    │
│  │  / Privy   │    │ Marketplace  │                    │
│  └────────────┘    │ Ecosystem    │                    │
│                    └──────────────┘                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Contract Structure

```
contracts/
├── ALDOToken.sol          # ERC-20 Token Contract
├── ALDOMarketplace.sol    # NFT Marketplace
└── ALDOEcosystem.sol      # Staking, Governance, Vesting, Airdrop
```

---

## 📜 Smart Contracts

### ALDOToken (ERC-20)
```solidity
Contract Address: 0xDB9ba19139D849A3E509F0D5e20536C4821e975e
Network: Sepolia Testnet
```

**Features:**
- Mintable (Owner only)
- Burnable
- Standard ERC-20 functions
- OpenZeppelin secure implementation

### ALDOMarketplace (ERC-721)
```solidity
Contract Address: 0x679C0F7EC386689C3b12d3d636351A5ef646C098
Network: Sepolia Testnet
```

**Features:**
- NFT Minting
- Listing/Unlisting
- Buy/Sell with ALDO tokens
- Burn functionality (Owner)

### ALDOEcosystem
```solidity
Contract Address: 0xFc041ecbaC08fD33c73266a60cBa673C15d5b4E4
Network: Sepolia Testnet
```

**Features:**
- Multi-tier Staking (4 tiers)
- DAO Governance
- Token Vesting
- Airdrop Distribution
- Emergency Withdraw (Owner)

---

## 📥 Installation

### Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **MetaMask** Browser Extension ([Install](https://metamask.io/))
- **Sepolia ETH** ([Get from Faucet](https://cloud.google.com/application/web3/faucet))

### Clone Repository

```bash
git clone https://github.com/yourusername/aldo-defi-ecosystem.git
cd aldo-defi-ecosystem
```

### Install Dependencies

```bash
# Install root dependencies (Hardhat)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Install Required Packages

```bash
# Backend (Smart Contracts)
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts dotenv ethers@5.7.2

# Frontend (React)
cd frontend
npm install react react-dom react-router-dom
npm install ethers@5.7.2 @privy-io/react-auth @privy-io/wagmi
npm install lucide-react recharts
npm install -D tailwindcss postcss autoprefixer
cd ..
```

---

## ⚙️ Configuration

### 1. Environment Setup

Create `.env` file in root directory:

```env
# Private Key (NEVER commit this!)
PRIVATE_KEY=your_metamask_private_key_here

# RPC URL
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Etherscan API (Optional)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**⚠️ Security Warning:**
- Never share your private key
- Add `.env` to `.gitignore`
- Use environment variables in production

### 2. Get Sepolia ETH

Get free testnet ETH from these faucets:
- [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [PoW Faucet](https://sepolia-faucet.pk910.de/)

### 3. Configure MetaMask

Add Sepolia Network:
- **Network Name**: Sepolia Testnet
- **RPC URL**: https://rpc.sepolia.org
- **Chain ID**: 11155111
- **Currency**: SepoliaETH
- **Block Explorer**: https://sepolia.etherscan.io

---

## 🚀 Deployment

### Compile Contracts

```bash
npx hardhat compile
```

**Expected output:**
```
✓ Compiled 3 Solidity files successfully
```

### Deploy ALDOEcosystem Contract

```bash
npx hardhat run scripts/deploy-ecosystem.js --network sepolia
```

**Expected output:**
```
🚀 ===================================
   ALDO ECOSYSTEM DEPLOYMENT
===================================

✅ Using existing ALDO Token at: 0xDB9ba19139D849A3E509F0D5e20536C4821e975e
📝 Deploying ALDOEcosystem contract...
✅ DEPLOYMENT SUCCESSFUL! 🎉

📍 ALDO Ecosystem: 0xYourNewEcosystemAddress
```

### Update Frontend Configuration

Edit `src/utils/contracts.js`:

```javascript
export const CONTRACTS = {
  TOKEN_ADDRESS: "0xDB9ba19139D849A3E509F0D5e20536C4821e975e",
  MARKETPLACE_ADDRESS: "0x679C0F7EC386689C3b12d3d636351A5ef646C098",
  ECOSYSTEM_ADDRESS: "0xFc041ecbaC08fD33c73266a60cBa673C15d5b4E4", 
};
```

### Setup Contract Permissions

#### A. Approve Ecosystem Contract

1. Go to [Token Contract on Etherscan](https://sepolia.etherscan.io/address/0xDB9ba19139D849A3E509F0D5e20536C4821e975e#writeContract)
2. Connect wallet
3. Call `approve`:
   - spender: `0xYourEcosystemAddress`
   - amount: `999999999999999999999999999`

#### B. Deposit Rewards

1. Go to Ecosystem Contract on Etherscan
2. Connect wallet
3. Call `depositRewards`:
   - amount: `100000000000000000000000` (100,000 ALDO)

### Verify Contract (Optional)

```bash
npx hardhat verify --network sepolia 0xYourEcosystemAddress 0xDB9ba19139D849A3E509F0D5e20536C4821e975e
```

---

## 🎮 Usage Guide

### Start Application

```bash
npm start
```

Access: http://localhost:3000

### Connect Wallet

**Option 1: MetaMask**
1. Click "Connect MetaMask"
2. Approve connection
3. Switch to Sepolia network if needed

**Option 2: Account Abstraction**
1. Click "Account Abstraction"
2. Login with Google or Email
3. Wallet auto-created

### Features Walkthrough

#### 1. Token Dashboard
```
Dashboard → View balance, supply, statistics
Mint → Create new ALDO tokens (Owner only)
Transfer → Send ALDO to any address
Transfer ETH → Send Sepolia ETH between wallets
```

#### 2. Staking
```
Staking → Stake tokens to earn rewards
- Stake 1,000+ ALDO for Bronze tier (10% APY)
- Stake 5,000+ ALDO for Silver tier (15% APY)
- Stake 25,000+ ALDO for Gold tier (20% APY)
- Stake 100,000+ ALDO for Platinum tier (30% APY)
- Claim rewards anytime
- Unstake without lock period
```

#### 3. Governance
```
Governance → Participate in DAO decisions
- Create proposals (need 10k ALDO staked)
- Vote with your staked amount as voting power
- 7-day voting period
- Execute passed proposals (Owner)
```

#### 4. Vesting
```
Vesting → Lock tokens for gradual release
- Create vesting schedules (Owner only)
- Set cliff period (lock before vesting starts)
- Linear vesting over time
- Claim vested tokens
- Track progress visually
```

#### 5. Airdrop
```
Airdrop → Distribute tokens to community
- Create airdrop campaigns (Owner)
- Add eligible addresses
- Set amount per user
- Time-limited claims
- One claim per address
```

#### 6. NFT Marketplace
```
NFT Dashboard → Overview of NFT ecosystem
Create NFT → Mint your own NFTs
Marketplace → Buy NFTs with ALDO
My NFTs → Manage your collection
```

---

## 🧪 Testing

### Run Local Tests

```bash
npx hardhat test
```

### Test on Local Network

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy-ecosystem.js --network localhost

# Terminal 3: Start frontend
npm start
```

### Testing Checklist

#### Staking
- [ ] Stake 1,000 ALDO → Bronze tier
- [ ] Check APY calculation
- [ ] Claim rewards after 1 hour
- [ ] Unstake tokens
- [ ] Verify balance updates

#### Governance
- [ ] Create proposal (with 10k staked)
- [ ] Vote FOR/AGAINST
- [ ] Check voting power = staked amount
- [ ] Execute proposal after voting ends

#### Vesting
- [ ] Create vesting schedule (owner)
- [ ] Set 30 day duration, 0 cliff
- [ ] Wait some time
- [ ] Claim vested tokens
- [ ] Progress bar updates

#### Airdrop
- [ ] Create airdrop (owner)
- [ ] Add 3 test addresses
- [ ] Set 100 ALDO per user
- [ ] Eligible users claim
- [ ] Check "Already Claimed" status

#### NFT Marketplace
- [ ] Mint NFT
- [ ] List for sale (set price in ALDO)
- [ ] Buy listed NFT
- [ ] Unlist NFT
- [ ] Burn NFT (owner)

---

## 🔒 Security

### Smart Contract Security

✅ **Implemented Measures:**
- OpenZeppelin audited contracts
- ReentrancyGuard on sensitive functions
- Owner-only modifiers
- Input validation
- SafeMath (built-in Solidity 0.8+)
- Emergency withdraw function

⚠️ **Best Practices:**
- Regular audits recommended
- Bug bounty programs
- Multi-sig for ownership
- Timelock for critical functions
- Gradual rollout

### Frontend Security

- No private keys stored in frontend
- Environment variables for sensitive data
- HTTPS in production
- Content Security Policy
- Rate limiting

---

## 📊 Project Statistics

- **Total Smart Contracts**: 3
- **Lines of Code**: ~2,500+
- **React Components**: 20+
- **Supported Features**: 12+
- **Test Coverage**: TBD

---

## 🗺 Roadmap

### Phase 1 (Current) ✅
- [x] Token Contract (ERC-20)
- [x] NFT Marketplace (ERC-721)
- [x] Staking System (4 tiers)
- [x] Governance (DAO)
- [x] Vesting
- [x] Airdrop

### Phase 2 (Planned) 🚧
- [ ] Liquidity Pools (DEX)
- [ ] Lending/Borrowing
- [ ] Yield Farming
- [ ] Cross-chain Bridge
- [ ] Mobile App

### Phase 3 (Future) 🔮
- [ ] Mainnet Deployment
- [ ] Multi-chain Support
- [ ] Advanced Analytics
- [ ] DAO Treasury
- [ ] Governance V2

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Contribution Guidelines

- Follow existing code style
- Write tests for new features
- Update documentation
- No breaking changes without discussion

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 ALDO DeFi Ecosystem

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 📞 Contact & Support

### Developer
- **Name**: Fariz Rivaldo
- **GitHub**: [@farizrivaldo](https://github.com/farizrivaldo)
- **Email**: your.email@example.com

### Resources
- **Documentation**: [Wiki](https://github.com/farizrivaldo/CreateTokenALDO/wiki)
- **Bug Reports**: [Issues](https://github.com/farizrivaldo/CreateTokenALDO/issues)
- **Discord**: [Join Server](https://discord.gg/yourserver)
- **Twitter**: [@ALDOToken](https://twitter.com/yourhandle)

---

## 🙏 Acknowledgments

Special thanks to:
- **OpenZeppelin** - Secure smart contract library
- **Hardhat** - Development environment
- **Privy** - Account abstraction solution
- **Alchemy** - RPC infrastructure
- **Etherscan** - Block explorer
- **Community** - Beta testers and contributors

---

## 📚 Additional Resources

### Learning Materials
- [Solidity Docs](https://docs.soliditylang.org/)
- [Hardhat Tutorial](https://hardhat.org/tutorial)
- [React Docs](https://react.dev/)
- [Ethers.js Docs](https://docs.ethers.org/)

### Tools & Services
- [Remix IDE](https://remix.ethereum.org/) - Online Solidity IDE
- [OpenZeppelin Wizard](https://wizard.openzeppelin.com/) - Contract generator
- [Tenderly](https://tenderly.co/) - Smart contract monitoring
- [Defender](https://www.openzeppelin.com/defender) - Security automation

---

## 🎯 Key Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| ERC-20 Token | ✅ | Mintable, burnable ALDO token |
| NFT Marketplace | ✅ | Create, buy, sell NFTs |
| Staking | ✅ | 4-tier system, up to 30% APY |
| Governance | ✅ | DAO voting, proposals |
| Vesting | ✅ | Token lock, linear release |
| Airdrop | ✅ | Mass distribution |
| Transfer ETH | ✅ | Send Sepolia ETH |
| Analytics | ✅ | Charts, statistics |
| Account Abstraction | ✅ | Google/Email login |
| Transaction History | ✅ | Full on-chain tracking |

---

<div align="center">

### ⭐ Star this repo if you find it useful!

**Built with ❤️ by the ALDO Team**

[⬆ Back to Top](#-aldo-token-defi-ecosystem)

</div>

---

## 📸 Screenshots

### Dashboard
![Token Dashboard](https://via.placeholder.com/800x400?text=Token+Dashboard)

### Staking
![Staking Interface](https://via.placeholder.com/800x400?text=Staking+Interface)

### Governance
![DAO Governance](https://via.placeholder.com/800x400?text=DAO+Governance)

### NFT Marketplace
![NFT Marketplace](https://via.placeholder.com/800x400?text=NFT+Marketplace)

---

## 🐛 Known Issues

- [ ] Gas estimation may vary on network congestion
- [ ] Large airdrop lists (>1000 addresses) need batch processing
- [ ] Mobile responsiveness on small devices

---

## 💼 Business Use Cases

### For Startups
- Launch your own token
- Build community through airdrops
- Engage users with staking rewards

### For DAOs
- Decentralized governance
- Treasury management
- Fair token distribution

### For NFT Projects
- Integrated marketplace
- Token-gated access
- Community rewards

---

**Last Updated**: December 2024

**Version**: 1.0.0

**Status**: ✅ Production Ready (Testnet)