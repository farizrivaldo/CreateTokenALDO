import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function TokenStatistics() {
  const { provider, tokenContract, account } = useWeb3();
  const [stats, setStats] = useState({
    totalSupply: '0',
    totalHolders: 0,
    totalTransactions: 0,
    totalMinted: '0',
    totalBurned: '0',
    circulatingSupply: '0',
    yourPercentage: '0',
    topHolders: [],
    priceHistory: [],
    volumeHistory: [],
    transactionHistory: []
  });
  const [loading, setLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    if (!provider || !tokenContract || !account) return;

    try {
      setLoading(true);
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 100000);

      // Get total supply
      const totalSupply = await tokenContract.totalSupply();
      const totalSupplyFormatted = ethers.utils.formatEther(totalSupply);

      // Get all Transfer events
      const transferFilter = tokenContract.filters.Transfer(null, null);
      const transfers = await tokenContract.queryFilter(transferFilter, fromBlock, currentBlock);

      console.log('Found', transfers.length, 'transfers');

      // Calculate statistics
      const holders = new Map();
      let totalMinted = ethers.BigNumber.from(0);
      let totalBurned = ethers.BigNumber.from(0);
      const dailyVolume = new Map();
      const dailyTxCount = new Map();
      const zeroAddress = '0x0000000000000000000000000000000000000000';

      for (const event of transfers) {
        const from = event.args.from;
        const to = event.args.to;
        const value = event.args.value;
        const block = await event.getBlock();
        const date = new Date(block.timestamp * 1000).toLocaleDateString();

        // Track mints
        if (from === zeroAddress) {
          totalMinted = totalMinted.add(value);
        }

        // Track burns
        if (to === zeroAddress) {
          totalBurned = totalBurned.add(value);
        }

        // Track holders
        if (to !== zeroAddress) {
          const currentBalance = holders.get(to) || ethers.BigNumber.from(0);
          holders.set(to, currentBalance.add(value));
        }
        if (from !== zeroAddress) {
          const currentBalance = holders.get(from) || ethers.BigNumber.from(0);
          holders.set(from, currentBalance.sub(value));
        }

        // Track daily volume
        const currentVolume = dailyVolume.get(date) || ethers.BigNumber.from(0);
        dailyVolume.set(date, currentVolume.add(value));

        // Track daily transactions
        dailyTxCount.set(date, (dailyTxCount.get(date) || 0) + 1);
      }

      // Filter holders with balance > 0
      const activeHolders = Array.from(holders.entries())
        .filter(([_, balance]) => balance.gt(0))
        .map(([address, balance]) => ({
          address,
          balance: ethers.utils.formatEther(balance),
          percentage: (parseFloat(ethers.utils.formatEther(balance)) / parseFloat(totalSupplyFormatted) * 100).toFixed(2)
        }))
        .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));

      // Get top 10 holders
      const topHolders = activeHolders.slice(0, 10);

      // Calculate your percentage
      const yourBalance = await tokenContract.balanceOf(account);
      const yourPercentage = (parseFloat(ethers.utils.formatEther(yourBalance)) / parseFloat(totalSupplyFormatted) * 100).toFixed(2);

      // Prepare volume history for chart
      const volumeHistory = Array.from(dailyVolume.entries())
        .map(([date, volume]) => ({
          date,
          volume: parseFloat(ethers.utils.formatEther(volume)).toFixed(2),
          transactions: dailyTxCount.get(date) || 0
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-30); // Last 30 days

      // Prepare transaction count history
      const transactionHistory = Array.from(dailyTxCount.entries())
        .map(([date, count]) => ({
          date,
          count
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-30);

      // Mock price history (since we don't have real price data)
      const priceHistory = volumeHistory.map((item, index) => ({
        date: item.date,
        price: (1 + Math.random() * 0.5 + index * 0.01).toFixed(4)
      }));

      setStats({
        totalSupply: totalSupplyFormatted,
        totalHolders: activeHolders.length,
        totalTransactions: transfers.length,
        totalMinted: ethers.utils.formatEther(totalMinted),
        totalBurned: ethers.utils.formatEther(totalBurned),
        circulatingSupply: ethers.utils.formatEther(totalSupply.sub(totalBurned)),
        yourPercentage,
        topHolders,
        volumeHistory,
        transactionHistory,
        priceHistory
      });

    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  }, [provider, tokenContract, account]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const shortenAddress = (addr) => {
    return addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#f43f5e'];

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <span className="loading-spinner"></span>
          <span className="ml-3">Loading statistics...</span>
        </div>
      </div>
    );
  }

  // Prepare data for pie chart (top holders)
  const pieData = stats.topHolders.slice(0, 5).map((holder, index) => ({
    name: shortenAddress(holder.address),
    value: parseFloat(holder.percentage),
    fullAddress: holder.address
  }));

  return (
    <div className="space-y-6">
      {/* Title & Refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">📊 Token Statistics</h2>
        <button onClick={loadStatistics} className="btn btn-secondary py-1 px-3 text-sm">
          🔄 Refresh
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-indigo-400">
            {parseFloat(stats.totalSupply).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">Total Supply</p>
        </div>

        <div className="card text-center">
          <p className="text-3xl font-bold text-green-400">{stats.totalHolders}</p>
          <p className="text-xs text-slate-400 mt-1">Holders</p>
        </div>

        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-400">{stats.totalTransactions}</p>
          <p className="text-xs text-slate-400 mt-1">Transactions</p>
        </div>

        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-400">
            {parseFloat(stats.totalMinted).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">Total Minted</p>
        </div>

        <div className="card text-center">
          <p className="text-3xl font-bold text-red-400">
            {parseFloat(stats.totalBurned).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">Total Burned</p>
        </div>

        <div className="card text-center">
          <p className="text-3xl font-bold text-yellow-400">{stats.yourPercentage}%</p>
          <p className="text-xs text-slate-400 mt-1">Your Share</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">📈 Daily Volume (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.volumeHistory}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '10px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Area type="monotone" dataKey="volume" stroke="#6366f1" fillOpacity={1} fill="url(#colorVolume)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Count Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">📊 Daily Transactions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.transactionHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '10px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Price History Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">💰 Price Trend (Mock Data)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '10px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Holders Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">🏆 Top 5 Holders Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                formatter={(value, name, props) => [`${value}%`, props.payload.fullAddress]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Holders Table */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">🏆 Top 10 Holders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4">Rank</th>
                <th className="text-left py-3 px-4">Address</th>
                <th className="text-right py-3 px-4">Balance</th>
                <th className="text-right py-3 px-4">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {stats.topHolders.map((holder, index) => (
                <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4">
                    <span className={`font-bold ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-orange-400' :
                      'text-slate-400'
                    }`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                     <a
                      href={`https://sepolia.etherscan.io/address/${holder.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 font-mono text-xs"
                  >
                        {holder.address.toLowerCase() === account.toLowerCase() 
                        ? `${shortenAddress(holder.address)} (You)` 
                        : shortenAddress(holder.address)}
                        
                    </a>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {parseFloat(holder.balance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} ALDO
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="badge badge-info">{holder.percentage}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm font-semibold text-slate-400 mb-2">💎 Market Cap (Mock)</h4>
          <p className="text-2xl font-bold text-indigo-400">
            ${(parseFloat(stats.totalSupply) * 1.23).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-green-400 mt-1">+5.2% (24h)</p>
        </div>

        <div className="card">
          <h4 className="text-sm font-semibold text-slate-400 mb-2">📊 Circulating Supply</h4>
          <p className="text-2xl font-bold text-purple-400">
            {parseFloat(stats.circulatingSupply).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {((parseFloat(stats.circulatingSupply) / parseFloat(stats.totalSupply)) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div className="card">
          <h4 className="text-sm font-semibold text-slate-400 mb-2">🔥 Burn Rate</h4>
          <p className="text-2xl font-bold text-red-400">
            {((parseFloat(stats.totalBurned) / parseFloat(stats.totalMinted)) * 100).toFixed(2)}%
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {parseFloat(stats.totalBurned).toLocaleString()} burned
          </p>
        </div>
      </div>
    </div>
  );
}

export default TokenStatistics;