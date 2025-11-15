// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { CONTRACTS, TOKEN_ABI, MARKETPLACE_ABI } from '../utils/contracts';

// const Web3Context = createContext();
// export const useWeb3 = () => useContext(Web3Context);

// export const Web3Provider = ({ children }) => {
//   const [account, setAccount] = useState(null);
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [tokenContract, setTokenContract] = useState(null);
//   const [marketplaceContract, setMarketplaceContract] = useState(null);
//   const [balance, setBalance] = useState('0');
//   const [tokenBalance, setTokenBalance] = useState('0');
//   const [isOwner, setIsOwner] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [network, setNetwork] = useState(null);

//   // -------------------------------
//   // AUTO CONNECT jika user sudah pernah connect di browser
//   // -------------------------------
//   useEffect(() => {
//     if (window.ethereum) {
//       const checkPreviouslyConnected = async () => {
//         const acc = await window.ethereum.request({ method: "eth_accounts" });
//         if (acc.length > 0) {
//           connectWallet(false); // silent mode
//         }
//       };
//       checkPreviouslyConnected();
//     }
//   }, []);

//   // -------------------------------
//   // LISTENER hanya dipasang SEKALI
//   // -------------------------------
//   useEffect(() => {
//     if (!window.ethereum) return;

//     const handleAccountsChanged = (accounts) => {
//       if (accounts.length === 0) {
//         disconnectWallet(false);
//       } else {
//         setAccount(accounts[0]);
//       }
//     };

//     const handleChainChanged = async () => {
//       setNetwork(await provider?.getNetwork());
//       // tidak reload! cukup update state
//     };

//     window.ethereum.on('accountsChanged', handleAccountsChanged);
//     window.ethereum.on('chainChanged', handleChainChanged);

//     return () => {
//       if (!window.ethereum) return;
//       window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//       window.ethereum.removeListener('chainChanged', handleChainChanged);
//     };
//   }, [provider]);

//   // -------------------------------
//   // KONEKSI WALLET
//   // -------------------------------
//   const connectWallet = async (showAlert = true) => {
//     try {
//       setLoading(true);

//       if (!window.ethereum) {
//         alert("Install MetaMask dulu!");
//         return;
//       }

//       const provider = new ethers.providers.Web3Provider(window.ethereum);

//       // request account
//       const accounts = await provider.send("eth_requestAccounts", []);
//       const signer = provider.getSigner();
//       const net = await provider.getNetwork();

//       // ----------- Auto switch ke Sepolia ----------
//       if (net.chainId !== 11155111) {
//         if (showAlert) alert("Switch ke Sepolia dulu!");

//         try {
//           await window.ethereum.request({
//             method: "wallet_switchEthereumChain",
//             params: [{ chainId: "0xaa36a7" }],
//           });

//           // setelah switch, refresh network state (tanpa reload)
//           const newNet = await provider.getNetwork();
//           setNetwork(newNet);
//         } catch (err) {
//           console.error(err);
//           return;
//         }
//       } else {
//         setNetwork(net);
//       }

//       const token = new ethers.Contract(CONTRACTS.TOKEN_ADDRESS, TOKEN_ABI, signer);
//       const market = new ethers.Contract(CONTRACTS.MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);

//       setProvider(provider);
//       setSigner(signer);
//       setAccount(accounts[0]);
//       setTokenContract(token);
//       setMarketplaceContract(market);

//     } catch (err) {
//       console.error("Connect error:", err);
//       if (showAlert) alert("Gagal connect wallet.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------------
//   // DISCONNECT
//   // -------------------------------
//   const disconnectWallet = (reload = true) => {
//     setAccount(null);
//     setProvider(null);
//     setSigner(null);
//     setTokenContract(null);
//     setMarketplaceContract(null);
//     setBalance("0");
//     setTokenBalance("0");
//     setIsOwner(false);

//     // hindari reload karena bikin MetaMask error
//     if (reload) console.log("Disconnected.");
//   };

//   // -------------------------------
//   // LOAD BALANCE
//   // -------------------------------
//   const loadBalances = async () => {
//     try {
//       if (!provider || !account) return;

//       const ethBal = await provider.getBalance(account);
//       setBalance(ethers.utils.formatEther(ethBal));

//       if (tokenContract) {
//         const tokenBal = await tokenContract.balanceOf(account);
//         setTokenBalance(ethers.utils.formatEther(tokenBal));
//       }
//     } catch (e) {
//       console.error("Bal error:", e);
//     }
//   };

//   // -------------------------------
//   // CHECK OWNER
//   // -------------------------------
//   useEffect(() => {
//     const checkOwner = async () => {
//       if (!tokenContract || !account) return;
//       const owner = await tokenContract.owner();
//       setIsOwner(owner.toLowerCase() === account.toLowerCase());
//     };

