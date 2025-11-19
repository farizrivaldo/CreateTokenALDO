import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

function Vesting() {
  const { ecosystemContract, tokenContract, account, isOwner, loadBalances } = useWeb3();
  const [vestingSchedules, setVestingSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newVesting, setNewVesting] = useState({
    beneficiary: '',
    amount: '',
    duration: '30', // days
    cliffDuration: '0', // days
    revocable: true
  });

  useEffect(() => {
    loadVestingSchedules();
  }, [ecosystemContract, account]);

  const loadVestingSchedules = async () => {
    try {
      if (!ecosystemContract || !account) return;
      setLoading(true);

      const schedules = [];
      let scheduleIndex = 0;
      
      // Try to load schedules (will error when no more exist)
      while (true) {
        try {
          const vestingInfo = await ecosystemContract.getVestingInfo(account, scheduleIndex);
          
          schedules.push({
            index: scheduleIndex,
            totalAmount: ethers.utils.formatEther(vestingInfo.totalAmount),
            claimedAmount: ethers.utils.formatEther(vestingInfo.claimedAmount),
            vestedAmount: ethers.utils.formatEther(vestingInfo.vestedAmount),
            claimableAmount: ethers.utils.formatEther(vestingInfo.claimableAmount),
            startTime: vestingInfo.startTime.toNumber(),
            endTime: vestingInfo.endTime.toNumber(),
            revoked: vestingInfo.revoked
          });
          
          scheduleIndex++;
        } catch (error) {
          // No more schedules
          break;
        }
      }

      setVestingSchedules(schedules);
    } catch (error) {
      console.error('Error loading vesting schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVesting = async (e) => {
    e.preventDefault();
    if (!ecosystemContract || !tokenContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const amount = ethers.utils.parseEther(newVesting.amount);
      const durationSeconds = parseInt(newVesting.duration) * 86400; // days to seconds
      const cliffSeconds = parseInt(newVesting.cliffDuration) * 86400;

      // First approve tokens
      setMessage({ type: 'info', text: 'Approving tokens...' });
      const approveTx = await tokenContract.approve(ecosystemContract.address, amount);
      await approveTx.wait();

      // Create vesting schedule
      setMessage({ type: 'info', text: 'Creating vesting schedule...' });
      const tx = await ecosystemContract.createVestingSchedule(
        newVesting.beneficiary,
        amount,
        durationSeconds,
        cliffSeconds,
        newVesting.revocable
      );
      await tx.wait();

      setMessage({ type: 'success', text: 'Vesting schedule created successfully!' });
      setShowCreateModal(false);
      setNewVesting({
        beneficiary: '',
        amount: '',
        duration: '30',
        cliffDuration: '0',
        revocable: true
      });
      await loadVestingSchedules();
      await loadBalances();
    } catch (error) {
      console.error('Create vesting error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to create vesting' });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimVested = async (scheduleIndex) => {
    if (!ecosystemContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      setMessage({ type: 'info', text: 'Claiming vested tokens...' });
      const tx = await ecosystemContract.claimVested(scheduleIndex);
      await tx.wait();

      setMessage({ type: 'success', text: 'Vested tokens claimed successfully!' });
      await loadVestingSchedules();
      await loadBalances();
    } catch (error) {
      console.error('Claim vested error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to claim vested tokens' });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeVesting = async (beneficiary, scheduleIndex) => {
    if (!ecosystemContract) return;
    
    if (!window.confirm('Are you sure you want to revoke this vesting schedule?')) {
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      setMessage({ type: 'info', text: 'Revoking vesting schedule...' });
      const tx = await ecosystemContract.revokeVesting(beneficiary, scheduleIndex);
      await tx.wait();

      setMessage({ type: 'success', text: 'Vesting schedule revoked!' });
      await loadVestingSchedules();
      await loadBalances();
    } catch (error) {
      console.error('Revoke error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to revoke vesting' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgress = (vested, total) => {
    if (parseFloat(total) === 0) return 0;
    return ((parseFloat(vested) / parseFloat(total)) * 100).toFixed(1);
  };

  const getTimeLeft = (endTime) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = endTime - now;
    
    if (diff <= 0) return 'Completed';
    
    const days = Math.floor(diff / 86400);
    if (days > 0) return `${days} days left`;
    
    const hours = Math.floor(diff / 3600);
    return `${hours} hours left`;
  };

  if (loading && vestingSchedules.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading-spinner"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">📅 Token Vesting</h1>
        {isOwner && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <span className="text-xl">➕</span>
            Create Vesting Schedule
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
      <div className="card border-2 border-blue-500/30 bg-blue-500/5">
        <div className="flex items-start gap-4">
          <div className="text-3xl">ℹ️</div>
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">What is Token Vesting?</h4>
            <p className="text-sm text-slate-300 mb-2">
              Vesting is a mechanism to gradually release tokens over time. This is commonly used for:
            </p>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Team allocation (long-term alignment)</li>
              <li>Investor allocation (prevent immediate selling)</li>
              <li>Advisory rewards (milestone-based release)</li>
              <li>Partnership agreements</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Vesting Schedules */}
      {vestingSchedules.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold mb-2">No Vesting Schedules</h2>
          <p className="text-slate-400 mb-4">
            {isOwner 
              ? 'Create a vesting schedule to lock tokens for gradual release.'
              : 'You don\'t have any vesting schedules yet.'}
          </p>
          {isOwner && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary inline-block"
            >
              Create Vesting Schedule
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vestingSchedules.map((schedule) => {
            const progress = getProgress(schedule.vestedAmount, schedule.totalAmount);
            const isActive = !schedule.revoked;
            const hasClaimable = parseFloat(schedule.claimableAmount) > 0;

            return (
              <div key={schedule.index} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      Vesting Schedule #{schedule.index + 1}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {formatDate(schedule.startTime)} → {formatDate(schedule.endTime)}
                    </p>
                  </div>
                  <div className="text-right">
                    {schedule.revoked ? (
                      <span className="badge bg-red-500 text-white">Revoked</span>
                    ) : (
                      <span className="badge bg-green-500 text-white">Active</span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 text-right">
                    {getTimeLeft(schedule.endTime)}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Total Amount</p>
                    <p className="text-lg font-bold">
                      {parseFloat(schedule.totalAmount).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">ALDO</p>
                  </div>

                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Vested</p>
                    <p className="text-lg font-bold text-green-400">
                      {parseFloat(schedule.vestedAmount).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">ALDO</p>
                  </div>

                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Claimed</p>
                    <p className="text-lg font-bold text-blue-400">
                      {parseFloat(schedule.claimedAmount).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">ALDO</p>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50">
                    <p className="text-xs text-slate-400 mb-1">Claimable</p>
                    <p className="text-lg font-bold text-purple-400">
                      {parseFloat(schedule.claimableAmount).toFixed(4)}
                    </p>
                    <p className="text-xs text-slate-400">ALDO</p>
                  </div>
                </div>

                {/* Actions */}
                {isActive && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleClaimVested(schedule.index)}
                      disabled={!hasClaimable || loading}
                      className="btn btn-primary w-full"
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner"></span>
                          Claiming...
                        </>
                      ) : (
                        <>
                          <span className="text-xl">💰</span>
                          Claim {parseFloat(schedule.claimableAmount).toFixed(4)} ALDO
                        </>
                      )}
                    </button>

                    {isOwner && (
                      <button
                        onClick={() => handleRevokeVesting(account, schedule.index)}
                        disabled={loading}
                        className="btn btn-danger w-full text-sm"
                      >
                        Revoke Schedule (Owner)
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Vesting Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create Vesting Schedule</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateVesting} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Beneficiary Address *</label>
                <input
                  type="text"
                  value={newVesting.beneficiary}
                  onChange={(e) => setNewVesting({ ...newVesting, beneficiary: e.target.value })}
                  placeholder="0x..."
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Total Amount (ALDO) *</label>
                <input
                  type="number"
                  value={newVesting.amount}
                  onChange={(e) => setNewVesting({ ...newVesting, amount: e.target.value })}
                  placeholder="10000"
                  step="0.000001"
                  min="0"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Vesting Duration (Days) *</label>
                  <input
                    type="number"
                    value={newVesting.duration}
                    onChange={(e) => setNewVesting({ ...newVesting, duration: e.target.value })}
                    placeholder="365"
                    min="1"
                    className="input-field"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Total time for vesting
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cliff Duration (Days)</label>
                  <input
                    type="number"
                    value={newVesting.cliffDuration}
                    onChange={(e) => setNewVesting({ ...newVesting, cliffDuration: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="input-field"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Lock period before vesting starts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg">
                <input
                  type="checkbox"
                  id="revocable"
                  checked={newVesting.revocable}
                  onChange={(e) => setNewVesting({ ...newVesting, revocable: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="revocable" className="text-sm">
                  <strong>Revocable</strong> - Allow owner to cancel this vesting schedule
                </label>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  ⚠️ Make sure you have approved enough ALDO tokens before creating the vesting schedule.
                  The tokens will be locked in the contract and released gradually.
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
                    'Create Vesting'
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

export default Vesting;