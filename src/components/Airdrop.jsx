import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

function Airdrop() {
  const { ecosystemContract, tokenContract, account, isOwner, loadBalances } = useWeb3();
  const [airdrops, setAirdrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAirdrop, setNewAirdrop] = useState({
    amountPerUser: '',
    addresses: '',
    duration: '7' // days
  });

  useEffect(() => {
    loadAirdrops();
  }, [ecosystemContract, account]);

  const loadAirdrops = async () => {
    try {
      if (!ecosystemContract || !account) return;
      setLoading(true);

      const count = await ecosystemContract.airdropCount();
      const loadedAirdrops = [];

      for (let i = 1; i <= count.toNumber(); i++) {
        try {
          const airdropInfo = await ecosystemContract.getAirdropInfo(i);
          
          loadedAirdrops.push({
            id: i,
            totalAmount: ethers.utils.formatEther(airdropInfo.totalAmount),
            amountPerUser: ethers.utils.formatEther(airdropInfo.amountPerUser),
            endTime: airdropInfo.endTime.toNumber(),
            active: airdropInfo.active,
            userClaimed: airdropInfo.userClaimed,
            userEligible: airdropInfo.userEligible
          });
        } catch (err) {
          console.log(`Error loading airdrop ${i}:`, err);
        }
      }

      setAirdrops(loadedAirdrops.reverse()); // Show newest first
    } catch (error) {
      console.error('Error loading airdrops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAirdrop = async (e) => {
    e.preventDefault();
    if (!ecosystemContract || !tokenContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      // Parse addresses (split by comma or newline)
      const addressList = newAirdrop.addresses
        .split(/[,\n]/)
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0);

      if (addressList.length === 0) {
        setMessage({ type: 'error', text: 'Please enter at least one address' });
        setLoading(false);
        return;
      }

      // Validate addresses
      for (const addr of addressList) {
        if (!ethers.utils.isAddress(addr)) {
          setMessage({ type: 'error', text: `Invalid address: ${addr}` });
          setLoading(false);
          return;
        }
      }

      const amountPerUser = ethers.utils.parseEther(newAirdrop.amountPerUser);
      const totalAmount = amountPerUser.mul(addressList.length);
      const durationSeconds = parseInt(newAirdrop.duration) * 86400;

      // First approve tokens
      setMessage({ type: 'info', text: 'Approving tokens...' });
      const approveTx = await tokenContract.approve(ecosystemContract.address, totalAmount);
      await approveTx.wait();

      // Create airdrop
      setMessage({ type: 'info', text: 'Creating airdrop...' });
      const tx = await ecosystemContract.createAirdrop(
        amountPerUser,
        addressList,
        durationSeconds
      );
      await tx.wait();

      setMessage({ 
        type: 'success', 
        text: `Airdrop created! ${addressList.length} users eligible for ${newAirdrop.amountPerUser} ALDO each.` 
      });
      setShowCreateModal(false);
      setNewAirdrop({
        amountPerUser: '',
        addresses: '',
        duration: '7'
      });
      await loadAirdrops();
      await loadBalances();
    } catch (error) {
      console.error('Create airdrop error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to create airdrop' });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimAirdrop = async (airdropId) => {
    if (!ecosystemContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      setMessage({ type: 'info', text: 'Claiming airdrop...' });
      const tx = await ecosystemContract.claimAirdrop(airdropId);
      await tx.wait();

      setMessage({ type: 'success', text: 'Airdrop claimed successfully! 🎉' });
      await loadAirdrops();
      await loadBalances();
    } catch (error) {
      console.error('Claim airdrop error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to claim airdrop' });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeLeft = (endTime) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = endTime - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getStatusBadge = (airdrop) => {
    if (airdrop.userClaimed) {
      return <span className="badge bg-green-500 text-white">✓ Claimed</span>;
    }
    if (!airdrop.active) {
      return <span className="badge bg-gray-500 text-white">Ended</span>;
    }
    if (!airdrop.userEligible) {
      return <span className="badge bg-red-500 text-white">Not Eligible</span>;
    }
    return <span className="badge bg-blue-500 text-white animate-pulse">Claimable</span>;
  };

  if (loading && airdrops.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading-spinner"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">🎁 Token Airdrops</h1>
        {isOwner && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <span className="text-xl">➕</span>
            Create Airdrop
          </button>
        )}
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

      {/* Info Card */}
      <div className="card border-2 border-purple-500/30 bg-purple-500/5">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h4 className="font-semibold text-purple-400 mb-2">How Airdrops Work</h4>
            <p className="text-sm text-slate-300 mb-2">
              Airdrops distribute tokens to selected addresses for free. Common use cases:
            </p>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Community rewards for early supporters</li>
              <li>Marketing campaigns to attract users</li>
              <li>Token distribution events</li>
              <li>Loyalty programs for existing holders</li>
            </ul>
            <p className="text-xs text-slate-400 mt-2">
              ⚠️ Only eligible addresses can claim. Each address can claim once.
            </p>
          </div>
        </div>
      </div>

      {/* Airdrops Grid */}
      {airdrops.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold mb-2">No Airdrops Available</h2>
          <p className="text-slate-400 mb-4">
            {isOwner 
              ? 'Create an airdrop to distribute tokens to your community!'
              : 'Check back later for upcoming airdrops.'}
          </p>
          {isOwner && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary inline-block"
            >
              Create Airdrop
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {airdrops.map((airdrop) => {
            const canClaim = airdrop.active && airdrop.userEligible && !airdrop.userClaimed;

            return (
              <div key={airdrop.id} className="card hover:border-purple-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      🎁 Airdrop #{airdrop.id}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {formatTimeLeft(airdrop.endTime)}
                    </p>
                  </div>
                  {getStatusBadge(airdrop)}
                </div>

                {/* Amount Display */}
                <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 mb-4">
                  <p className="text-sm text-slate-400 mb-2">Claimable Amount</p>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {parseFloat(airdrop.amountPerUser).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">ALDO per user</p>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Pool</span>
                    <span className="font-semibold">
                      {parseFloat(airdrop.totalAmount).toLocaleString()} ALDO
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className={`font-semibold ${airdrop.active ? 'text-green-400' : 'text-gray-400'}`}>
                      {airdrop.active ? 'Active' : 'Ended'}
                    </span>
                  </div>
                </div>

                {/* Claim Button */}
                {canClaim ? (
                  <button
                    onClick={() => handleClaimAirdrop(airdrop.id)}
                    disabled={loading}
                    className="btn btn-primary w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Claiming...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🎉</span>
                        Claim {airdrop.amountPerUser} ALDO
                      </>
                    )}
                  </button>
                ) : airdrop.userClaimed ? (
                  <div className="text-center py-3 bg-green-500/20 rounded-lg border border-green-500/50">
                    <span className="text-green-400 font-semibold">✓ Already Claimed</span>
                  </div>
                ) : !airdrop.userEligible ? (
                  <div className="text-center py-3 bg-red-500/20 rounded-lg border border-red-500/50">
                    <span className="text-red-400 font-semibold">Not Eligible</span>
                  </div>
                ) : (
                  <div className="text-center py-3 bg-gray-500/20 rounded-lg border border-gray-500/50">
                    <span className="text-gray-400 font-semibold">Airdrop Ended</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Airdrop Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create Airdrop Campaign</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateAirdrop} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount Per User (ALDO) *</label>
                <input
                  type="number"
                  value={newAirdrop.amountPerUser}
                  onChange={(e) => setNewAirdrop({ ...newAirdrop, amountPerUser: e.target.value })}
                  placeholder="100"
                  step="0.000001"
                  min="0"
                  className="input-field"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">
                  Each eligible address will receive this amount
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Eligible Addresses * (one per line or comma-separated)
                </label>
                <textarea
                  value={newAirdrop.addresses}
                  onChange={(e) => setNewAirdrop({ ...newAirdrop, addresses: e.target.value })}
                  placeholder="0x1234...&#10;0x5678...&#10;0xabcd..."
                  className="input-field min-h-[150px] font-mono text-sm"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">
                  {newAirdrop.addresses.split(/[,\n]/).filter(a => a.trim()).length} addresses entered
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (Days) *</label>
                <input
                  type="number"
                  value={newAirdrop.duration}
                  onChange={(e) => setNewAirdrop({ ...newAirdrop, duration: e.target.value })}
                  placeholder="7"
                  min="1"
                  className="input-field"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">
                  How long users have to claim the airdrop
                </p>
              </div>

              {/* Summary */}
              {newAirdrop.amountPerUser && newAirdrop.addresses && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm font-semibold mb-2">📊 Airdrop Summary:</p>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>
                      • Eligible Users: {newAirdrop.addresses.split(/[,\n]/).filter(a => a.trim()).length}
                    </li>
                    <li>
                      • Per User: {newAirdrop.amountPerUser} ALDO
                    </li>
                    <li>
                      • Total Required: {(
                        parseFloat(newAirdrop.amountPerUser || 0) * 
                        newAirdrop.addresses.split(/[,\n]/).filter(a => a.trim()).length
                      ).toLocaleString()} ALDO
                    </li>
                    <li>• Duration: {newAirdrop.duration} days</li>
                  </ul>
                </div>
              )}

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  ⚠️ Make sure you have approved enough ALDO tokens. 
                  Total needed: <strong>
                    {(parseFloat(newAirdrop.amountPerUser || 0) * 
                      newAirdrop.addresses.split(/[,\n]/).filter(a => a.trim()).length
                    ).toLocaleString()} ALDO
                  </strong>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Airdrop'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Airdrop; 