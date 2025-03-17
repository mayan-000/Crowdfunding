import { ethers } from "ethers";

import { fetcher } from "../utils";

export const registerUser = async (name: string) => {
  const _registerUser = async (
    _: ethers.Provider,
    signer: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const data = contract.interface.encodeFunctionData("registerUser", [name]);
    const contractAddress = await contract.getAddress();

    const tx = new ethers.Transaction();
    tx.to = contractAddress;
    tx.data = data;
    tx.value = ethers.parseEther("0");

    const populatedTx = await signer.populateTransaction(tx);
    const txRes = await signer.sendTransaction(populatedTx);

    const receipt = await txRes.wait();

    return receipt;
  };

  const response = await fetcher(_registerUser);
  return response;
};

export const getUser = async (address: string) => {
  const _getUser = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const user = await contract.getUserData(address);
    const filter = contract.filters.Funded(null, address);
    const events = await contract.queryFilter(filter, 0, "latest");

    const contributions = events.map((event) => {
      const _event = event as ethers.EventLog;

      return {
        campaignId: _event.args.campaignId,
        funder: _event.args.funder,
        amount: _event.args.amount,
      };
    });

    return {
      user,
      contributions,
    };
  };

  const response = await fetcher(_getUser);
  return response;
};

export const getAllUser = async () => {
  const _getAllUser = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const users = await contract.getAllUser();

    return {
      users,
    };
  };

  const response = await fetcher(_getAllUser);
  return response;
};

export const getUserContributions = async (address: string) => {
  const _getUserContributions = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const filter = contract.filters.Funder(null, address);
    const events = await contract.queryFilter(filter, 0, "latest");

    const contributions = events.map((event) => {
      const _event = event as ethers.EventLog;

      return {
        campaignId: _event.args.campaignId,
        funder: _event.args.funder,
        amount: _event.args.amount,
      };
    });

    return {
      contributions,
    };
  };

  const response = await fetcher(_getUserContributions);
  return response;
};