//     if (tokenContract) checkOwner();
//   }, [tokenContract, account]);

//   // -------------------------------
//   // ADD TOKEN
//   // -------------------------------
//   const addTokenToMetaMask = async () => {
//     try {
//       if (!window.ethereum) return alert("Install MetaMask!");

//       const wasAdded = await window.ethereum.request({
//         method: "wallet_watchAsset",
//         params: {
//           type: "ERC20",
//           options: {
//             address: CONTRACTS.TOKEN_ADDRESS,
//             symbol: "ALDO",
//             decimals: 18,
//             image: "https://pbs.twimg.com/profile_images/1886608481337413632/a8dXewuF_400x400.jpg",
//           },
//         },
//       });

//       if (wasAdded) alert("ALDO token added!");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <Web3Context.Provider
//       value={{
//         account,
//         provider,
//         signer,
//         tokenContract,
//         marketplaceContract,
//         balance,
//         tokenBalance,
//         isOwner,
//         loading,
//         network,
//         connectWallet,
//         disconnectWallet,
//         loadBalances,
//         addTokenToMetaMask,
//       }}
//     >
//       {children}
//     </Web3Context.Provider>
//   );
// };
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';




import { CONTRACTS, TOKEN_ABI, MARKETPLACE_ABI } from '../utils/contracts';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [balance, setBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(null);


  useEffect(() => {
    if (account && tokenContract) {
      loadBalances();
      checkOwner();
    }
  }, [account, tokenContract]);

    

  const connectWallet = async () => {
    try {
      setLoading(true);
      
      if (!window.ethereum) {
        alert('Please install MetaMask! Visit https://metamask.io/');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();

      // Check if on Sepolia
      if (network.chainId !== 11155111) {
        alert('Please switch to Sepolia testnet in MetaMask!');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
          });
          window.location.reload();
        } catch (error) {
          console.error('Failed to switch network:', error);
        }
        return;
      }

      const tokenContract = new ethers.Contract(
        CONTRACTS.TOKEN_ADDRESS,
        TOKEN_ABI,
        signer
      );

  
      
      
      const marketplaceContract = new ethers.Contract(
        CONTRACTS.MARKETPLACE_ADDRESS,
        MARKETPLACE_ABI,
        signer
      );

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setTokenContract(tokenContract);
      setMarketplaceContract(marketplaceContract);
      setNetwork(network);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          window.location.reload();
        } else {
          disconnectWallet();
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setTokenContract(null);
    setMarketplaceContract(null);
    setBalance('0');
    setTokenBalance('0');
    setIsOwner(false);
    window.location.reload();
  };

 

  const loadBalances = async () => {
    try {
      if (!provider || !account || !tokenContract) return;

      // Get ETH balance
      const ethBalance = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(ethBalance));

      // Get ALDO token balance
      const tokenBal = await tokenContract.balanceOf(account);
      setTokenBalance(ethers.utils.formatEther(tokenBal));
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  const checkOwner = async () => {
    try {
      if (!tokenContract || !account) return;
      const owner = await tokenContract.owner();
      setIsOwner(owner.toLowerCase() === account.toLowerCase());
    } catch (error) {
      console.error('Error checking owner:', error);
    }
  };

   const addTokenToMetaMask = async () => {
      try {
        if (!window.ethereum) {
          alert('MetaMask not installed!');
          return false;
        }
  
        const tokenAddress = CONTRACTS.TOKEN_ADDRESS;
        const tokenSymbol = 'ALDO';
        const tokenDecimals = 18;
        const tokenImage = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'; // Optional: ganti dengan logo kamu
  
        const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image: tokenImage,
            },
          },
        });
  
        if (wasAdded) {
          alert('✅ ALDO Token added to MetaMask!');
          return true;
        } else {
          alert('❌ Failed to add token');
          return false;
        }
      } catch (error) {
        console.error('Error adding token:', error);
        alert('Error: ' + error.message);
        return false;
      }
    };
      
useEffect(() => {
  if (!tokenContract || !account) return;

  const onTransfer = (from, to, value, event) => {
    if (from.toLowerCase() === account.toLowerCase() || to.toLowerCase() === account.toLowerCase()) {
      console.log("Transfer detected!");
      console.log("From:", from);
      console.log("To:", to);
      console.log("Amount:", ethers.utils.formatEther(value)); // 18 decimals
    }
  };

  tokenContract.on("Transfer", onTransfer);

  return () => {
    tokenContract.off("Transfer", onTransfer);
  };
}, [tokenContract, account]);



  const value = {
    account,
    provider,
    signer,
    tokenContract,
    marketplaceContract,
    balance,
    tokenBalance,
    isOwner,
    loading,
    network,
    connectWallet,
    disconnectWallet,
    loadBalances,
    addTokenToMetaMask
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};