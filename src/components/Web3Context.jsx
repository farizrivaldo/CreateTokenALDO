import React, { createContext, useContext, useState } from 'react';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import { CONTRACTS, TOKEN_ABI, MARKETPLACE_ABI } from '../utils/contracts';

const Web3Context = createContext();
export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Install MetaMask");
        return;
      }

      // FORCE use MetaMask provider only
const eth = window.ethereum?.providers
  ? window.ethereum.providers.find(p => p.isMetaMask)
  : window.ethereum;

if (!eth) {
  alert("MetaMask not found.");
  return;
}

      const accounts = await eth.request({ method: "eth_requestAccounts" });
      const chainId = parseInt(await eth.request({ method: "eth_chainId" }), 16);

      if (chainId !== 11155111) {
        alert("Switch to Sepolia");
        await eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }]
        });
        return;
      }

      const provider = new BrowserProvider(eth);
      const signer = await provider.getSigner();

      const token = new Contract(CONTRACTS.TOKEN_ADDRESS, TOKEN_ABI, signer);
      const marketplace = new Contract(CONTRACTS.MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);

      console.log("Connected:", accounts[0]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <Web3Context.Provider value={{ account, provider, signer, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
