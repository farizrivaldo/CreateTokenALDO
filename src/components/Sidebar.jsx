// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Coins,
//   Send,
//   Palette,
//   PlusCircle,
//   Store,
//   Images,
//   Landmark,
//   Vote,
//   Calendar,
//   Gift
// } from "lucide-react";

// function Sidebar({ isOpen, setIsOpen }) {
//   const location = useLocation();
  
//   const menuItems = [
//     { 
//       path: '/dashboard',
//       icon: <LayoutDashboard size={22} strokeWidth={2} />,
//       label: 'Token Dashboard',
//       description: 'View token info',
//       category: 'token'
//     },
//     { 
//       path: '/mint',
//       icon: <Coins size={22} strokeWidth={2}/>,
//       label: 'Mint Tokens',
//       description: 'Create & burn tokens',
//       category: 'token'
//     },
//     { 
//       path: '/transfer',
//       icon: <Send size={22} strokeWidth={2}/>,
//       label: 'Transfer Tokens',
//       description: 'Send tokens',
//       category: 'token'
//     },
//     // ECOSYSTEM FEATURES
//     { 
//       path: '/staking',
//       icon: <Landmark size={22} strokeWidth={2}/>,
//       label: 'Staking',
//       description: 'Stake & earn rewards',
//       category: 'ecosystem',
//       badge: 'NEW'
//     },
//     { 
//       path: '/governance',
//       icon: <Vote size={22} strokeWidth={2}/>,
//       label: 'Governance',
//       description: 'Vote on proposals',
//       category: 'ecosystem',
//       badge: 'NEW'
//     },
//     { 
//       path: '/vesting',
//       icon: <Calendar size={22} strokeWidth={2}/>,
//       label: 'Vesting',
//       description: 'Token vesting',
//       category: 'ecosystem',
//       badge: 'NEW'
//     },
//     { 
//       path: '/airdrop',
//       icon: <Gift size={22} strokeWidth={2}/>,
//       label: 'Airdrop',
//       description: 'Claim airdrops',
//       category: 'ecosystem',
//       badge: 'NEW'
//     },
//     // NFT FEATURES
//     { 
//       path: '/nft-dashboard',
//       icon: <Palette size={22} strokeWidth={2}/>,
//       label: 'NFT Dashboard',
//       description: 'NFT overview',
//       category: 'nft'
//     },
//     { 
//       path: '/create-nft',
//       icon: <PlusCircle size={22} strokeWidth={2} />,
//       label: 'Create NFT',
//       description: 'Mint new NFT',
//       category: 'nft'
//     },
//     { 
//       path: '/marketplace',
//       icon: <Store size={22} strokeWidth={2}/>,
//       label: 'Marketplace',
//       description: 'Buy NFTs',
//       category: 'nft'
//     },
//     { 
//       path: '/my-nfts',
//       icon: <Images size={22} strokeWidth={2} />,
//       label: 'My NFTs',
//       description: 'Your collection',
//       category: 'nft'
//     },
//   ];

//   // Group menu items by category
//   const categories = {
//     token: menuItems.filter(item => item.category === 'token'),
//     ecosystem: menuItems.filter(item => item.category === 'ecosystem'),
//     nft: menuItems.filter(item => item.category === 'nft')
//   };

//   const CategorySection = ({ title, items, emoji }) => (
//     <div className="mb-4">
//       <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
//         {emoji} {title}
//       </div>
//       {items.map((item) => {
//         const isActive = location.pathname === item.path;

//         return (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
//               isActive
//                 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
//                 : 'text-slate-300 hover:bg-slate-700'
//             }`}
//           >
//             {item.icon}
//             <div className="flex-1">
//               <div className="font-medium text-sm">{item.label}</div>
//               <div className="text-xs opacity-75">{item.description}</div>
//             </div>
//             {item.badge && (
//               <span className="badge bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
//                 {item.badge}
//               </span>
//             )}
//           </Link>
//         );
//       })}
//     </div>
//   );

//   return (
//     <>
//       {/* Sidebar */}
//       <aside
//         className={`fixed left-0 top-22 h-[calc(100vh-4rem)] bg-slate-800 border-r border-slate-700 transition-all duration-300 z-40 overflow-y-auto ${
//           isOpen ? 'w-64' : 'w-0'
//         }`}
//         style={{ overflowX: 'hidden' }}
//       >
//         <nav className="p-4 space-y-2 pb-24">
//           <CategorySection title="Token" items={categories.token} emoji="💰" />
//           <CategorySection title="DeFi Ecosystem" items={categories.ecosystem} emoji="🏦" />
//           <CategorySection title="NFT" items={categories.nft} emoji="🎨" />
//         </nav>
//       </aside>

