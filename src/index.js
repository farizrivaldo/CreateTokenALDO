// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.css';
// import { Web3Provider } from './contexts/Web3Context';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Web3Provider>
//       <App />
//     </Web3Provider>
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
      }}
    >
      <Web3Provider>
        <App />
      </Web3Provider>
    </PrivyProvider>
  </React.StrictMode>
);