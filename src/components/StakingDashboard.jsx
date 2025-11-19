import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

function StakingDashboard() {
  const { ecosystemContract, tokenContract, account, loadBalances } = useWeb3();
  const [stakeInfo, setStakeInfo] = useState({
    stakedAmount: '0',
    pendingRewards: '0',
    totalClaimed: '0',
    tier: 0,
    tierName: 'None',
    apyRate: 0
  });
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [totalStaked, setTotalStaked] = useState('0');

  useEffect(() => {
    loadStakeInfo();
  }, [ecosystemContract, account]);

  const loadStakeInfo = async () => {
    try {
      if (!ecosystemContract || !account) return;

      const info = await ecosystemContract.getStakeInfo(account);
      setStakeInfo({
        stakedAmount: ethers.utils.formatEther(info.stakedAmount),
        pendingRewards: ethers.utils.formatEther(info.pendingRewards),
        totalClaimed: ethers.utils.formatEther(info.totalClaimed),
        tier: info.tier,
        tierName: info.tierName,
        apyRate: info.apyRate.toNumber() / 100 // Convert basis points to percentage
      });

      const total = await ecosystemContract.totalStaked();
      setTotalStaked(ethers.utils.formatEther(total));
    } catch (error) {
      console.error('Error loading stake info:', error);
    }
  };

  const handleStake = async (e) => {
    e.preventDefault();
    if (!ecosystemContract || !tokenContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const amount = ethers.utils.parseEther(stakeAmount);
      
      // First approve
      setMessage({ type: 'info', text: 'Approving tokens...' });
      const approveTx = await tokenContract.approve(ecosystemContract.address, amount);
      await approveTx.wait();

      // Then stake
      setMessage({ type: 'info', text: 'Staking tokens...' });
      const stakeTx = await ecosystemContract.stake(amount);
      await stakeTx.wait();

      setMessage({ type: 'success', text: `Successfully staked ${stakeAmount} ALDO!` });
      setStakeAmount('');
      await loadStakeInfo();
      await loadBalances();
    } catch (error) {
      console.error('Stake error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to stake' });
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async (e) => {
    e.preventDefault();
    if (!ecosystemContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const amount = ethers.utils.parseEther(unstakeAmount);
      
      setMessage({ type: 'info', text: 'Unstaking tokens...' });
      const tx = await ecosystemContract.unstake(amount);
      await tx.wait();

      setMessage({ type: 'success', text: `Successfully unstaked ${unstakeAmount} ALDO!` });
      setUnstakeAmount('');
      await loadStakeInfo();
      await loadBalances();
    } catch (error) {
      console.error('Unstake error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to unstake' });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!ecosystemContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      setMessage({ type: 'info', text: 'Claiming rewards...' });
      const tx = await ecosystemContract.claimRewards();
      await tx.wait();

      setMessage({ type: 'success', text: 'Rewards claimed successfully!' });
      await loadStakeInfo();
      await loadBalances();
    } catch (error) {
      console.error('Claim error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to claim rewards' });
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tierName) => {
    const colors = {
      'None': 'text-gray-400',
      'Bronze': 'text-orange-600',
      'Silver': 'text-gray-300',
      'Gold': 'text-yellow-400',
      'Platinum': 'text-purple-400'
    };
    return colors[tierName] || 'text-gray-400';
  };

  const getTierBadge = (tierName) => {
    const badges = {
      'None': 'bg-gray-600',
      'Bronze': 'bg-orange-600',
      'Silver': 'bg-gray-400',
      'Gold': 'bg-yellow-500',
      'Platinum': 'bg-purple-500'
    };
    return badges[tierName] || 'bg-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">🏦 Staking Dashboard</h1>
        <div className={`badge ${getTierBadge(stakeInfo.tierName)} text-white px-4 py-2 text-lg`}>
          {stakeInfo.tierName} Tier
        </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💎</div>
            <div>
              <p className="text-sm text-slate-400">Your Stake</p>
              <p className="text-2xl font-bold text-indigo-400">
                {parseFloat(stakeInfo.stakedAmount).toLocaleString()} ALDO
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎁</div>
            <div>
              <p className="text-sm text-slate-400">Pending Rewards</p>
              <p className="text-2xl font-bold text-green-400">
                {parseFloat(stakeInfo.pendingRewards).toFixed(6)} ALDO
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📈</div>
            <div>
              <p className="text-sm text-slate-400">Your APY</p>
              <p className="text-2xl font-bold text-yellow-400">{stakeInfo.apyRate}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💰</div>
            <div>
              <p className="text-sm text-slate-400">Total Claimed</p>
              <p className="text-2xl font-bold text-purple-400">
                {parseFloat(stakeInfo.totalClaimed).toLocaleString()} ALDO
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Requirements */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">🏆 Tier Requirements & APY Rates</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-orange-600/20 rounded-lg border border-orange-600/50">
            <div className="text-2xl mb-2">🥉</div>
            <h4 className="font-bold text-orange-400">Bronze</h4>
            <p className="text-sm text-slate-300">1,000+ ALDO</p>
            <p className="text-lg font-bold text-orange-400 mt-2">10% APY</p>
          </div>

          <div className="text-center p-4 bg-gray-400/20 rounded-lg border border-gray-400/50">
            <div className="text-2xl mb-2">🥈</div>
            <h4 className="font-bold text-gray-300">Silver</h4>
            <p className="text-sm text-slate-300">5,000+ ALDO</p>
            <p className="text-lg font-bold text-gray-300 mt-2">15% APY</p>
          </div>

          <div className="text-center p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
            <div className="text-2xl mb-2">🥇</div>
            <h4 className="font-bold text-yellow-400">Gold</h4>
            <p className="text-sm text-slate-300">25,000+ ALDO</p>
            <p className="text-lg font-bold text-yellow-400 mt-2">20% APY</p>
          </div>

          <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/50">
            <div className="text-2xl mb-2">💎</div>
            <h4 className="font-bold text-purple-400">Platinum</h4>
            <p className="text-sm text-slate-300">100,000+ ALDO</p>
            <p className="text-lg font-bold text-purple-400 mt-2">30% APY</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stake */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">📥</div>
            <h3 className="text-xl font-bold">Stake Tokens</h3>
          </div>
          <form onSubmit={handleStake} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (ALDO)</label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
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
                  Staking...
                </>
              ) : (
                'Stake Tokens'
              )}
            </button>
          </form>
        </div>

        {/* Unstake */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">📤</div>
            <h3 className="text-xl font-bold">Unstake Tokens</h3>
          </div>
          <form onSubmit={handleUnstake} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (ALDO)</label>
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder="0.0"
                step="0.000001"
                min="0"
                max={stakeInfo.stakedAmount}
                className="input-field"
                required
              />
              <p className="text-xs text-slate-400 mt-1">
                Max: {parseFloat(stakeInfo.stakedAmount).toFixed(2)} ALDO
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || parseFloat(stakeInfo.stakedAmount) === 0}
              className="btn btn-secondary w-full"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Unstaking...
                </>
              ) : (
                'Unstake Tokens'
              )}
            </button>
          </form>
        </div>

        {/* Claim Rewards */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">🎁</div>
            <h3 className="text-xl font-bold">Claim Rewards</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/50">
              <p className="text-sm text-slate-400">Claimable Rewards</p>
              <p className="text-3xl font-bold text-green-400">
                {parseFloat(stakeInfo.pendingRewards).toFixed(6)}
              </p>
              <p className="text-sm text-slate-400">ALDO</p>
            </div>
            <button
              onClick={handleClaimRewards}
              disabled={loading || parseFloat(stakeInfo.pendingRewards) === 0}
              className="btn btn-success w-full"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Claiming...
                </>
              ) : (
                'Claim Rewards'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Total Staked Info */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">📊 Platform Statistics</h3>
        <div className="flex justify-between items-center py-3 border-b border-slate-700">
          <span className="text-slate-400">Total Staked in Platform</span>
          <span className="font-bold text-xl">{parseFloat(totalStaked).toLocaleString()} ALDO</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-slate-700">
          <span className="text-slate-400">Your Share</span>
          <span className="font-bold text-lg text-indigo-400">
            {totalStaked !== '0' ? ((parseFloat(stakeInfo.stakedAmount) / parseFloat(totalStaked)) * 100).toFixed(2) : '0'}%
          </span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-slate-400">Current Tier</span>
          <span className={`font-bold text-lg ${getTierColor(stakeInfo.tierName)}`}>
            {stakeInfo.tierName}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StakingDashboard;