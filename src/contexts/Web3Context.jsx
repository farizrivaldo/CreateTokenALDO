// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { usePrivy, useWallets } from '@privy-io/react-auth';
// import { CONTRACTS, TOKEN_ABI, MARKETPLACE_ABI } from '../utils/contracts.jsx';

// const Web3Context = createContext();

// export const useWeb3 = () => {
//   const context = useContext(Web3Context);
//   if (!context) {
//     throw new Error('useWeb3 must be used within Web3Provider');
//   }
//   return context;
// };

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

//   // Privy hooks
//   const { authenticated, ready, user } = usePrivy();
//   const { wallets } = useWallets();

//   // Check if using AA mode (Privy without MetaMask)
//   const isAAMode = authenticated && ready && account && !window.ethereum?.selectedAddress;

//   // Load balances when account or tokenContract changes
//   useEffect(() => {
//     console.log('Account:', account);
//     if (account && tokenContract) {
//       loadBalances();
//       checkOwner();
//     }
//   }, [account, tokenContract]);

//   // MetaMask connection
//   const connectWallet = async () => {
//     try {
//       setLoading(true);
      
//       if (!window.ethereum) {
//         alert('Please install MetaMask! Visit https://metamask.io/');
//         return;
//       }

//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const accounts = await provider.send("eth_requestAccounts", []);
//       const signer = provider.getSigner();
//       console.log('Signer:', signer);
      
//       const network = await provider.getNetwork();
//       console.log('Network:', network);
      
//       // Check if on Sepolia
//       if (network.chainId !== 11155111) {
//         alert('Please switch to Sepolia testnet in MetaMask!');
//         try {
//           await window.ethereum.request({
//             method: 'wallet_switchEthereumChain',
//             params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
//           });
//           window.location.reload();
//         } catch (error) {
//           console.error('Failed to switch network:', error);
//         }
//         return;
//       }

//       const tokenContract = new ethers.Contract(
//         CONTRACTS.TOKEN_ADDRESS,
//         TOKEN_ABI,
//         signer
//       );
      
//       const marketplaceContract = new ethers.Contract(
//         CONTRACTS.MARKETPLACE_ADDRESS,
//         MARKETPLACE_ABI,
//         signer
//       );

//       setProvider(provider);
//       setSigner(signer);
//       setAccount(accounts[0]);
//       setTokenContract(tokenContract);
//       setMarketplaceContract(marketplaceContract);
//       setNetwork(network);

//       // Listen for account changes
//       window.ethereum.on('accountsChanged', (accounts) => {
//         if (accounts.length > 0) {
//           setAccount(accounts[0]);
//           window.location.reload();
//         } else {
//           disconnectWallet();
//         }
//       });

//       // Listen for chain changes
//       window.ethereum.on('chainChanged', () => {
//         window.location.reload();
//       });

//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//       alert('Failed to connect wallet. Check console for details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disconnectWallet = () => {
//     setAccount(null);
//     setProvider(null);
//     setSigner(null);
//     setTokenContract(null);
//     setMarketplaceContract(null);
//     setBalance('0');
//     setTokenBalance('0');
//     setIsOwner(false);
//     window.location.reload();
//   };

//   const loadBalances = async () => {
//     try {
//       if (!provider || !account || !tokenContract) return;

//       // Get ETH balance
//       const ethBalance = await provider.getBalance(account);
//       setBalance(ethers.utils.formatEther(ethBalance));

//       // Get ALDO token balance
//       const tokenBal = await tokenContract.balanceOf(account);
//       setTokenBalance(ethers.utils.formatEther(tokenBal));
//     } catch (error) {
//       console.error('Error loading balances:', error);
//     }
//   };

//   const checkOwner = async () => {
//     try {
//       if (!tokenContract || !account) return;
//       const owner = await tokenContract.owner();
//       setIsOwner(owner.toLowerCase() === account.toLowerCase());
//     } catch (error) {
//       console.error('Error checking owner:', error);
//     }
//   };

//   const addTokenToMetaMask = async () => {
//     try {
//       if (!window.ethereum) {
//         alert('MetaMask not installed!');
//         return false;
//       }

//       const tokenAddress = CONTRACTS.TOKEN_ADDRESS;
//       const tokenSymbol = 'ALDO';
//       const tokenDecimals = 18;
//       const tokenImage = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';

