// import React from 'react';
// import { useWeb3 } from '../contexts/Web3Context';

// function Navbar() {
//   const { account, balance, tokenBalance, disconnectWallet } = useWeb3();

//   const shortenAddress = (addr) => {
//     if (!addr) return '';
//     return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
//   };

//   return (
//     <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         {/* Logo & Title */}
//         <div className="flex items-center gap-4">
//           <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <div>
//             <h1 className="text-xl font-bold gradient-text">ALDO DAPP</h1>
//             <p className="text-xs text-slate-400">Sepolia Testnet</p>
//           </div>
//         </div>

//         {/* Balance & Account Info */}
//         <div className="flex items-center gap-4">
//           {/* Balances */}
//           <div className="card py-2 px-4">
//             <div className="flex items-center gap-4">
//               <div className="text-right">
//                 <p className="text-xs text-slate-400">ETH Balance</p>
//                 <p className="text-sm font-semibold">{parseFloat(balance).toFixed(4)} ETH</p>
//               </div>
//               <div className="w-px h-8 bg-slate-600"></div>
//               <div className="text-right">
//                 <p className="text-xs text-slate-400">ALDO Balance</p>
//                 <p className="text-sm font-semibold text-indigo-400">
//                   {parseFloat(tokenBalance).toFixed(2)} ALDO
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Account */}
//           <div className="card py-2 px-4 flex items-center gap-3">
//             <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//             </svg>
//             <div>
//               <p className="text-xs text-slate-400">Connected</p>
//               <p className="text-sm font-semibold">{shortenAddress(account)}</p>
//             </div>
//           </div>

//           {/* Disconnect Button */}
//           <button
//             onClick={disconnectWallet}
//             className="btn btn-secondary py-2 px-4"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Disconnect
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;




import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

function Navbar() {
  const { account, balance, tokenBalance, disconnectWallet, addTokenToMetaMask } = useWeb3();

  const shortenAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h1 className="text-xl font-bold gradient-text">ALDO DAPP</h1>
            <p className="text-xs text-slate-400">Sepolia Testnet</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Balances */}
          <div className="card py-2 px-4">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-400">ETH Balance</p>
                <p className="text-sm font-semibold">{parseFloat(balance).toFixed(4)} ETH</p>
              </div>
              <div className="w-px h-8 bg-slate-600"></div>
              <div className="text-right">
                <p className="text-xs text-slate-400">ALDO Balance</p>
                <p className="text-sm font-semibold text-indigo-400">{parseFloat(tokenBalance).toFixed(2)} ALDO</p>
              </div>
            </div>
          </div>

          {/* Add Token Button */}
          <button
            onClick={addTokenToMetaMask}
            className="btn btn-secondary py-2 px-4 flex items-center gap-2"
            title="Add ALDO to MetaMask"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add ALDO
          </button>

          {/* Account */}
          <div className="card py-2 px-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <div>
              <p className="text-xs text-slate-400">Connected</p>
              <p className="text-sm font-semibold">{shortenAddress(account)}</p>
            </div>
          </div>

          {/* Disconnect Button */}
          <button
            onClick={disconnectWallet}
            className="btn btn-secondary py-2 px-4 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Disconnect
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;