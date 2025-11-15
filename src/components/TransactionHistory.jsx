import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

function TransactionHistory() {
  const { provider, account, tokenContract, marketplaceContract, } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadTransactions = useCallback(async () => {
    if (!provider || !account || !tokenContract || !marketplaceContract) return;

    try {
      setLoading(true);
      const allTxs = [];
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 100000); // Load more blocks

      console.log('Loading from block:', fromBlock, 'to:', currentBlock);

      // ===== TOKEN TRANSFER (includes mint & burn) =====
    //   try {
    //     const transferFilter = tokenContract.filters.Transfer(null, null);
    //     const transfers = await tokenContract.queryFilter(transferFilter, fromBlock, currentBlock);

    //     console.log('Found', transfers.length, 'transfer events');

    //     for (const event of transfers) {
    //       const block = await event.getBlock();
    //       const from = event.args.from;
    //       const to = event.args.to;
    //       const value = event.args.value;

    //       // Check if user is involved
    //       const isFrom = from.toLowerCase() === account.toLowerCase();
    //       const isTo = to.toLowerCase() === account.toLowerCase();
          
    //       if (!isFrom && !isTo) continue;

    //       // Detect type
    //       const zeroAddress = '0x0000000000000000000000000000000000000000';
    //       let txType = 'token_transfer';
    //       let direction = 'transfer';
    //       let icon = '💸';
    //       let color = 'text-blue-400';

    //       if (from === zeroAddress) {
    //         // MINT
    //         txType = 'token_mint';
    //         direction = 'minted';
    //         icon = '➕';
    //         color = 'text-green-400';
    //       } else if (to === zeroAddress) {
    //         // BURN
    //         txType = 'token_burn';
    //         direction = 'burned';
    //         icon = '🔥';
    //         color = 'text-red-400';
    //       } else if (isFrom) {
    //         // SENT
    //         direction = 'sent';
    //         icon = '📤';
    //         color = 'text-orange-400';
    //       } else if (isTo) {
    //         // RECEIVED
    //         direction = 'received';
    //         icon = '📥';
    //         color = 'text-green-400';
    //       }

    //       allTxs.push({
    //         type: txType,
    //         hash: event.transactionHash,
    //         blockNumber: event.blockNumber,
    //         timestamp: block.timestamp,
    //         from: from,
    //         to: to,
    //         amount: ethers.utils.formatEther(value),
    //         direction: direction,
    //         icon: icon,
    //         color: color
    //       });
    //     }
    //   } catch (err) {
    //     console.error('Error loading token transfers:', err);
    //   }
// ===== TOKEN TRANSFER (mint, burn, transfer) =====
try {

    
  const currentBlock = await provider.getBlockNumber();

  // aman dari rate-limit
  const fromBlock = Math.max(0, currentBlock - 2000);

  // filter wildcard
  const transferFilter = tokenContract.filters.Transfer();

    
    
  const transfers = await tokenContract.queryFilter(
    transferFilter,
    fromBlock,
    currentBlock
  );

  for (const event of transfers) {
    const { from, to, value } = event.args;

    const user = account.toLowerCase();

    const isFrom = from.toLowerCase() === user;
    const isTo = to.toLowerCase() === user;
    
    // jika user tidak terlibat, skip
    if (!isFrom && !isTo) continue;

    const block = await event.getBlock();

    const zero = "0x0000000000000000000000000000000000000000";

    let txType, direction, icon, color;

    if (from === zero) {
      txType = "token_mint";
      direction = "minted";
      color = "text-green-400";
    } else if (to === zero) {
      txType = "token_burn";
      direction = "burned";

      color = "text-red-400";
    } else if (isFrom) {
      txType = "token_transfer";
      direction = "sent";

      color = "text-orange-400";
    } else if (isTo) {
      txType = "token_transfer";
      direction = "received";

      color = "text-green-400";
    }

    allTxs.push({
      type: txType,
      hash: event.transactionHash,
      blockNumber: event.blockNumber,
      timestamp: block.timestamp,
      from,
      to,
      amount: ethers.utils.formatEther(value),
      direction,
      icon,
      color
    });
  }
} catch (err) {
  console.error("Error loading token transfers:", err);
}

      // ===== NFT MINTED =====
      try {
        const mintFilter = marketplaceContract.filters.NFTMinted(null, null, null);
        const mints = await marketplaceContract.queryFilter(mintFilter, fromBlock, currentBlock);
        
        console.log('Found', mints.length, 'NFT mints');
   
        for (const event of mints) {
          if (event.args.owner.toLowerCase() === account.toLowerCase()) {
            const block = await event.getBlock();
            allTxs.push({
              type: 'nft_mint',
              hash: event.transactionHash,
              blockNumber: event.blockNumber,
              timestamp: block.timestamp,
              tokenId: event.args.tokenId.toString(),
              owner: event.args.owner,
              direction: 'created',
       
              color: 'text-purple-400'
            });
          }
        }
      } catch (err) {
        console.error('Error loading NFT mints:', err);
      }

      // ===== NFT LISTED =====
      try {
        const listFilter = marketplaceContract.filters.NFTListed(null, null, null);
        const listings = await marketplaceContract.queryFilter(listFilter, fromBlock, currentBlock);
        
        for (const event of listings) {
          if (event.args.seller.toLowerCase() === account.toLowerCase()) {
            const block = await event.getBlock();
            allTxs.push({
              type: 'nft_list',
              hash: event.transactionHash,
              blockNumber: event.blockNumber,
              timestamp: block.timestamp,
              tokenId: event.args.tokenId.toString(),
              price: ethers.utils.formatEther(event.args.price),
              seller: event.args.seller,
              direction: 'listed',
       
              color: 'text-blue-400'
            });
          }
        }
      } catch (err) {
        console.error('Error loading NFT listings:', err);
      }

      // ===== NFT SOLD =====
      try {
        const soldFilter = marketplaceContract.filters.NFTSold(null, null, null, null);
        const sales = await marketplaceContract.queryFilter(soldFilter, fromBlock, currentBlock);
        
        for (const event of sales) {
          const isBuyer = event.args.buyer.toLowerCase() === account.toLowerCase();
          const isSeller = event.args.seller.toLowerCase() === account.toLowerCase();
          
          if (isBuyer || isSeller) {
            const block = await event.getBlock();
            allTxs.push({
              type: 'nft_sale',
              hash: event.transactionHash,
              blockNumber: event.blockNumber,
              timestamp: block.timestamp,
              tokenId: event.args.tokenId.toString(),
              price: ethers.utils.formatEther(event.args.price),
              buyer: event.args.buyer,
              seller: event.args.seller,
              direction: isBuyer ? 'bought' : 'sold',
         
              color: isBuyer ? 'text-yellow-400' : 'text-green-400'
            });
          }
        }
      } catch (err) {
        console.error('Error loading NFT sales:', err);
      }

      // ===== NFT UNLISTED =====
      try {
        const unlistFilter = marketplaceContract.filters.NFTUnlisted(null);
        const unlistings = await marketplaceContract.queryFilter(unlistFilter, fromBlock, currentBlock);
        
        for (const event of unlistings) {
          const block = await event.getBlock();
          const tx = await event.getTransaction();
          
          // Check if user is the one who unlisted
          if (tx.from.toLowerCase() === account.toLowerCase()) {
            allTxs.push({
              type: 'nft_unlist',
              hash: event.transactionHash,
              blockNumber: event.blockNumber,
              timestamp: block.timestamp,
              tokenId: event.args.tokenId.toString(),
              direction: 'unlisted',
       
              color: 'text-gray-400'
            });
          }
        }
      } catch (err) {
        console.error('Error loading NFT unlistings:', err);
      }

      // Sort by block number (newest first)
      allTxs.sort((a, b) => b.blockNumber - a.blockNumber);

      console.log('Total transactions loaded:', allTxs.length);
      setTransactions(allTxs);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [provider, account, tokenContract, marketplaceContract]);

  useEffect(() => {
    loadTransactions();
    
  }, [loadTransactions]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shortenHash = (hash) => {
    return hash.substring(0, 10) + '...' + hash.substring(hash.length - 8);
  };

  const shortenAddress = (addr) => {
    return addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
  };

  const getFiltered = () => {
    if (filter === 'token') return transactions.filter(tx => tx.type.startsWith('token_'));
    if (filter === 'nft') return transactions.filter(tx => tx.type.startsWith('nft_'));
    return transactions;
  };

  const filtered = getFiltered();
  const tokenTxCount = transactions.filter(tx => tx.type.startsWith('token_')).length;
  const nftTxCount = transactions.filter(tx => tx.type.startsWith('nft_')).length;

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <span className="loading-spinner"></span>
          <span className="ml-3">Loading transaction history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📜 Transaction History</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'} py-1 px-3 text-sm`}
          >
            All ({transactions.length})
          </button>
          <button 
            onClick={() => setFilter('token')} 
            className={`btn ${filter === 'token' ? 'btn-primary' : 'btn-secondary'} py-1 px-3 text-sm`}
          >
            💰 Tokens ({tokenTxCount})
          </button>
          <button 
            onClick={() => setFilter('nft')} 
            className={`btn ${filter === 'nft' ? 'btn-primary' : 'btn-secondary'} py-1 px-3 text-sm`}
          >
            🎨 NFTs ({nftTxCount})
          </button>
          <button 
            onClick={loadTransactions} 
            className="btn btn-secondary py-1 px-3 text-sm"
            title="Refresh"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-4xl mb-4">📭</p>
            <p>No transactions found</p>
            <p className="text-sm mt-2">Try making some transactions first!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Details</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Time</th>
                  <th className="text-left py-3 px-4 font-semibold">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    {/* Type Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tx.icon}</span>
                        <span className={`font-semibold text-sm ${tx.color}`}>
                          {tx.direction.toUpperCase()}
                        </span>
                      </div>
                    </td>

                    {/* Details Column */}
                    <td className="py-3 px-4 text-xs">
                      {tx.type.startsWith('token_') && (
                        <div className="space-y-1">
                          {tx.type === 'token_mint' && (
                            <div>Minted to: {shortenAddress(tx.to)}</div>
                          )}
                          {tx.type === 'token_burn' && (
                            <div>Burned from: {shortenAddress(tx.from)}</div>
                          )}
                          {tx.type === 'token_transfer' && (
                            <>
                              <div className="text-slate-400">From: {shortenAddress(tx.from)}</div>
                              <div className="text-slate-400">To: {shortenAddress(tx.to)}</div>
                            </>
                          )}
                        </div>
                      )}
                      {tx.type === 'nft_mint' && (
                        <div>NFT #{tx.tokenId} created</div>
                      )}
                      {tx.type === 'nft_list' && (
                        <div>NFT #{tx.tokenId} listed for sale</div>
                      )}
                      {tx.type === 'nft_sale' && (
                        <div>
                          <div>NFT #{tx.tokenId}</div>
                          <div className="text-slate-400">
                            {tx.direction === 'bought' ? 'From: ' : 'To: '}
                            {shortenAddress(tx.direction === 'bought' ? tx.seller : tx.buyer)}
                          </div>
                        </div>
                      )}
                      {tx.type === 'nft_unlist' && (
                        <div>NFT #{tx.tokenId} removed from sale</div>
                      )}
                    </td>

                    {/* Amount Column */}
                    <td className="py-3 px-4">
                      {tx.amount && (
                        <span className={`font-semibold text-neutral-50`}>
                          {parseFloat(tx.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4
                          })} ALDO
                        </span>
                      )}
                      {tx.price && (
                        <span className="font-semibold text-neutral-50">
                          {parseFloat(tx.price).toFixed(2)} ALDO
                        </span>
                      )}
                      {tx.tokenId && !tx.price && !tx.amount && (
                        <span className="font-semibold text-neutral-50">NFT #{tx.tokenId}</span>
                      )}
                    </td>

                    {/* Time Column */}
                    <td className="py-3 px-4 text-xs font-semibold text-neutral-50">
                      {formatDate(tx.timestamp)}
                    </td>

                    {/* Transaction Hash Column */}
                    <td className="py-3 px-4">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-xs font-mono hover:underline"
                      >
                        {shortenHash(tx.hash)} ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card text-center py-3">
            <p className="text-xl font-bold text-green-400">
              {transactions.filter(tx => tx.type === 'token_mint').length}
            </p>
            <p className="text-xs text-slate-400">Minted</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-xl font-bold text-red-400">
              {transactions.filter(tx => tx.type === 'token_burn').length}
            </p>
            <p className="text-xs text-slate-400">Burned</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-xl font-bold text-orange-400">
              {transactions.filter(tx => tx.direction === 'sent').length}
            </p>
            <p className="text-xs text-slate-400">Sent</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-xl font-bold text-blue-400">
              {transactions.filter(tx => tx.direction === 'received').length}
            </p>
            <p className="text-xs text-slate-400">Received</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-xl font-bold text-purple-400">
              {transactions.filter(tx => tx.type.startsWith('nft_')).length}
            </p>
            <p className="text-xs text-slate-400">NFT Activity</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;