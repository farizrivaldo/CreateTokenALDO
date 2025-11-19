import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

function Governance() {
  const { ecosystemContract, account, isOwner } = useWeb3();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', description: '' });
  const [canPropose, setCanPropose] = useState(false);

  useEffect(() => {
    loadProposals();
    checkCanPropose();
  }, [ecosystemContract, account]);

  const checkCanPropose = async () => {
    try {
      if (!ecosystemContract || !account) return;
      const stakeInfo = await ecosystemContract.stakes(account);
      const minStake = await ecosystemContract.MIN_PROPOSAL_STAKE();
      setCanPropose(stakeInfo.amount.gte(minStake));
    } catch (error) {
      console.error('Error checking proposal eligibility:', error);
    }
  };

  const loadProposals = async () => {
    try {
      if (!ecosystemContract) return;
      setLoading(true);

      const count = await ecosystemContract.proposalCount();
      const loadedProposals = [];

      for (let i = 1; i <= count.toNumber(); i++) {
        try {
          const proposal = await ecosystemContract.getProposal(i);
          const hasVoted = await ecosystemContract.hasVoted(i, account);
          
          loadedProposals.push({
            id: i,
            proposer: proposal.proposer,
            title: proposal.title,
            description: proposal.description,
            forVotes: ethers.utils.formatEther(proposal.forVotes),
            againstVotes: ethers.utils.formatEther(proposal.againstVotes),
            endTime: proposal.endTime.toNumber(),
            executed: proposal.executed,
            isActive: proposal.isActive,
            hasVoted
          });
        } catch (err) {
          console.log(`Error loading proposal ${i}:`, err);
        }
      }

      setProposals(loadedProposals.reverse()); // Show newest first
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    if (!ecosystemContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      setMessage({ type: 'info', text: 'Creating proposal...' });
      const tx = await ecosystemContract.createProposal(
        newProposal.title,
        newProposal.description
      );
      await tx.wait();

      setMessage({ type: 'success', text: 'Proposal created successfully!' });
      setShowCreateModal(false);
      setNewProposal({ title: '', description: '' });
      await loadProposals();
    } catch (error) {
      console.error('Create proposal error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to create proposal' });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId, support) => {
    if (!ecosystemContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      setMessage({ type: 'info', text: 'Submitting vote...' });
      const tx = await ecosystemContract.vote(proposalId, support);
      await tx.wait();

      setMessage({ 
        type: 'success', 
        text: `Voted ${support ? 'FOR' : 'AGAINST'} proposal #${proposalId}!` 
      });
      await loadProposals();
    } catch (error) {
      console.error('Vote error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to vote' });
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async (proposalId) => {
    if (!ecosystemContract) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      setMessage({ type: 'info', text: 'Executing proposal...' });
      const tx = await ecosystemContract.executeProposal(proposalId);
      await tx.wait();

      setMessage({ type: 'success', text: `Proposal #${proposalId} executed!` });
      await loadProposals();
    } catch (error) {
      console.error('Execute error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to execute' });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeLeft = (endTime) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = endTime - now;
    
    if (diff <= 0) return 'Voting ended';
    
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getVotePercentage = (forVotes, againstVotes) => {
    const total = parseFloat(forVotes) + parseFloat(againstVotes);
    if (total === 0) return { for: 0, against: 0 };
    
    return {
      for: ((parseFloat(forVotes) / total) * 100).toFixed(1),
      against: ((parseFloat(againstVotes) / total) * 100).toFixed(1)
    };
  };

  if (loading && proposals.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading-spinner"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">🗳️ Governance</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!canPropose}
          className="btn btn-primary"
          title={!canPropose ? 'Need 10,000 ALDO staked to propose' : ''}
        >
          <span className="text-xl">➕</span>
          Create Proposal
        </button>
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

      {/* Proposal Requirement Info */}
      {!canPropose && (
        <div className="card border-2 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">Proposal Requirements</h4>
              <p className="text-sm text-slate-300">
                You need at least 10,000 ALDO staked to create proposals. 
                Head to the Staking page to stake more tokens.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🗳️</div>
          <h2 className="text-2xl font-bold mb-2">No Proposals Yet</h2>
          <p className="text-slate-400">Be the first to create a proposal!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => {
            const percentages = getVotePercentage(proposal.forVotes, proposal.againstVotes);
            const totalVotes = parseFloat(proposal.forVotes) + parseFloat(proposal.againstVotes);
            
            return (
              <div key={proposal.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-indigo-400">#{proposal.id}</span>
                      <h3 className="text-xl font-bold">{proposal.title}</h3>
                      {proposal.executed && (
                        <span className="badge bg-green-500 text-white">Executed</span>
                      )}
                      {proposal.isActive && !proposal.executed && (
                        <span className="badge bg-blue-500 text-white">Active</span>
                      )}
                      {!proposal.isActive && !proposal.executed && (
                        <span className="badge bg-gray-500 text-white">Ended</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      Proposed by: {proposal.proposer.substring(0, 10)}...{proposal.proposer.substring(38)}
                    </p>
                    <p className="text-slate-300 mb-4">{proposal.description}</p>
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    {formatTimeLeft(proposal.endTime)}
                  </div>
                </div>

                {/* Voting Results */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-400">For: {parseFloat(proposal.forVotes).toLocaleString()} ({percentages.for}%)</span>
                    <span className="text-red-400">Against: {parseFloat(proposal.againstVotes).toLocaleString()} ({percentages.against}%)</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden flex">
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${percentages.for}%` }}
                    ></div>
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${percentages.against}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    Total Votes: {totalVotes.toLocaleString()} ALDO
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {proposal.isActive && !proposal.hasVoted && (
                    <>
                      <button
                        onClick={() => handleVote(proposal.id, true)}
                        disabled={loading}
                        className="btn btn-success flex-1"
                      >
                        ✅ Vote For
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, false)}
                        disabled={loading}
                        className="btn btn-danger flex-1"
                      >
                        ❌ Vote Against
                      </button>
                    </>
                  )}
                  {proposal.hasVoted && (
                    <div className="flex-1 text-center py-2 bg-slate-700 rounded-lg">
                      <span className="text-slate-400">✓ You already voted</span>
                    </div>
                  )}
                  {!proposal.isActive && !proposal.executed && isOwner && (
                    <button
                      onClick={() => handleExecute(proposal.id)}
                      disabled={loading || parseFloat(proposal.forVotes) <= parseFloat(proposal.againstVotes)}
                      className="btn btn-primary flex-1"
                    >
                      Execute Proposal
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Proposal</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Proposal Title *</label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  placeholder="Increase staking rewards"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  placeholder="Detailed description of the proposal..."
                  className="input-field min-h-[150px]"
                  required
                />
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  ℹ️ This proposal will be open for voting for 7 days. 
                  All stakers can vote with their voting power equal to their staked amount.
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
                    'Create Proposal'
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

export default Governance;