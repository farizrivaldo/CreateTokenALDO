// import React from 'react';
// import { useWeb3 } from '../contexts/Web3Context';

// function LandingPage() {
//   const { connectWallet, loading } = useWeb3();

//   return (
//     <div className="min-h-screen flex items-center justify-center" style={{
//       background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
//     }}>
//       <div className="text-center px-6 max-w-4xl">
//         {/* Logo/Icon */}
//         <div className="mb-8 animate-bounce">
//           <svg 
//             className="w-24 h-24 mx-auto text-indigo-400" 
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path 
//               strokeLinecap="round" 
//               strokeLinejoin="round" 
//               strokeWidth={2} 
//               d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
//             />
//           </svg>
//         </div>

//         {/* Title */}
//         <h1 className="text-6xl font-bold mb-4 gradient-text">
//           ALDO Token DAPP
//         </h1>

//         {/* Subtitle */}
//         <p className="text-xl text-slate-300 mb-8">
//           Decentralized Application for ALDO Token & NFT Marketplace
//         </p>
//         <p className="text-md text-slate-400 mb-12">
//           Built on Ethereum Sepolia Testnet
//         </p>

//         {/* Connect Button */}
//         <button
//           onClick={connectWallet}
//           disabled={loading}
//           className="btn btn-primary text-lg px-8 py-4"
//         >
//           {loading ? (
//             <>
//               <span className="loading-spinner"></span>
//               Connecting...
//             </>
//           ) : (
//             <>
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//               </svg>
//               Connect MetaMask
//             </>
//           )}
//         </button>

//        {/* <p className="text-sm text-slate-500 mt-4">
//   Make sure you're on Sepolia testnet
// </p> */}
// <br />
// <br />
// <div className="text-sm text-blue-600 mt-2 space-x-4">
//   <a
//     href="https://metamask.io/"
//     target="_blank"
//     rel="noopener noreferrer"
//     className="underline"
//   >
//     Install MetaMask
//   </a>
//   <a
//     href="https://cloud.google.com/application/web3/faucet"
//     target="_blank"
//     rel="noopener noreferrer"
//     className="underline"
//   >
//    Get Faucet
//   </a>
//   <a
//     href="https://revoke.cash/learn/wallets/add-network/ethereum-sepolia"
//     target="_blank"
//     rel="noopener noreferrer"
//     className="underline"
//   >
//     Sepolia Testnet
//   </a>
// </div>


//         {/* Features Grid */}
//         <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="card text-left">
//             <div className="text-3xl mb-3">💰</div>
//             <h3 className="text-lg font-semibold mb-2 text-indigo-400">Token Features</h3>
//             <p className="text-sm text-slate-300">
//               Mint, burn, and transfer ALDO tokens with full control
//             </p>
//           </div>

//           <div className="card text-left">
//             <div className="text-3xl mb-3">🎨</div>
//             <h3 className="text-lg font-semibold mb-2 text-purple-400">NFT Marketplace</h3>
//             <p className="text-sm text-slate-300">
//               Create, buy, and sell NFTs using ALDO tokens
//             </p>
//           </div>

//           <div className="card text-left">
//             <div className="text-3xl mb-3">🔐</div>
//             <h3 className="text-lg font-semibold mb-2 text-pink-400">Fully Decentralized</h3>
//             <p className="text-sm text-slate-300">
//               No backend server, everything runs on blockchain
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LandingPage;
import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { usePrivy } from '@privy-io/react-auth';

function LandingPage() {
  const { connectWallet, loading: web3Loading } = useWeb3();
  const { login, ready } = usePrivy();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleMetaMaskConnect = async () => {
    setSelectedMethod('metamask');
    await connectWallet();
  };

  const handleAAConnect = async () => {
    setSelectedMethod('aa');
    await login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
    }}>
      <div className="text-center px-6 max-w-4xl">
        {/* Logo/Icon */}
        <div className="mb-8 animate-bounce">
          <svg 
            className="w-24 h-24 mx-auto text-indigo-400" 
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

        {/* Title */}
        <h1 className="text-6xl font-bold mb-4 gradient-text">
          ALDO Token DAPP
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-slate-300 mb-4">
          Decentralized Application for ALDO Token & NFT Marketplace
        </p>
        <p className="text-md text-slate-400 mb-12">
          Built on Sepolia Testnet · Full Blockchain · No Backend
        </p>

        {/* Connection Options */}
        <div className="mb-8">
          <p className="text-lg text-slate-300 mb-6">Choose your login method:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* MetaMask Option */}
            <button
              onClick={handleMetaMaskConnect}
              disabled={web3Loading && selectedMethod === 'metamask'}
              className="card p-6 hover:border-indigo-500 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-4 mb-3">
                <svg className="w-12 h-12 text-orange-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.05 12l-2.8-2.8-1.41 1.41L19.23 12l-1.39 1.39 1.41 1.41L22.05 12zM12 2.05l2.8 2.8-1.41 1.41L12 4.77l-1.39 1.39-1.41-1.41L12 2.05zm0 19.9l-2.8-2.8 1.41-1.41L12 19.23l1.39-1.39 1.41 1.41L12 21.95zm-7.25-9.9l-2.8 2.8 2.8 2.8 1.41-1.41L4.77 12l1.39-1.39-1.41-1.41z"/>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">MetaMask Wallet</h3>
                  <p className="text-sm text-slate-400">Connect with browser extension</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="badge badge-info text-xs">Traditional</span>
                {web3Loading && selectedMethod === 'metamask' && (
                  <span className="loading-spinner"></span>
                )}
              </div>
            </button>

            {/* AA Option */}
            <button
              onClick={handleAAConnect}
              disabled={!ready}
              className="card p-6 hover:border-purple-500 transition-all cursor-pointer text-left group relative overflow-hidden"
            >
              <div className="absolute top-2 right-2">
                <span className="badge bg-purple-500 text-white text-xs animate-pulse">NEW</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white font-bold border-2 border-slate-800">
                    G
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-slate-800">
                    @
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Account Abstraction</h3>
                  <p className="text-sm text-slate-400">Google or Email login</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="badge bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                  Gasless ⚡
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-left">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-400">Token Features</h3>
            <p className="text-sm text-slate-300">
              Mint, burn, and transfer ALDO tokens with full control
            </p>
          </div>

          <div className="card text-left">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold mb-2 text-purple-400">NFT Marketplace</h3>
            <p className="text-sm text-slate-300">
              Create, buy, and sell NFTs using ALDO tokens
            </p>
          </div>

          <div className="card text-left">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold mb-2 text-pink-400">Fully Decentralized</h3>
            <p className="text-sm text-slate-300">
              No backend server, everything runs on blockchain
            </p>
          </div>
        </div>

        {/* AA Info Banner */}
        <div className="mt-8 card border-2 border-purple-500/30 bg-purple-500/5">
          <div className="flex items-start gap-4">
            <div className="text-3xl">✨</div>
            <div className="text-left">
              <h4 className="font-semibold text-purple-400 mb-2">What is Account Abstraction?</h4>
              <p className="text-sm text-slate-300 mb-2">
                Login with your Google account or email - no need to manage private keys or install browser extensions!
              </p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Gasless transactions (no ETH needed for gas)</li>
                <li>• Social recovery (recover account via email)</li>
                <li>• Instant wallet creation</li>
                <li>• Same experience as Web2 apps</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;