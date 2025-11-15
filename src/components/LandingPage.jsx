import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

function LandingPage() {
  const { connectWallet, loading } = useWeb3();

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
        <p className="text-xl text-slate-300 mb-8">
          Decentralized Application for ALDO Token & NFT Marketplace
        </p>
        <p className="text-md text-slate-400 mb-12">
          Built on Ethereum Sepolia Testnet
        </p>

        {/* Connect Button */}
        <button
          onClick={connectWallet}
          disabled={loading}
          className="btn btn-primary text-lg px-8 py-4"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Connect MetaMask
            </>
          )}
        </button>

       {/* <p className="text-sm text-slate-500 mt-4">
  Make sure you're on Sepolia testnet
</p> */}
<br />
<br />
<div className="text-sm text-blue-600 mt-2 space-x-4">
  <a
    href="https://metamask.io/"
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  >
    Install MetaMask
  </a>
  <a
    href="https://cloud.google.com/application/web3/faucet"
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  >
   Get Faucet
  </a>
  <a
    href="https://revoke.cash/learn/wallets/add-network/ethereum-sepolia"
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  >
    Sepolia Testnet
  </a>
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
      </div>
    </div>
  );
}

export default LandingPage;
