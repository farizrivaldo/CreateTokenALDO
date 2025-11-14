import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

function NFTMarketplace() {
  const { marketplaceContract, tokenContract, account, loadBalances } = useWeb3();
  const [listedNFTs, setListedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    loadListedNFTs();
  }, [marketplaceContract]);

  const loadListedNFTs = async () => {
    try {
      if (!marketplaceContract) return;
      setLoading(true);

      const total = await marketplaceContract.getTotalSupply();
      const listed = [];

      for (let i = 1; i <= total.toNumber(); i++) {
        try {
          const exists = await marketplaceContract.exists(i);
          if (!exists) continue;

          const listing = await marketplaceContract.listings(i);
          
          if (listing.isListed) {
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

            listed.push({
              tokenId: i,
              price: ethers.utils.formatEther(listing.price),
              seller: listing.seller,
              ...metadata
            });
          }
        } catch (err) {
          console.log(`Error loading NFT #${i}:`, err);
        }
      }

      setListedNFTs(listed);
    } catch (error) {
      console.error('Error loading listed NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (tokenId, price) => {
    try {
      setBuyingId(tokenId);
      setMessage({ type: '', text: '' });

      // First approve token transfer
      const priceInWei = ethers.utils.parseEther(price);
      const approveTx = await tokenContract.approve(
        marketplaceContract.address,
        priceInWei
      );
      
      setMessage({ type: 'info', text: 'Approving token transfer...' });
      await approveTx.wait();

      // Then buy NFT
      const buyTx = await marketplaceContract.buyNFT(tokenId);
      setMessage({ type: 'info', text: 'Purchasing NFT...' });
      await buyTx.wait();

      setMessage({ type: 'success', text: `Successfully purchased NFT #${tokenId}!` });
      await loadBalances();
      await loadListedNFTs();
    } catch (error) {
      console.error('Buy error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to purchase NFT' });
    } finally {
      setBuyingId(null);
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
        <h1 className="text-3xl font-bold gradient-text">NFT Marketplace</h1>
        <div className="badge badge-info">{listedNFTs.length} NFTs Listed</div>
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
      {listedNFTs.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">No NFTs Listed</h2>
          <p className="text-slate-400 mb-4">Be the first to list an NFT for sale!</p>
          <Link to="/my-nfts" className="btn btn-primary inline-block">
            List Your NFTs
          </Link>
        </div>
      ) : (
        /* NFT Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listedNFTs.map((nft) => (
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
                  <span className="badge badge-success">For Sale</span>
                </div>
                
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {nft.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-400">Price</p>
                    <p className="text-xl font-bold text-indigo-400">{nft.price} ALDO</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Seller</p>
                    <p className="text-xs font-mono">
                      {nft.seller.substring(0, 6)}...{nft.seller.substring(38)}
                    </p>
                  </div>
                </div>

                {nft.seller.toLowerCase() === account.toLowerCase() ? (
                  <button
                    disabled
                    className="btn btn-secondary w-full cursor-not-allowed opacity-50"
                  >
                    Your NFT
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(nft.tokenId, nft.price)}
                    disabled={buyingId === nft.tokenId}
                    className="btn btn-primary w-full"
                  >
                    {buyingId === nft.tokenId ? (
                      <>
                        <span className="loading-spinner"></span>
                        Buying...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🛒</span>
                        Buy Now
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NFTMarketplace;