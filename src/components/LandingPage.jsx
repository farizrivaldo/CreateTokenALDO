// import React, { useState } from 'react';
// import { useWeb3 } from '../contexts/Web3Context';
// import { usePrivy } from '@privy-io/react-auth';

// function LandingPage() {
//   const { connectWallet, loading: web3Loading } = useWeb3();
//   const { login, ready } = usePrivy();
//   const [selectedMethod, setSelectedMethod] = useState(null);

//   const handleMetaMaskConnect = async () => {
//     setSelectedMethod('metamask');
//     await connectWallet();
//   };

//   const handleAAConnect = async () => {
//     setSelectedMethod('aa');
//     await login();
//   };

//   const features = [
//     {
//       category: "💰 Token Management",
//       icon: "🪙",
//       color: "indigo",
//       items: [
//         "Mint & Burn ALDO tokens",
//         "Transfer tokens instantly",
//         "Send Sepolia ETH",
//         "Real-time analytics"
//       ]
//     },
//     {
//       category: "🏦 DeFi Ecosystem",
//       icon: "💎",
//       color: "purple",
//       items: [
//         "Multi-tier staking (10-30% APY)",
//         "DAO governance & voting",
//         "Token vesting system",
//         "Airdrop distribution"
//       ]
//     },
//     {
//       category: "🎨 NFT Marketplace",
//       icon: "🖼️",
//       color: "pink",
//       items: [
//         "Create unique NFTs",
//         "Buy & sell with ALDO",
//         "Manage your collection",
//         "Burn NFTs"
//       ]
//     }
//   ];

//   const stakingTiers = [
//     { name: "Bronze", amount: "1,000", apy: "10%", emoji: "🥉", color: "orange" },
//     { name: "Silver", amount: "5,000", apy: "15%", emoji: "🥈", color: "gray" },
//     { name: "Gold", amount: "25,000", apy: "20%", emoji: "🥇", color: "yellow" },
//     { name: "Platinum", amount: "100,000", apy: "30%", emoji: "💎", color: "purple" }
//   ];

//   return (
//     <div className="min-h-screen py-12 px-4" style={{
//       background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
//     }}>
//       <div className="max-w-7xl mx-auto">
//         {/* Hero Section */}
//         <div className="text-center mb-16">
//           {/* Logo */}
//           <div className="mb-8">
//             <svg 
//               className="w-24 h-24 mx-auto text-indigo-400 animate-bounce" 
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth={2} 
//                 d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
//               />
//             </svg>
//           </div>

//           {/* Title */}
//           <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
//             ALDO DeFi Ecosystem
//           </h1>

//           {/* Subtitle */}
//           <p className="text-xl text-slate-300 mb-2">
//             Complete Decentralized Finance Platform
//           </p>
//           <p className="text-md text-slate-400 mb-8">
//             Built on Ethereum Sepolia Testnet • No Backend • Fully On-Chain
//           </p>

//           {/* Stats */}
//           <div className="flex justify-center gap-8 mb-8 flex-wrap">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-indigo-400">12+</div>
//               <div className="text-sm text-slate-400">Features</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-purple-400">4</div>
//               <div className="text-sm text-slate-400">Staking Tiers</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-pink-400">30%</div>
//               <div className="text-sm text-slate-400">Max APY</div>
//             </div>
//           </div>
//         </div>

//         {/* Connection Options */}
//         <div className="mb-16 max-w-3xl mx-auto">
//           <h2 className="text-2xl font-bold text-center mb-6 text-white">
//             Choose Your Login Method
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* MetaMask Option */}
//             <button
//               onClick={handleMetaMaskConnect}
//               disabled={web3Loading && selectedMethod === 'metamask'}
//               className="card p-6 hover:border-indigo-500 transition-all cursor-pointer text-left group hover:scale-105"
//             >
//               <div className="flex items-center gap-4 mb-3">
//                 <svg className="w-12 h-12 text-orange-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M22.05 12l-2.8-2.8-1.41 1.41L19.23 12l-1.39 1.39 1.41 1.41L22.05 12zM12 2.05l2.8 2.8-1.41 1.41L12 4.77l-1.39 1.39-1.41-1.41L12 2.05zm0 19.9l-2.8-2.8 1.41-1.41L12 19.23l1.39-1.39 1.41 1.41L12 21.95zm-7.25-9.9l-2.8 2.8 2.8 2.8 1.41-1.41L4.77 12l1.39-1.39-1.41-1.41z"/>
//                 </svg>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-1">MetaMask</h3>
//                   <p className="text-sm text-slate-400">Browser extension</p>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="badge badge-info text-xs">Traditional</span>
//                 {web3Loading && selectedMethod === 'metamask' && (
//                   <span className="loading-spinner"></span>
//                 )}
//               </div>
//             </button>

