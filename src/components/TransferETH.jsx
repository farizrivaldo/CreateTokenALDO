import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

function TransferETH() {
  const { provider, account, balance, loadBalances } = useWeb3();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [gasPrice, setGasPrice] = useState('0');
  const [estimatedGas, setEstimatedGas] = useState('0');
  const [totalCost, setTotalCost] = useState('0');

  useEffect(() => {
    loadGasPrice();
  }, [provider]);

  useEffect(() => {
    if (toAddress && amount && ethers.utils.isAddress(toAddress)) {
      estimateGasCost();
    }
  }, [toAddress, amount]);

  const loadGasPrice = async () => {
    try {
      if (!provider) return;
      const price = await provider.getGasPrice();
      setGasPrice(ethers.utils.formatUnits(price, 'gwei'));
    } catch (error) {
      console.error('Error loading gas price:', error);
    }
  };

  const estimateGasCost = async () => {
    try {
      if (!provider || !toAddress || !amount) return;
      
      const amountWei = ethers.utils.parseEther(amount);
      const estimatedGas = await provider.estimateGas({
        to: toAddress,
        value: amountWei,
      });
      
      const gasPriceWei = await provider.getGasPrice();
      const totalGasCost = estimatedGas.mul(gasPriceWei);
      
      setEstimatedGas(ethers.utils.formatEther(totalGasCost));
      setTotalCost(ethers.utils.formatEther(amountWei.add(totalGasCost)));
    } catch (error) {
      console.error('Error estimating gas:', error);
      setEstimatedGas('0');
      setTotalCost('0');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!provider || !account) return;

    // Validate address
    if (!ethers.utils.isAddress(toAddress)) {
      setMessage({ type: 'error', text: 'Invalid recipient address' });
      return;
    }

    // Validate amount
    const amountFloat = parseFloat(amount);
    if (amountFloat <= 0) {
      setMessage({ type: 'error', text: 'Amount must be greater than 0' });
      return;
    }

    // Check if user has enough balance (including gas)
    const amountWei = ethers.utils.parseEther(amount);
    const gasPriceWei = await provider.getGasPrice();
    const estimatedGasWei = await provider.estimateGas({
      to: toAddress,
      value: amountWei,
    });
    const totalNeeded = amountWei.add(estimatedGasWei.mul(gasPriceWei));
    const userBalance = await provider.getBalance(account);

    if (userBalance.lt(totalNeeded)) {
      setMessage({ 
        type: 'error', 
        text: `Insufficient balance. You need ${ethers.utils.formatEther(totalNeeded)} ETH (including gas)` 
      });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const signer = provider.getSigner();
      
      setMessage({ type: 'info', text: 'Preparing transaction...' });
      
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: amountWei,
      });

      setMessage({ type: 'info', text: 'Transaction submitted. Waiting for confirmation...' });
      
      const receipt = await tx.wait();

      setMessage({ 
        type: 'success', 
        text: `Successfully sent ${amount} ETH to ${toAddress.substring(0, 10)}...!` 
      });

      setToAddress('');
      setAmount('');
      await loadBalances();
    } catch (error) {
      console.error('Transfer error:', error);
      
      if (error.code === 4001) {
        setMessage({ type: 'error', text: 'Transaction rejected by user' });
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setMessage({ type: 'error', text: 'Insufficient funds for transaction + gas' });
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to send ETH' });
      }
    } finally {
      setLoading(false);
    }
  };

  const setMaxAmount = () => {
    if (!balance || !estimatedGas) return;
    
    // Calculate max: balance - estimated gas - small buffer (0.001 ETH)
    const balanceFloat = parseFloat(balance);
    const gasFloat = parseFloat(estimatedGas || '0.001');
    const buffer = 0.001; // Small buffer for safety
    
    const maxAmount = Math.max(0, balanceFloat - gasFloat - buffer);
    setAmount(maxAmount.toFixed(6));
  };

  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">💸 Transfer Sepolia ETH</h1>
        <div className="badge badge-info">Sepolia Testnet</div>
      </div>

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

      {/* Info Banner */}
      <div className="card border-2 border-blue-500/30 bg-blue-500/5">
        <div className="flex items-start gap-4">
          <div className="text-3xl">ℹ️</div>
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">About Sepolia ETH</h4>
            <p className="text-sm text-slate-300 mb-2">
              Sepolia ETH is testnet currency with no real value. Use it to test transactions and dApps.
            </p>
            <a 
              href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              🚰 Get free Sepolia ETH from faucet
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">💸</div>
              <div>
                <h2 className="text-xl font-bold">Send Sepolia ETH</h2>
                <p className="text-sm text-slate-400">Transfer ETH to any address</p>
              </div>
            </div>

            <form onSubmit={handleTransfer} className="space-y-6">
              {/* From Address */}
              <div>
                <label className="block text-sm font-medium mb-2">From (Your Address)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={account}
                    className="input-field cursor-not-allowed opacity-75 pr-20"
                    disabled
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    (You)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-3xl">⬇️</div>
              </div>

              {/* To Address */}
              <div>
                <label className="block text-sm font-medium mb-2">To (Recipient Address) *</label>
                <input
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="0x..."
                  className={`input-field ${
                    toAddress && !ethers.utils.isAddress(toAddress) 
                      ? 'border-red-500 focus:border-red-500' 
                      : ''
                  }`}
                  required
                />
                {toAddress && !ethers.utils.isAddress(toAddress) && (
                  <p className="text-xs text-red-400 mt-1">⚠️ Invalid address format</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Amount (ETH) *</label>
                  <button
                    type="button"
                    onClick={setMaxAmount}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Max: {parseFloat(balance).toFixed(6)} ETH
                  </button>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.000001"
                  min="0"
                  max={balance}
                  className="input-field"
                  required
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setAmount('0.001')}
                  className="btn btn-secondary text-xs py-2"
                >
                  0.001 ETH
                </button>
                <button
                  type="button"
                  onClick={() => setAmount('0.01')}
                  className="btn btn-secondary text-xs py-2"
                >
                  0.01 ETH
                </button>
                <button
                  type="button"
                  onClick={() => setAmount('0.1')}
                  className="btn btn-secondary text-xs py-2"
                >
                  0.1 ETH
                </button>
                <button
                  type="button"
                  onClick={setMaxAmount}
                  className="btn btn-secondary text-xs py-2"
                >
                  MAX
                </button>
              </div>

              {/* Transaction Summary */}
              {amount && toAddress && ethers.utils.isAddress(toAddress) && (
                <div className="p-4 bg-slate-700/50 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold mb-3">📊 Transaction Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Amount</span>
                    <span className="font-semibold">{amount} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gas Fee (estimated)</span>
                    <span className="font-semibold text-yellow-400">
                      ~{parseFloat(estimatedGas).toFixed(6)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gas Price</span>
                    <span className="text-xs text-slate-500">{parseFloat(gasPrice).toFixed(2)} Gwei</span>
                  </div>
                  <div className="border-t border-slate-600 pt-2 mt-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span>Total Cost</span>
                      <span className="text-indigo-400">{parseFloat(totalCost).toFixed(6)} ETH</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !toAddress || !amount || !ethers.utils.isAddress(toAddress)}
                className="btn btn-primary w-full py-4 text-lg"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="text-2xl">💸</span>
                    Send {amount || '0'} ETH
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">💰 Your Balance</h3>
            <div className="text-center py-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/50">
              <p className="text-4xl font-bold text-indigo-400 mb-2">
                {parseFloat(balance).toFixed(6)}
              </p>
              <p className="text-slate-400">Sepolia ETH</p>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Network</span>
                <span className="font-semibold">Sepolia Testnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Chain ID</span>
                <span className="font-semibold">11155111</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Your Address</span>
                <span className="font-mono text-xs">{formatAddress(account)}</span>
              </div>
            </div>
          </div>

          {/* Get ETH Card */}
          <div className="card border-2 border-green-500/30 bg-green-500/5">
            <h3 className="text-lg font-semibold mb-3 text-green-400">🚰 Need More ETH?</h3>
            <p className="text-sm text-slate-300 mb-4">
              Get free Sepolia ETH from these faucets:
            </p>
            <div className="space-y-2">
              <a
                href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full btn btn-success text-sm py-2"
              >
                Google Faucet
              </a>
              <a
                href="https://sepolia-faucet.pk910.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full btn btn-secondary text-sm py-2"
              >
                PoW Faucet
              </a>
              <a
                href="https://www.alchemy.com/faucets/ethereum-sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full btn btn-secondary text-sm py-2"
              >
                Alchemy Faucet
              </a>
            </div>
          </div>

          {/* Tips Card */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✓ Always verify the recipient address</li>
              <li>✓ Start with small amounts for testing</li>
              <li>✓ Keep some ETH for gas fees</li>
              <li>✓ Transactions are irreversible</li>
              <li>✓ Check Etherscan for confirmation</li>
            </ul>
          </div>

          {/* Etherscan Link */}
          {account && (
            <a
              href={`https://sepolia.etherscan.io/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block card hover:border-indigo-500 transition-all text-center"
            >
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-sm font-semibold">View on Etherscan</p>
              <p className="text-xs text-slate-400 mt-1">Check transaction history</p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransferETH;