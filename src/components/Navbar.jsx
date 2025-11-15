// import React from 'react';
// import { useWeb3 } from '../contexts/Web3Context';
// import { usePrivy } from '@privy-io/react-auth';

// function Navbar() {
//   const { account, disconnectWallet, isAAMode } = useWeb3();
//   const { logout, user } = usePrivy();

//   const handleDisconnect = () => {
//     if (isAAMode) {
//       logout();
//     } else {
//       disconnectWallet();
//     }
//   };

//   const shortenAddress = (address) => {
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
//   };

//   const getUserDisplay = () => {
//     if (isAAMode && user) {
//       return user?.email?.address || user?.google?.email || 'AA User';
//     }
//     return shortenAddress(account);
//   };

//   return (
//     <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0 z-50">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold gradient-text">ALDO DAPP</h1>
//           <p className="text-xs text-slate-400">
//             {isAAMode ? '🔐 Account Abstraction Mode' : '🦊 MetaMask Connected'}
//           </p>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="bg-slate-700 px-4 py-2 rounded-lg">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               <span className="text-sm font-mono">{getUserDisplay()}</span>
//             </div>
//           </div>

//           <button
//             onClick={handleDisconnect}
//             className="btn btn-secondary"
//           >
//             {isAAMode ? 'Logout' : 'Disconnect'}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { usePrivy } from '@privy-io/react-auth';

function Navbar() {
  const { account, disconnectWallet, isAAMode, user } = useWeb3();
  const { logout } = usePrivy();

  const handleDisconnect = () => {
    if (isAAMode) {
      logout();
    } else {
      disconnectWallet();
    }
  };

  const shortenAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getUserDisplay = () => {
    if (isAAMode && user) {
      // Show email for AA mode
      return user?.email?.address || user?.google?.email || shortenAddress(account);
    }
    // Show shortened address for MetaMask
    return shortenAddress(account);
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">ALDO DAPP</h1>
          <p className="text-xs text-slate-400">
            {isAAMode ? '🔐 Account Abstraction Mode' : '🦊 MetaMask Connected'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-700 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono">{getUserDisplay()}</span>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            className="btn btn-secondary"
          >
            {isAAMode ? 'Logout' : 'Disconnect'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;