//             {/* Account Abstraction Option */}
//             <button
//               onClick={handleAAConnect}
//               disabled={!ready}
//               className="card p-6 hover:border-purple-500 transition-all cursor-pointer text-left group relative overflow-hidden hover:scale-105"
//             >
//               <div className="absolute top-2 right-2">
//                 <span className="badge bg-purple-500 text-white text-xs animate-pulse">NEW</span>
//               </div>
//               <div className="flex items-center gap-4 mb-3">
//                 <div className="flex -space-x-2">
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white font-bold border-2 border-slate-800 text-xs">
//                     G
//                   </div>
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-slate-800 text-xs">
//                     @
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-1">Account Abstraction</h3>
//                   <p className="text-sm text-slate-400">Google or Email</p>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="badge bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
//                   Gasless ⚡
//                 </span>
//               </div>
//             </button>
//           </div>

//           {/* Quick Links */}
//           <div className="text-center mt-6">
//             <p className="text-sm text-slate-400 mb-3">Need help getting started?</p>
//             <div className="flex justify-center gap-4 flex-wrap">
//               <a
//                 href="https://metamask.io/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-blue-400 hover:text-blue-300 underline"
//               >
//                 📥 Install MetaMask
//               </a>
//               <a
//                 href="https://cloud.google.com/application/web3/faucet"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-blue-400 hover:text-blue-300 underline"
//               >
//                 🚰 Get Testnet ETH
//               </a>
//               <a
//                 href="https://revoke.cash/learn/wallets/add-network/ethereum-sepolia"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-blue-400 hover:text-blue-300 underline"
//               >
//                 🌐 Add Sepolia Network
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Features Grid */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-center mb-8 text-white">
//             Platform Features
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {features.map((feature, index) => (
//               <div 
//                 key={index}
//                 className={`card text-left hover:border-${feature.color}-500 transition-all hover:scale-105`}
//               >
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="text-4xl">{feature.icon}</div>
//                   <h3 className={`text-lg font-semibold text-${feature.color}-400`}>
//                     {feature.category}
//                   </h3>
//                 </div>
//                 <ul className="space-y-2">
//                   {feature.items.map((item, idx) => (
//                     <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
//                       <span className="text-green-400 mt-1">✓</span>
//                       <span>{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Staking Tiers */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-center mb-4 text-white">
//             Staking Rewards
//           </h2>
//           <p className="text-center text-slate-400 mb-8">
//             Earn passive income by staking ALDO tokens
//           </p>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {stakingTiers.map((tier, index) => (
//               <div 
//                 key={index}
//                 className={`card text-center hover:border-${tier.color}-500 transition-all hover:scale-105 bg-${tier.color}-500/5`}
//               >
//                 <div className="text-4xl mb-2">{tier.emoji}</div>
//                 <h4 className={`font-bold text-${tier.color}-400 mb-1`}>{tier.name}</h4>
//                 <p className="text-xs text-slate-400 mb-2">Min: {tier.amount} ALDO</p>
//                 <div className={`text-2xl font-bold text-${tier.color}-400`}>{tier.apy}</div>
//                 <p className="text-xs text-slate-400">APY</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Account Abstraction Info */}
//         <div className="mb-16 max-w-3xl mx-auto">
//           <div className="card border-2 border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50 transition-all">
//             <div className="flex items-start gap-4">
//               <div className="text-4xl">✨</div>
//               <div className="text-left flex-1">
//                 <h4 className="font-semibold text-purple-400 mb-2 text-lg">
//                   What is Account Abstraction?
//                 </h4>
//                 <p className="text-sm text-slate-300 mb-3">
//                   Login with your Google account or email - no need to manage private keys or install browser extensions!
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   <div className="flex items-start gap-2">
//                     <span className="text-green-400">⚡</span>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-200">Gasless Transactions</p>
//                       <p className="text-xs text-slate-400">No ETH needed for gas fees</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <span className="text-green-400">🔐</span>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-200">Social Recovery</p>
//                       <p className="text-xs text-slate-400">Recover via email</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <span className="text-green-400">🚀</span>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-200">Instant Setup</p>
//                       <p className="text-xs text-slate-400">Wallet created automatically</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <span className="text-green-400">🌐</span>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-200">Web2 Experience</p>
//                       <p className="text-xs text-slate-400">Familiar login flow</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Why Choose ALDO */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-center mb-8 text-white">
//             Why Choose ALDO?
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div className="card text-center hover:scale-105 transition-all">
//               <div className="text-4xl mb-3">🔒</div>
//               <h4 className="font-semibold mb-2 text-white">Secure</h4>
//               <p className="text-sm text-slate-400">
//                 Audited smart contracts using OpenZeppelin
//               </p>
//             </div>
//             <div className="card text-center hover:scale-105 transition-all">
//               <div className="text-4xl mb-3">⚡</div>
//               <h4 className="font-semibold mb-2 text-white">Fast</h4>
//               <p className="text-sm text-slate-400">
//                 Instant transactions on Ethereum
//               </p>
//             </div>
//             <div className="card text-center hover:scale-105 transition-all">
//               <div className="text-4xl mb-3">💎</div>
//               <h4 className="font-semibold mb-2 text-white">Complete</h4>
//               <p className="text-sm text-slate-400">
//                 All DeFi features in one platform
//               </p>
//             </div>
//             <div className="card text-center hover:scale-105 transition-all">
//               <div className="text-4xl mb-3">🌍</div>
//               <h4 className="font-semibold mb-2 text-white">Decentralized</h4>
//               <p className="text-sm text-slate-400">
//                 No backend, fully on-chain
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Call to Action */}
//         <div className="text-center">
//           <div className="card border-2 border-indigo-500/50 bg-indigo-500/10 max-w-2xl mx-auto">
//             <h3 className="text-2xl font-bold mb-4 text-white">
//               Ready to Get Started?
//             </h3>
//             <p className="text-slate-300 mb-6">
//               Connect your wallet and explore the full DeFi ecosystem
//             </p>
//             <div className="flex justify-center gap-4 flex-wrap">
//               <button
//                 onClick={handleMetaMaskConnect}
//                 disabled={web3Loading}
//                 className="btn btn-primary px-8 py-3"
//               >
//                 {web3Loading && selectedMethod === 'metamask' ? (
//                   <>
//                     <span className="loading-spinner"></span>
//                     Connecting...
//                   </>
//                 ) : (
//                   <>
//                     🦊 Connect MetaMask
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={handleAAConnect}
//                 disabled={!ready}
//                 className="btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3"
//               >
//                 ✨ Login with Email/Google
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-16 text-center text-slate-500 text-sm">
//           <p className="mb-2">Built on Ethereum Sepolia Testnet</p>
//           <p className="mb-4">Open Source • Community Driven • Fully Decentralized</p>
//           <div className="flex justify-center gap-6">
//             <a href="https://github.com/farizrivaldo/CreateTokenALDO" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
//               📂 GitHub
//             </a>
//             <a href="https://sepolia.etherscan.io/address/0xDB9ba19139D849A3E509F0D5e20536C4821e975e" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
//               🔍 Etherscan
//             </a>
//             <a href="https://docs.aldo-defi.io" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
//               📖 Docs
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LandingPage;


import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { usePrivy } from '@privy-io/react-auth';

function LandingPage() {
  const { connectWallet, loading: web3Loading } = useWeb3();
  const { login, ready, authenticated } = usePrivy();
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Auto reload after successful Privy login
  useEffect(() => {
    if (authenticated && ready) {
      const hasReloaded = sessionStorage.getItem('privy_login_reloaded');
      
      if (!hasReloaded) {
        console.log('🔄 First time login detected, reloading page...');
        sessionStorage.setItem('privy_login_reloaded', 'true');
        window.location.reload();
      }
    }
  }, [authenticated, ready]);

  const handleMetaMaskConnect = async () => {
    setSelectedMethod('metamask');
    await connectWallet();
  };

  const handleAAConnect = async () => {
    setSelectedMethod('aa');
    // Clear reload flag before login
    sessionStorage.removeItem('privy_login_reloaded');
    await login();
  };

  const features = [
    {
      category: "💰 Token Management",
      icon: "🪙",
      color: "indigo",
      items: [
        "Mint & Burn ALDO tokens",
        "Transfer tokens instantly",
        "Send Sepolia ETH",
        "Real-time analytics"
      ]
    },
    {
      category: "🏦 DeFi Ecosystem",
      icon: "💎",
      color: "purple",
      items: [
        "Multi-tier staking (10-30% APY)",
        "DAO governance & voting",
        "Token vesting system",
        "Airdrop distribution"
      ]
    },
    {
      category: "🎨 NFT Marketplace",
      icon: "🖼️",
      color: "pink",
      items: [
        "Create unique NFTs",
        "Buy & sell with ALDO",
        "Manage your collection",
        "Burn NFTs"
      ]
    }
  ];

  const stakingTiers = [
    { name: "Bronze", amount: "1,000", apy: "10%", emoji: "🥉", color: "orange" },
    { name: "Silver", amount: "5,000", apy: "15%", emoji: "🥈", color: "gray" },
    { name: "Gold", amount: "25,000", apy: "20%", emoji: "🥇", color: "yellow" },
    { name: "Platinum", amount: "100,000", apy: "30%", emoji: "💎", color: "purple" }
  ];

  return (
    <div className="min-h-screen py-12 px-4" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <svg 
              className="w-24 h-24 mx-auto text-indigo-400 animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
              />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            ALDO DeFi Ecosystem
          </h1>

          <p className="text-xl text-slate-300 mb-2">
            Complete Decentralized Finance Platform
          </p>
          <p className="text-md text-slate-400 mb-8">
            Built on Ethereum Sepolia Testnet • No Backend • Fully On-Chain
          </p>

          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400">12+</div>
              <div className="text-sm text-slate-400">Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">4</div>
              <div className="text-sm text-slate-400">Staking Tiers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">30%</div>
              <div className="text-sm text-slate-400">Max APY</div>
            </div>
          </div>
        </div>

        {/* Connection Options */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Choose Your Login Method
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MetaMask Option */}
            <button
              onClick={handleMetaMaskConnect}
              disabled={web3Loading && selectedMethod === 'metamask'}
              className="card p-6 hover:border-indigo-500 transition-all cursor-pointer text-left group hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-3">
                <svg className="w-12 h-12 text-orange-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.05 12l-2.8-2.8-1.41 1.41L19.23 12l-1.39 1.39 1.41 1.41L22.05 12zM12 2.05l2.8 2.8-1.41 1.41L12 4.77l-1.39 1.39-1.41-1.41L12 2.05zm0 19.9l-2.8-2.8 1.41-1.41L12 19.23l1.39-1.39 1.41 1.41L12 21.95zm-7.25-9.9l-2.8 2.8 2.8 2.8 1.41-1.41L4.77 12l1.39-1.39-1.41-1.41z"/>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">MetaMask</h3>
                  <p className="text-sm text-slate-400">Browser extension</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="badge badge-info text-xs">Traditional</span>
                {web3Loading && selectedMethod === 'metamask' && (
                  <span className="loading-spinner"></span>
                )}
              </div>
            </button>

            {/* Account Abstraction Option */}
            <button
              onClick={handleAAConnect}
              disabled={!ready}
              className="card p-6 hover:border-purple-500 transition-all cursor-pointer text-left group relative overflow-hidden hover:scale-105"
            >
              <div className="absolute top-2 right-2">
                <span className="badge bg-purple-500 text-white text-xs animate-pulse">NEW</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white font-bold border-2 border-slate-800 text-xs">
                    G
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-slate-800 text-xs">
                    @
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Account Abstraction</h3>
                  <p className="text-sm text-slate-400">Google or Email</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="badge bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                  Gasless ⚡
                </span>
              </div>
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-400 mb-3">Need help getting started?</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 underline"
              >
                🔥 Install MetaMask
              </a>
              <a
                href="https://cloud.google.com/application/web3/faucet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 underline"
              >
                🚰 Get Testnet ETH
              </a>
              <a
                href="https://revoke.cash/learn/wallets/add-network/ethereum-sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 underline"
              >
                🌐 Add Sepolia Network
              </a>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`card text-left hover:border-${feature.color}-500 transition-all hover:scale-105`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className={`text-lg font-semibold text-${feature.color}-400`}>
                    {feature.category}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Staking Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Staking Rewards
          </h2>
          <p className="text-center text-slate-400 mb-8">
            Earn passive income by staking ALDO tokens
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stakingTiers.map((tier, index) => (
              <div 
                key={index}
                className={`card text-center hover:border-${tier.color}-500 transition-all hover:scale-105 bg-${tier.color}-500/5`}
              >
                <div className="text-4xl mb-2">{tier.emoji}</div>
                <h4 className={`font-bold text-${tier.color}-400 mb-1`}>{tier.name}</h4>
                <p className="text-xs text-slate-400 mb-2">Min: {tier.amount} ALDO</p>
                <div className={`text-2xl font-bold text-${tier.color}-400`}>{tier.apy}</div>
                <p className="text-xs text-slate-400">APY</p>
              </div>
            ))}
          </div>
        </div>

        {/* Account Abstraction Info */}
        <div className="mb-16 max-w-3xl mx-auto">
          <div className="card border-2 border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="text-4xl">✨</div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-purple-400 mb-2 text-lg">
                  What is Account Abstraction?
                </h4>
                <p className="text-sm text-slate-300 mb-3">
                  Login with your Google account or email - no need to manage private keys or install browser extensions!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">⚡</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Gasless Transactions</p>
                      <p className="text-xs text-slate-400">No ETH needed for gas fees</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">🔐</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Social Recovery</p>
                      <p className="text-xs text-slate-400">Recover via email</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">🚀</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Instant Setup</p>
                      <p className="text-xs text-slate-400">Wallet created automatically</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">🌐</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Web2 Experience</p>
                      <p className="text-xs text-slate-400">Familiar login flow</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-500 text-sm">
          <p className="mb-2">Built on Ethereum Sepolia Testnet</p>
          <p className="mb-4">Open Source • Community Driven • Fully Decentralized</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;