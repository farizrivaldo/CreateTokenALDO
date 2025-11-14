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
    loadBalances
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};