//       const wasAdded = await window.ethereum.request({
//         method: 'wallet_watchAsset',
//         params: {
//           type: 'ERC20',
//           options: {
//             address: tokenAddress,
//             symbol: tokenSymbol,
//             decimals: tokenDecimals,
//             image: tokenImage,
//           },
//         },
//       });

//       if (wasAdded) {
//         alert('✅ ALDO Token added to MetaMask!');
//         return true;
//       } else {
//         alert('❌ Failed to add token');
//         return false;
//       }
//     } catch (error) {
//       console.error('Error adding token:', error);
//       alert('Error: ' + error.message);
//       return false;
//     }
//   };

//   // Setup Privy wallet if in AA mode
//   useEffect(() => {
//     const setupPrivyWallet = async () => {
//       // Only run if authenticated, ready, and don't have MetaMask account
//       if (authenticated && ready && wallets && wallets.length > 0 && !account) {
//         try {
//           const embeddedWallet = wallets.find(
//             wallet => wallet.walletClientType === 'privy'
//           );

//           if (embeddedWallet) {
//             setLoading(true);

//             // Get Ethereum provider using Privy's method
//             const ethereum = await embeddedWallet.getEthereumProvider();
            
//             // FORCE SWITCH TO SEPOLIA
//             try {
//               await ethereum.request({
//                 method: 'wallet_switchEthereumChain',
//                 params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
//               });
//               console.log('✅ Switched to Sepolia network');
//             } catch (switchError) {
//               // If network doesn't exist, add it
//               if (switchError.code === 4902) {
//                 await ethereum.request({
//                   method: 'wallet_addEthereumChain',
//                   params: [{
//                     chainId: '0xaa36a7',
//                     chainName: 'Sepolia Testnet',
//                     nativeCurrency: {
//                       name: 'Sepolia ETH',
//                       symbol: 'SEP',
//                       decimals: 18
//                     },
//                     rpcUrls: ['https://rpc.sepolia.org'],
//                     blockExplorerUrls: ['https://sepolia.etherscan.io']
//                   }]
//                 });
//                 console.log('✅ Sepolia network added');
//               } else {
//                 throw switchError;
//               }
//             }

//             const privyProvider = new ethers.providers.Web3Provider(ethereum);
//             const privySigner = privyProvider.getSigner();
//             const network = await privyProvider.getNetwork();
        
//             console.log('Network detected:', network.chainId);

//             // Check if on Sepolia
//             if (network.chainId !== 11155111) {
//               alert('⚠️ Failed to switch to Sepolia. Please try again.');
//               setLoading(false);
//               return;
//             }

//             // Setup contracts with Privy signer
//             const tokenContract = new ethers.Contract(
//               CONTRACTS.TOKEN_ADDRESS,
//               TOKEN_ABI,
//               privySigner
//             );
            
//             console.log('============================================================');
//             console.log('Token Contract Address:', tokenContract.address);
//             console.log('============================================================');
            
//             const marketplaceContract = new ethers.Contract(
//               CONTRACTS.MARKETPLACE_ADDRESS,
//               MARKETPLACE_ABI,
//               privySigner
//             );

//             setProvider(privyProvider);
//             setSigner(privySigner);
//             setAccount(embeddedWallet.address);
//             setTokenContract(tokenContract);
//             setMarketplaceContract(marketplaceContract);
//             setNetwork(network);

//             console.log('✅ Privy wallet connected:', embeddedWallet.address);
//             setLoading(false);
//           }
//         } catch (error) {
//           console.error('Error setting up Privy wallet:', error);
//           alert('Failed to setup Privy wallet. Please try again.');
//           setLoading(false);
//         }
//       }
//     };

//     setupPrivyWallet();
//   }, [authenticated, ready, wallets, account]);

//   // Listen for Transfer events
//   useEffect(() => {
//     if (!tokenContract || !account) return;

//     const onTransfer = (from, to, value, event) => {
//       if (from.toLowerCase() === account.toLowerCase() || to.toLowerCase() === account.toLowerCase()) {
//         console.log("Transfer detected!");
//         console.log("From:", from);
//         console.log("To:", to);
//         console.log("Amount:", ethers.utils.formatEther(value));
//         // Reload balances after transfer
//         loadBalances();
//       }
//     };

//     tokenContract.on("Transfer", onTransfer);

//     return () => {
//       tokenContract.off("Transfer", onTransfer);
//     };
//   }, [tokenContract, account]);

