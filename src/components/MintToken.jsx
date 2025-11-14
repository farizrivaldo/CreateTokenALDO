import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

function MintToken() {
  const { tokenContract, isOwner, loadBalances } = useWeb3();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [burnAmount, setBurnAmount] = useState('');
  const [burningLoading, setBurningLoading] = useState(false);

  const handleMint = async (e) => {
    e.preventDefault();
    if (!tokenContract || !isOwner) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const amountInWei = ethers.utils.parseEther(amount);
      const tx = await tokenContract.mint(toAddress, amountInWei);
      
      setMessage({ type: 'info', text: 'Transaction submitted. Waiting for confirmation...' });
      await tx.wait();
      
      setMessage({ type: 'success', text: `Successfully minted ${amount} ALDO tokens!` });
      setToAddress('');
      setAmount('');
      await loadBalances();
    } catch (error) {
      console.error('Mint error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to mint tokens' });
    } finally {
      setLoading(false);
    }
  };

  const handleBurn = async (e) => {
    e.preventDefault();
    if (!tokenContract || !isOwner) return;

    try {
      setBurningLoading(true);
      setMessage({ type: '', text: '' });

      const amountInWei = ethers.utils.parseEther(burnAmount);
      const tx = await tokenContract.burn(amountInWei);
      
      setMessage({ type: 'info', text: 'Burning tokens. Waiting for confirmation...' });
      await tx.wait();
      
      setMessage({ type: 'success', text: `Successfully burned ${burnAmount} ALDO tokens!` });
      setBurnAmount('');
      await loadBalances();
    } catch (error) {
      console.error('Burn error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to burn tokens' });
    } finally {
      setBurningLoading(false);
    }
  };

  if (!isOwner) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Owner Access Only</h2>
        <p className="text-slate-400">Only the contract owner can mint and burn tokens.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Mint & Burn Tokens</h1>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert ${
          message.type === 'success' ? 'alert-success' :
          message.type === 'error' ? 'alert-error' : 'alert-info'
        }`}>
          {message.type === 'success' && <span className="text-2xl">✅</span>}
          {message.type === 'error' && <span className="text-2xl">❌</span>}
          {message.type === 'info' && <span className="loading-spinner"></span>}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Mint & Burn Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mint Section */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">💰</div>
            <div>
              <h2 className="text-xl font-bold">Mint Tokens</h2>
              <p className="text-sm text-slate-400">Create new ALDO tokens</p>
            </div>
          </div>

          <form onSubmit={handleMint} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Recipient Address</label>
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="0x..."
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount (ALDO)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                step="0.000001"
                min="0"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Minting...
                </>
              ) : (
                'Mint Tokens'
              )}
            </button>
          </form>
        </div>

        {/* Burn Section */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">🔥</div>
            <div>
              <h2 className="text-xl font-bold">Burn Tokens</h2>
              <p className="text-sm text-slate-400">Destroy ALDO tokens from your balance</p>
            </div>
          </div>

          <form onSubmit={handleBurn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount to Burn (ALDO)</label>
              <input
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="0.0"
                step="0.000001"
                min="0"
                className="input-field"
                required
              />
              <p className="text-xs text-slate-400 mt-2">
                ⚠️ Burned tokens are permanently destroyed
              </p>
            </div>

            <button
              type="submit"
              disabled={burningLoading}
              className="btn btn-danger w-full"
            >
              {burningLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Burning...
                </>
              ) : (
                'Burn Tokens'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">ℹ️ Information</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li><strong>Minting:</strong> Creates new tokens and increases total supply</li>
          <li><strong>Burning:</strong> Destroys tokens and decreases total supply</li>
          <li><strong>Owner Only:</strong> These operations are restricted to the contract owner</li>
          <li><strong>Gas Fees:</strong> Both operations require ETH for gas fees</li>
        </ul>
      </div>
    </div>
  );
}

export default MintToken;