//       {/* Toggle Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`fixed bottom-6 z-50 btn btn-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
//           isOpen ? 'left-[232px]' : 'left-4'
//         }`}
//         title={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
//       >
//         {isOpen ? (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         ) : (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         )}
//       </button>
//     </>
//   );
// }

// export default Sidebar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Coins,
  Send,
  Palette,
  PlusCircle,
  Store,
  Images,
  Landmark,
  Vote,
  Calendar,
  Gift
} from "lucide-react";

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  
  const menuItems = [
    { 
      path: '/dashboard',
      icon: <LayoutDashboard size={22} strokeWidth={2} />,
      label: 'Token Dashboard',
      description: 'View token info',
      category: 'token'
    },
    { 
      path: '/mint',
      icon: <Coins size={22} strokeWidth={2}/>,
      label: 'Mint Tokens',
      description: 'Create & burn tokens',
      category: 'token'
    },
    { 
      path: '/transfer',
      icon: <Send size={22} strokeWidth={2}/>,
      label: 'Transfer Tokens',
      description: 'Send tokens',
      category: 'token'
    },
    { 
      path: '/transfer-eth',
      icon: <Send size={22} strokeWidth={2}/>,
      label: 'Transfer ETH',
      description: 'Send Sepolia ETH',
      category: 'token'
    },
    // ECOSYSTEM FEATURES
    { 
      path: '/staking',
      icon: <Landmark size={22} strokeWidth={2}/>,
      label: 'Staking',
      description: 'Stake & earn rewards',
      category: 'ecosystem',
      badge: 'NEW'
    },
    { 
      path: '/governance',
      icon: <Vote size={22} strokeWidth={2}/>,
      label: 'Governance',
      description: 'Vote on proposals',
      category: 'ecosystem',
      badge: 'NEW'
    },
    { 
      path: '/vesting',
      icon: <Calendar size={22} strokeWidth={2}/>,
      label: 'Vesting',
      description: 'Token vesting',
      category: 'ecosystem',
      badge: 'NEW'
    },
    { 
      path: '/airdrop',
      icon: <Gift size={22} strokeWidth={2}/>,
      label: 'Airdrop',
      description: 'Claim airdrops',
      category: 'ecosystem',
      badge: 'NEW'
    },
    // NFT FEATURES
    { 
      path: '/nft-dashboard',
      icon: <Palette size={22} strokeWidth={2}/>,
      label: 'NFT Dashboard',
      description: 'NFT overview',
      category: 'nft'
    },
    { 
      path: '/create-nft',
      icon: <PlusCircle size={22} strokeWidth={2} />,
      label: 'Create NFT',
      description: 'Mint new NFT',
      category: 'nft'
    },
    { 
      path: '/marketplace',
      icon: <Store size={22} strokeWidth={2}/>,
      label: 'Marketplace',
      description: 'Buy NFTs',
      category: 'nft'
    },
    { 
      path: '/my-nfts',
      icon: <Images size={22} strokeWidth={2} />,
      label: 'My NFTs',
      description: 'Your collection',
      category: 'nft'
    },
  ];

  // Group menu items by category
  const categories = {
    token: menuItems.filter(item => item.category === 'token'),
    ecosystem: menuItems.filter(item => item.category === 'ecosystem'),
    nft: menuItems.filter(item => item.category === 'nft')
  };

  const CategorySection = ({ title, items, emoji }) => (
    <div className="mb-4">
      <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {emoji} {title}
      </div>
      {items.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            {item.icon}
            <div className="flex-1">
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </div>
            {item.badge && (
              <span className="badge bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-22 h-[calc(100vh-4rem)] bg-slate-800 border-r border-slate-700 transition-all duration-300 z-40 overflow-y-auto ${
          isOpen ? 'w-64' : 'w-0'
        }`}
        style={{ overflowX: 'hidden' }}
      >
        <nav className="p-4 space-y-2 pb-24">
          <CategorySection title="Token" items={categories.token} emoji="💰" />
          <CategorySection title="DeFi Ecosystem" items={categories.ecosystem} emoji="🏦" />
          <CategorySection title="NFT" items={categories.nft} emoji="🎨" />
        </nav>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 z-50 btn btn-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen ? 'left-[232px]' : 'left-4'
        }`}
        title={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </>
  );
}

export default Sidebar;