//   const value = {
//     account,
//     provider,
//     signer,
//     tokenContract,
//     marketplaceContract,
//     balance,
//     tokenBalance,
//     isOwner,
//     loading,
//     network,
//     connectWallet,
//     disconnectWallet,
//     loadBalances,
//     addTokenToMetaMask,
//     isAAMode, // Flag to indicate if using AA mode
//     user, // Privy user info for AA mode
//   };

//   return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { CONTRACTS, TOKEN_ABI, MARKETPLACE_ABI, ECOSYSTEM_ABI } from '../utils/contracts';

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
  const [ecosystemContract, setEcosystemContract] = useState(null); // NEW
  const [balance, setBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(null);

  const { authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();

  const isAAMode = authenticated && ready && account && !window.ethereum?.selectedAddress;

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
      
      if (network.chainId !== 11155111) {
        alert('Please switch to Sepolia testnet in MetaMask!');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
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

      const ecosystemContract = new ethers.Contract(
        CONTRACTS.ECOSYSTEM_ADDRESS,
        ECOSYSTEM_ABI,
        signer
      );

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setTokenContract(tokenContract);
      setMarketplaceContract(marketplaceContract);
      setEcosystemContract(ecosystemContract);
      setNetwork(network);

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          window.location.reload();
        } else {
          disconnectWallet();
        }
      });

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
    setEcosystemContract(null);
    setBalance('0');
    setTokenBalance('0');
    setIsOwner(false);
    window.location.reload();
  };

  const loadBalances = async () => {
    try {
      if (!provider || !account || !tokenContract) return;

      const ethBalance = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(ethBalance));

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

      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: CONTRACTS.TOKEN_ADDRESS,
            symbol: 'ALDO',
            decimals: 18,
            image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
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
    const setupPrivyWallet = async () => {
      if (authenticated && ready && wallets && wallets.length > 0 && !account) {
        try {
          const embeddedWallet = wallets.find(
            wallet => wallet.walletClientType === 'privy'
          );

          if (embeddedWallet) {
            setLoading(true);

            const ethereum = await embeddedWallet.getEthereumProvider();
            
            try {
              await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }],
              });
            } catch (switchError) {
              if (switchError.code === 4902) {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0xaa36a7',
                    chainName: 'Sepolia Testnet',
                    nativeCurrency: { name: 'Sepolia ETH', symbol: 'SEP', decimals: 18 },
                    rpcUrls: ['https://rpc.sepolia.org'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io']
                  }]
                });
              } else {
                throw switchError;
              }
            }

            const privyProvider = new ethers.providers.Web3Provider(ethereum);
            const privySigner = privyProvider.getSigner();
            const network = await privyProvider.getNetwork();

            if (network.chainId !== 11155111) {
              alert('⚠️ Failed to switch to Sepolia. Please try again.');
              setLoading(false);
              return;
            }

            const tokenContract = new ethers.Contract(
              CONTRACTS.TOKEN_ADDRESS,
              TOKEN_ABI,
              privySigner
            );
            
            const marketplaceContract = new ethers.Contract(
              CONTRACTS.MARKETPLACE_ADDRESS,
              MARKETPLACE_ABI,
              privySigner
            );

            const ecosystemContract = new ethers.Contract(
              CONTRACTS.ECOSYSTEM_ADDRESS,
              ECOSYSTEM_ABI,
              privySigner
            );

            setProvider(privyProvider);
            setSigner(privySigner);
            setAccount(embeddedWallet.address);
            setTokenContract(tokenContract);
            setMarketplaceContract(marketplaceContract);
            setEcosystemContract(ecosystemContract);
            setNetwork(network);

            console.log('✅ Privy wallet connected:', embeddedWallet.address);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error setting up Privy wallet:', error);
          alert('Failed to setup Privy wallet. Please try again.');
          setLoading(false);
        }
      }
    };

    setupPrivyWallet();
  }, [authenticated, ready, wallets, account]);

  useEffect(() => {
    if (!tokenContract || !account) return;

    const onTransfer = (from, to, value, event) => {
      if (from.toLowerCase() === account.toLowerCase() || to.toLowerCase() === account.toLowerCase()) {
        loadBalances();
      }
    };

    tokenContract.on("Transfer", onTransfer);
    return () => tokenContract.off("Transfer", onTransfer);
  }, [tokenContract, account]);

  const value = {
    account,
    provider,
    signer,
    tokenContract,
    marketplaceContract,
    ecosystemContract, // NEW
    balance,
    tokenBalance,
    isOwner,
    loading,
    network,
    connectWallet,
    disconnectWallet,
    loadBalances,
    addTokenToMetaMask,
    isAAMode,
    user,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};