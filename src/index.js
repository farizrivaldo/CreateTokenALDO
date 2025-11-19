// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { Web3Provider } from './contexts/Web3Context';
// import { PrivyProvider } from '@privy-io/react-auth';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>
//     <PrivyProvider
//       appId="cmi0a8iiq01n3l90cc8m6ajpf"
//       config={{
//         loginMethods: ['email', 'google', 'wallet'],
//         appearance: {
//           theme: 'dark',
//           accentColor: '#6366f1',
//           logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
//         },
//         embeddedWallets: {
//           createOnLogin: 'all-users',
//           requireUserPasswordOnCreate: false,
//           noPromptOnSignature: false,
//         },
//       }}
//     >
//       <Web3Provider>
//         <App />
//       </Web3Provider>
//     </PrivyProvider>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Web3Provider } from './contexts/Web3Context';
import { PrivyProvider } from '@privy-io/react-auth';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <PrivyProvider
      // GANTI INI dengan appId Anda sendiri dari https://dashboard.privy.io
      appId="cmi0a8iiq01n3l90cc8m6ajpf"
      config={{
        loginMethods: ['email', 'google', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#6366f1',
          logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
          requireUserPasswordOnCreate: false,
          noPromptOnSignature: false,
        },
        // TAMBAHKAN INI untuk debugging
        supportedChains: [
          {
            id: 11155111, // Sepolia
            name: 'Sepolia',
            network: 'sepolia',
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'SEP',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://rpc.sepolia.org'],
              },
              public: {
                http: ['https://rpc.sepolia.org'],
              },
            },
            blockExplorers: {
              default: {
                name: 'Etherscan',
                url: 'https://sepolia.etherscan.io',
              },
            },
            testnet: true,
          },
        ],
      }}
    >
      <Web3Provider>
        <App />
      </Web3Provider>
    </PrivyProvider>
  </React.StrictMode>
);