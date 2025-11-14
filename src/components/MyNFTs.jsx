import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

function MyNFTs() {
  const { marketplaceContract, account, isOwner, loadBalances } = useWeb3();
  const [myNFTs, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [listingModal, setListingModal] = useState({ open: false, nft: null });
  const [listPrice, setListPrice] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadMyNFTs();
  }, [marketplaceContract, account]);

  const loadMyNFTs = async () => {
    try {
      if (!marketplaceContract || !account) return;
      setLoading(true);

      const total = await marketplaceContract.getTotalSupply();
      const owned = [];

      for (let i = 1; i <= total.toNumber(); i++) {
        try {
          const exists = await marketplaceContract.exists(i);
          if (!exists) continue;

          const owner = await marketplaceContract.ownerOf(i);
          const listing = await marketplaceContract.listings(i);
          
          // Check if user owns it or has it listed
          const isOwned = owner.toLowerCase() === account.toLowerCase();
          const isListed = listing.isListed && listing.seller.toLowerCase() === account.toLowerCase();

          if (isOwned || isListed) {
            const tokenURI = await marketplaceContract.tokenURI(i);
            let metadata = { name: `NFT #${i}`, description: '', image: '' };

            try {
              if (tokenURI.startsWith('data:')) {
                const base64 = tokenURI.split(',')[1];
                metadata = JSON.parse(atob(base64));
              } else {
                const response = await fetch(tokenURI);
                metadata = await response.json();
              }
            } catch (err) {
              console.log('Error loading metadata:', err);
            }

            owned.push({
              tokenId: i,
              isListed: listing.isListed,
              price: listing.isListed ? ethers.utils.formatEther(listing.price) : '0',
              ...metadata
            });
          }
        } catch (err) {
          console.log(`Error loading NFT #${i}:`, err);
        }
      }

      setMyNFTs(owned);
    } catch (error) {
      console.error('Error loading my NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleList = async () => {
    try {
      if (!listingModal.nft) return;
      setActionLoading('list');
      setMessage({ type: '', text: '' });

      const priceInWei = ethers.utils.parseEther(listPrice);
      const tx = await marketplaceContract.listNFT(listingModal.nft.tokenId, priceInWei);
      
      setMessage({ type: 'info', text: 'Listing NFT...' });
      await tx.wait();

      setMessage({ type: 'success', text: `NFT #${listingModal.nft.tokenId} listed successfully!` });
      setListingModal({ open: false, nft: null });
      setListPrice('');
      await loadMyNFTs();
      await loadBalances();
    } catch (error) {
      console.error('List error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to list NFT' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlist = async (tokenId) => {
    try {
      setActionLoading(`unlist-${tokenId}`);
      setMessage({ type: '', text: '' });

      const tx = await marketplaceContract.unlistNFT(tokenId);
      setMessage({ type: 'info', text: 'Unlisting NFT...' });
      await tx.wait();

      setMessage({ type: 'success', text: `NFT #${tokenId} unlisted successfully!` });
      await loadMyNFTs();
    } catch (error) {
      console.error('Unlist error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to unlist NFT' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleBurn = async (tokenId) => {
    if (!window.confirm(`Are you sure you want to burn NFT #${tokenId}? This action cannot be undone!`)) {
      return;
    }

    try {
      setActionLoading(`burn-${tokenId}`);
      setMessage({ type: '', text: '' });

      const tx = await marketplaceContract.burnNFT(tokenId);
      setMessage({ type: 'info', text: 'Burning NFT...' });
      await tx.wait();

      setMessage({ type: 'success', text: `NFT #${tokenId} burned successfully!` });
      await loadMyNFTs();
    } catch (error) {
      console.error('Burn error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to burn NFT' });
    } finally {
      setActionLoading(null);
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
        <h1 className="text-3xl font-bold gradient-text">My NFT Collection</h1>
        <div className="badge badge-info">{myNFTs.length} NFTs</div>
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

      {/* Empty State */}
      {myNFTs.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <h2 className="text-2xl font-bold mb-2">No NFTs Yet</h2>
          <p className="text-slate-400 mb-4">Create your first NFT to get started!</p>
          <Link to="/create-nft" className="btn btn-primary inline-block">
            Create NFT
          </Link>
        </div>
      ) : (
        /* NFT Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myNFTs.map((nft) => (
            <div key={nft.tokenId} className="nft-card">
              <img
                src={nft.image || 'https://via.placeholder.com/400x240?text=NFT'}
                alt={nft.name}
                className="nft-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x240?text=NFT';
                }}
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold">{nft.name}</h3>
                  {nft.isListed && (
                    <span className="badge badge-success">Listed</span>
                  )}
                </div>
                
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {nft.description}
                </p>

                {nft.isListed && (
                  <div className="mb-4 p-3 bg-slate-700 rounded-lg">
                    <p className="text-xs text-slate-400">Listed Price</p>
                    <p className="text-xl font-bold text-indigo-400">{nft.price} ALDO</p>
                  </div>
                )}

                <div className="space-y-2">
                  {!nft.isListed ? (
                    <button
                      onClick={() => setListingModal({ open: true, nft })}
                      className="btn btn-primary w-full"
                    >
                      <span className="text-xl">🏷️</span>
                      List for Sale
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnlist(nft.tokenId)}
                      disabled={actionLoading === `unlist-${nft.tokenId}`}
                      className="btn btn-secondary w-full"
                    >
                      {actionLoading === `unlist-${nft.tokenId}` ? (
                        <>
                          <span className="loading-spinner"></span>
                          Unlisting...
                        </>
                      ) : (
                        <>
                          <span className="text-xl">❌</span>
                          Unlist
                        </>
                      )}
                    </button>
                  )}

                  {isOwner && !nft.isListed && (
                    <button
                      onClick={() => handleBurn(nft.tokenId)}
                      disabled={actionLoading === `burn-${nft.tokenId}`}
                      className="btn btn-danger w-full"
                    >
                      {actionLoading === `burn-${nft.tokenId}` ? (
                        <>
                          <span className="loading-spinner"></span>
                          Burning...
                        </>
                      ) : (
                        <>
                          <span className="text-xl">🔥</span>
                          Burn NFT
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listing Modal */}
      {listingModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">List NFT for Sale</h2>
              <button
                onClick={() => setListingModal({ open: false, nft: null })}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <img
                src={listingModal.nft?.image}
                alt={listingModal.nft?.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x240?text=NFT';
                }}
              />
              <h3 className="text-lg font-bold">{listingModal.nft?.name}</h3>
              <p className="text-sm text-slate-400">{listingModal.nft?.description}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Price (ALDO Tokens)
              </label>
              <input
                type="number"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                placeholder="0.0"
                step="0.000001"
                min="0"
                className="input-field"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setListingModal({ open: false, nft: null })}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleList}
                disabled={!listPrice || actionLoading === 'list'}
                className="btn btn-primary flex-1"
              >
                {actionLoading === 'list' ? (
                  <>
                    <span className="loading-spinner"></span>
                    Listing...
                  </>
                ) : (
                  'List NFT'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyNFTs;