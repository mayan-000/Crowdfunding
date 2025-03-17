import { ethers } from "ethers";

import { abi } from "../../../blockchain/artifacts/contracts/Crowdfunding.sol/Crowdfunding.json";

export const getProvider = async () => {
  if (!window.ethereum) {
    alert("MetaMask not detected!");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  return provider;
};

export const getContract = (signer: ethers.JsonRpcSigner) => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
	console.log(contractAddress)

  const contract = new ethers.Contract(contractAddress, abi, signer);

  return contract;
};
