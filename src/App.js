import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useWeb3 } from './contexts/Web3Context';
import './App.css';

// Import all components
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TokenDashboard from './components/TokenDashboard';
import MintToken from './components/MintToken';
import TransferToken from './components/TransferToken';
import NFTDashboard from './components/NFTDashboard';
import CreateNFT from './components/CreateNFT';
import NFTMarketplace from './components/NFTMarketplace';
import MyNFTs from './components/MyNFTs';

function App() {
  const { account } = useWeb3();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Show landing page if not connected
  if (!account) {
    return <LandingPage />;
  }

  // Show main app if connected
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main 
            className={`flex-1 p-6 transition-all duration-300 ${
              sidebarOpen ? 'ml-64' : 'ml-0'
            }`}
          >
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<TokenDashboard />} />
                <Route path="/mint" element={<MintToken />} />
                <Route path="/transfer" element={<TransferToken />} />
                <Route path="/nft-dashboard" element={<NFTDashboard />} />
                <Route path="/create-nft" element={<CreateNFT />} />
                <Route path="/marketplace" element={<NFTMarketplace />} />
                <Route path="/my-nfts" element={<MyNFTs />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;