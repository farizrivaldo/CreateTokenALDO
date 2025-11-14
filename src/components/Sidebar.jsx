import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { 
      path: '/dashboard', 
      icon: '📊', 
      label: 'Token Dashboard',
      description: 'View token info'
    },
    { 
      path: '/mint', 
      icon: '💰', 
      label: 'Mint Tokens',
      description: 'Create & burn tokens'
    },
    { 
      path: '/transfer', 
      icon: '📤', 
      label: 'Transfer Tokens',
      description: 'Send tokens'
    },
    { 
      path: '/nft-dashboard', 
      icon: '🎨', 
      label: 'NFT Dashboard',
      description: 'NFT overview'
    },
    { 
      path: '/create-nft', 
      icon: '✨', 
      label: 'Create NFT',
      description: 'Mint new NFT'
    },
    { 
      path: '/marketplace', 
      icon: '🛒', 
      label: 'Marketplace',
      description: 'Buy NFTs'
    },
    { 
      path: '/my-nfts', 
      icon: '🖼️', 
      label: 'My NFTs',
      description: 'Your collection'
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-800 border-r border-slate-700 transition-all duration-300 z-40 overflow-y-auto ${
          isOpen ? 'w-64' : 'w-0'
        }`}
        style={{ overflowX: 'hidden' }}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-4 z-50 btn btn-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
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