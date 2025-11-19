# 🚀 ALDO DeFi - Quick Start Guide

> Get up and running in 5 minutes!

---

## ⚡ Prerequisites

- ✅ Node.js v16+ installed
- ✅ MetaMask extension installed
- ✅ Sepolia ETH (from [faucet](https://cloud.google.com/application/web3/faucet))

---

## 📦 Installation (60 seconds)

```bash
# 1. Clone & Install
git clone https://github.com/farizrivaldo/CreateTokenALDO.git
cd CreateTokenALDO
npm install

# 2. Setup Environment
cp .env.example .env
# Edit .env and add your PRIVATE_KEY and SEPOLIA_RPC_URL
```

---

## 🎯 Deploy Contracts (2 minutes)

```bash
# 1. Compile
npx hardhat compile

# 2. Deploy Ecosystem
npx hardhat run scripts/deploy-ecosystem.js --network sepolia

# 3. Copy the ecosystem address and update:
# src/utils/contracts.js → ECOSYSTEM_ADDRESS
```

---

## ⚙️ Setup Permissions (1 minute)

### On Etherscan:

**1. Approve Token Contract**
```
https://sepolia.etherscan.io/address/TOKEN_ADDRESS#writeContract
→ approve(ECOSYSTEM_ADDRESS, 999999999999999999999999999)
```

**2. Deposit Rewards**
```
https://sepolia.etherscan.io/address/ECOSYSTEM_ADDRESS#writeContract
→ depositRewards(100000000000000000000000)
```

---

## 🎮 Run Application (30 seconds)

```bash
npm start
```

**Access**: http://localhost:3000

---

## ✅ Test Features (1 minute each)

### 1. Connect Wallet
- Click "Connect MetaMask" or "Account Abstraction"

### 2. Get ALDO Tokens
- Dashboard → Mint (if you're owner)
- Or request from owner

### 3. Try Staking
```
Staking Page → Stake 1000 ALDO → Bronze Tier (10% APY)
```

### 4. Create Proposal
```
Governance → Create Proposal (need 10k staked)
```

### 5. Transfer ETH
```
Transfer ETH → Send 0.001 ETH to test wallet
```

---

## 🎉 You're Ready!

**Total Time**: ~5 minutes

**What You Have Now**:
- ✅ Full DeFi platform running
- ✅ Staking with rewards
- ✅ DAO governance
- ✅ NFT marketplace
- ✅ Vesting system
- ✅ Airdrop distribution

---

## 🆘 Quick Troubleshooting

### "Insufficient funds"
→ Get more Sepolia ETH from [faucet](https://cloud.google.com/application/web3/faucet)

### "Transfer failed" in staking
→ Make sure you approved the ecosystem contract

### Contract not found
→ Check ECOSYSTEM_ADDRESS in `src/utils/contracts.js`

### Wrong network
→ Switch MetaMask to Sepolia (Chain ID: 11155111)

---

## 📚 Full Documentation

See [README.md](README.md) for complete documentation.

---

## 🔗 Useful Links

- **Token Contract**: `0xDB9ba19139D849A3E509F0D5e20536C4821e975e`
- **Marketplace**: `0x679C0F7EC386689C3b12d3d636351A5ef646C098`
- **Faucet**: https://cloud.google.com/application/web3/faucet
- **Etherscan**: https://sepolia.etherscan.io

---

**Need Help?** Open an [issue](https://github.com/farizrivaldo/CreateTokenALDO/issues)

**Happy Building!** 🚀