import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import TransactionHistory from './TransactionHistory'; // ← Add this
import TokenStatistics from './TokenStatistics';

function TokenDashboard() {
  const { tokenContract, account, tokenBalance, isOwner } = useWeb3();
  const [totalSupply, setTotalSupply] = useState('0');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokenInfo();
  }, [tokenContract]);

  const loadTokenInfo = async () => {
    try {
      if (!tokenContract) return;
      setLoading(true);

      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const supply = await tokenContract.totalSupply();

      setTokenName(name);
      setTokenSymbol(symbol);
      setTotalSupply(ethers.utils.formatEther(supply));
    } catch (error) {
      console.error('Error loading token info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading-spinner"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">Token Dashboard</h1>
        {isOwner && (
          <span className="badge badge-success">Contract Owner</span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🪙</div>
            <div>
              <p className="text-sm text-slate-400">Token Name</p>
              <p className="text-2xl font-bold">{tokenName}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💎</div>
            <div>
              <p className="text-sm text-slate-400">Symbol</p>
              <p className="text-2xl font-bold">{tokenSymbol}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📈</div>
            <div>
              <p className="text-sm text-slate-400">Total Supply</p>
              <p className="text-2xl font-bold">{parseFloat(totalSupply).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl">👤</div>
            <div>
              <p className="text-sm text-slate-400">Your Balance</p>
              <p className="text-2xl font-bold text-indigo-400">
                {parseFloat(tokenBalance).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Token Information */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Token Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-slate-700">
            <span className="text-slate-400">Contract Address</span>
            <span className="font-mono text-sm">{tokenContract?.address}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-700">
            <span className="text-slate-400">Your Address</span>
            <span className="font-mono text-sm">{account}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-700">
            <span className="text-slate-400">Network</span>
            <span className="badge badge-info">Sepolia Testnet</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-slate-400">Decimals</span>
            <span className="font-semibold">18</span>
          </div>
        </div>
      </div>
        <TokenStatistics />
  <TransactionHistory />

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">📈 Token Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Mint new tokens (Owner only)</li>
            <li>✓ Burn tokens (Owner only)</li>
            <li>✓ Transfer tokens to any address</li>
            <li>✓ Full ERC-20 compatibility</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-3">🎨 NFT Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Create unique NFTs</li>
            <li>✓ List NFTs for sale</li>
            <li>✓ Buy NFTs with ALDO tokens</li>
            <li>✓ Burn NFTs (Owner only)</li>
          </ul>
        </div>
      </div>
      
    </div>
  );
}

export default TokenDashboard;