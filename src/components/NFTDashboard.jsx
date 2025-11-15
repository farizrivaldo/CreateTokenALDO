import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Image, TrendingUp, ShoppingBag, Wallet } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const NFTDashboard = () => {
  const { marketplaceContract, account, provider } = useWeb3();
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [myNFTCount, setMyNFTCount] = useState(0);
  const [listedCount, setListedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, [marketplaceContract, account]);

  const loadStats = async () => {
    try {
      if (!marketplaceContract) return;
      setLoading(true);

      const total = await marketplaceContract.getTotalSupply();
      setTotalNFTs(total.toNumber());

      // Count owned NFTs
      let owned = 0;
      let listed = 0;
      
      for (let i = 1; i <= total.toNumber(); i++) {
        try {
          const exists = await marketplaceContract.exists(i);
          if (exists) {
            const owner = await marketplaceContract.ownerOf(i);
            const listing = await marketplaceContract.listings(i);
            
            if (listing.isListed) {
              listed++;
              if (listing.seller.toLowerCase() === account.toLowerCase()) {
                owned++;
              }
            } else if (owner.toLowerCase() === account.toLowerCase()) {
              owned++;
            }
          }
        } catch (err) {
          // Token doesn't exist or error
        }
      }

      setMyNFTCount(owned);
      setListedCount(listed);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">NFT Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total NFTs</p>
              <p className="text-2xl font-bold">{totalNFTs}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">My NFTs</p>
              <p className="text-2xl font-bold text-blue-400">{myNFTCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Listed</p>
              <p className="text-2xl font-bold text-green-400">{listedCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Available</p>
              <p className="text-2xl font-bold text-indigo-400">{totalNFTs - listedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">🎨 Create NFT</h3>
          <p className="text-slate-300 mb-4">
            Mint your own unique NFT with custom metadata and images
          </p>
         
        <button
          onClick={() => navigate("/create-nft")}
          className="btn btn-primary inline-block"
        >
          Create NFT
        </button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">🛒 Marketplace</h3>
          <p className="text-slate-300 mb-4">
            Browse and purchase NFTs using ALDO tokens
          </p>
        
        <button
          onClick={() => navigate("/marketplace")}
          className="btn btn-primary inline-block"
        >
          Browse Marketplace
        </button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">💼 My Collection</h3>
          <p className="text-slate-300 mb-4">
            View and manage your NFT collection
          </p>
       
           <button
          onClick={() => navigate("/my-nfts")}
          className="btn btn-primary inline-block"
        >
          View Collection
        </button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">📊 Statistics</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Total Supply: {totalNFTs} NFTs</li>
            <li>Your NFTs: {myNFTCount}</li>
            <li>Listed: {listedCount}</li>
            <li>Available: {totalNFTs - listedCount}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NFTDashboard;
