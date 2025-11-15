
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useWeb3 } from './contexts/Web3Context';
// import { usePrivy } from '@privy-io/react-auth';
// import { AAWalletProvider } from './contexts/AAWalletContext';
// import './App.css';

// import LandingPage from './components/LandingPage';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import TokenDashboard from './components/TokenDashboard';
// import MintToken from './components/MintToken';
// import TransferToken from './components/TransferToken';
// import NFTDashboard from './components/NFTDashboard';
// import CreateNFT from './components/CreateNFT';
// import NFTMarketplace from './components/NFTMarketplace';
// import MyNFTs from './components/MyNFTs';

// function AppContent() {
//   const { account } = useWeb3();
//   const { authenticated, ready } = usePrivy();
//   const [sidebarOpen, setSidebarOpen] = React.useState(true);

//   // Show landing if not connected via either method
//   if (!account && !authenticated) {
//     return <LandingPage />;
//   }

//   // Show loading while Privy is initializing
//   if (authenticated && !ready) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-900">
//         <div className="text-center">
//           <span className="loading-spinner"></span>
//           <p className="text-white mt-4">Initializing wallet...</p>
//         </div>
//       </div>
//     );
//   }

//   // Wrap with AAWalletProvider if using Privy (no MetaMask account)
//   const MainApp = (
//     <Router>
//       <div className="app-container">
//         <Navbar />
//         <div className="flex">
//           <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
//           <main 
//             className={`flex-1 p-6 transition-all duration-300 ${
//               sidebarOpen ? 'ml-64' : 'ml-0'
//             }`}
//           >
//             <div className="max-w-7xl mx-auto">
//               <Routes>
//                 <Route path="/" element={<Navigate to="/dashboard" replace />} />
//                 <Route path="/dashboard" element={<TokenDashboard />} />
//                 <Route path="/mint" element={<MintToken />} />
//                 <Route path="/transfer" element={<TransferToken />} />
//                 <Route path="/nft-dashboard" element={<NFTDashboard />} />
//                 <Route path="/create-nft" element={<CreateNFT />} />
//                 <Route path="/marketplace" element={<NFTMarketplace />} />
//                 <Route path="/my-nfts" element={<MyNFTs />} />
//               </Routes>
//             </div>
//           </main>
//         </div>
//       </div>
//     </Router>
//   );

//   // If logged in via Privy (AA mode), wrap with AAWalletProvider
//   if (authenticated && !account) {
//     return (
//       <AAWalletProvider>
//         {MainApp}
//       </AAWalletProvider>
//     );
//   }

//   // If using MetaMask, no need for AAWalletProvider
//   return MainApp;
// }

// function App() {
//   return <AppContent />;
// }

// export default App;


//=========================================================================================
//===============================================================================================


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useWeb3 } from './contexts/Web3Context';
// import { usePrivy } from '@privy-io/react-auth';
// import './App.css';

// import LandingPage from './components/LandingPage';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import TokenDashboard from './components/TokenDashboard';
// import MintToken from './components/MintToken';
// import TransferToken from './components/TransferToken';
// import NFTDashboard from './components/NFTDashboard';
// import CreateNFT from './components/CreateNFT';
// import NFTMarketplace from './components/NFTMarketplace';
// import MyNFTs from './components/MyNFTs';

// function AppContent() {
//   const { account, loading } = useWeb3();
//   const { authenticated } = usePrivy();
//   const [sidebarOpen, setSidebarOpen] = React.useState(true);

//   // Show landing if not connected via either method
//   if (!account && !authenticated) {
//     return <LandingPage />;
//   }

//   // Show loading while connecting
//   if (loading || (authenticated && !account)) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-900">
//         <div className="text-center">
//           <div className="loading-spinner mb-4"></div>
//           <p className="text-white">Connecting wallet...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show main app if connected (either MetaMask or Privy)
//   return (
//     <Router>
//       <div className="app-container">
//         <Navbar />
//         <div className="flex">
//           <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
//           <main 
//             className={`flex-1 p-6 transition-all duration-300 ${
//               sidebarOpen ? 'ml-64' : 'ml-0'
//             }`}
//           >
//             <div className="max-w-7xl mx-auto">
//               <Routes>
//                 <Route path="/" element={<Navigate to="/dashboard" replace />} />
//                 <Route path="/dashboard" element={<TokenDashboard />} />
//                 <Route path="/mint" element={<MintToken />} />
//                 <Route path="/transfer" element={<TransferToken />} />
//                 <Route path="/nft-dashboard" element={<NFTDashboard />} />
//                 <Route path="/create-nft" element={<CreateNFT />} />
//                 <Route path="/marketplace" element={<NFTMarketplace />} />
//                 <Route path="/my-nfts" element={<MyNFTs />} />
//               </Routes>
//             </div>
//           </main>
//         </div>
//       </div>
//     </Router>
//   );
// }

// function App() {
//   return <AppContent />;
// }

// export default App; 

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useWeb3 } from './contexts/Web3Context';
import { usePrivy } from '@privy-io/react-auth';
import './App.css';

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

function AppContent() {
  const { account, loading } = useWeb3();
  const { authenticated, ready } = usePrivy();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Show landing if not connected via either method
  if (!account && !authenticated) {
    return <LandingPage />;
  }

  // Show loading while Privy is initializing or connecting wallet
  if (!ready || (loading && !account)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-white">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  // If authenticated but no account yet, still loading
  if (authenticated && !account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-white">Setting up your wallet...</p>
        </div>
      </div>
    );
  }

  // Show main app if connected (either MetaMask or Privy)
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

function App() {
  return <AppContent />;
}

export default App;