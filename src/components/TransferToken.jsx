import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

function TransferToken() {
  const { tokenContract, account, tokenBalance, loadBalances } = useWeb3();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!tokenContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      // Validate amount
      const amountFloat = parseFloat(amount);
      const balanceFloat = parseFloat(tokenBalance);
      
      if (amountFloat > balanceFloat) {
        setMessage({ type: 'error', text: 'Insufficient balance' });
        setLoading(false);
        return;
      }

      const amountInWei = ethers.utils.parseEther(amount);
      const tx = await tokenContract.transfer(toAddress, amountInWei);
      
      setMessage({ type: 'info', text: 'Transaction submitted. Waiting for confirmation...' });
      await tx.wait();
      
      setMessage({ 
        type: 'success', 
        text: `Successfully transferred ${amount} ALDO to ${toAddress.substring(0, 8)}...` 
      });
      
      setToAddress('');
      setAmount('');
      await loadBalances();
    } catch (error) {
      console.error('Transfer error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to transfer tokens' });
    } finally {
      setLoading(false);
    }
  };

  const setMaxAmount = () => {
    setAmount(tokenBalance);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Transfer Tokens</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">📤</div>
              <div>
                <h2 className="text-xl font-bold">Send ALDO Tokens</h2>
                <p className="text-sm text-slate-400">Transfer tokens to any address</p>
              </div>
            </div>

            <form onSubmit={handleTransfer} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">From (Your Address)</label>
                <input
                  type="text"
                  value={account}
                  className="input-field cursor-not-allowed opacity-75"
                  disabled
                />
              </div>

              <div className="flex items-center justify-center">
                <div className="text-3xl">⬇️</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">To (Recipient Address)</label>
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Amount (ALDO)</label>
                  <button
                    type="button"
                    onClick={setMaxAmount}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Max: {parseFloat(tokenBalance).toFixed(6)}
                  </button>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.000001"
                  min="0"
                  max={tokenBalance}
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-4 text-lg"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="text-2xl">📤</span>
                    Send Tokens
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Your Balance</h3>
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-indigo-400 mb-2">
                {parseFloat(tokenBalance).toFixed(2)}
              </p>
              <p className="text-slate-400">ALDO Tokens</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✓ Double-check the recipient address</li>
              <li>✓ Transactions are irreversible</li>
              <li>✓ Gas fees are paid in ETH</li>
              <li>✓ Use "Max" button to transfer all</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferToken;