import { ethers } from "ethers";

import { fetcher } from "../utils";

export const createCampaign = async (
  title: string,
  description: string,
  goal: number
) => {
  const _createCampaign = async (
    _: ethers.Provider,
    signer: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const contractAddress = await contract.getAddress();

    const data = contract.interface.encodeFunctionData("createCampaign", [
      title,
      description,
      goal,
    ]);

    const tx = new ethers.Transaction();
    tx.to = contractAddress;
    tx.data = data;
    tx.value = ethers.parseEther("0");

    const populatedTx = await signer.populateTransaction(tx);
    const txRes = await signer.sendTransaction(populatedTx);

    const receipt = txRes.wait();

    return receipt;
  };

  const response = await fetcher(_createCampaign);
  return response;
};

export const getAllCampaign = async () => {
  const _getAllCampaign = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const filter = contract.filters.CampaignCreated();
    const events = await contract.queryFilter(filter, 0, "latest");

    const campaigns = events.map((event) => {
      const _event = event as ethers.EventLog;

      return {
        campaignId: _event.args.campaignId,
        creator: _event.args.creator,
        title: _event.args.title,
        goal: _event.args.goal,
      };
    });

    return {
      campaigns,
    };
  };

  const response = await fetcher(_getAllCampaign);
  return response;
};

export const getCampaign = async (campaignId: string) => {
  const _getCampaign = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const campaign = await contract.getCampaign(campaignId);

    return {
      campaign,
    };
  };

  const response = await fetcher(_getCampaign);
  return response;
};

export const contributeToCampaign = async (
  campaignId: string,
  ether: string
) => {
  const _contributeToCampaign = async (
    _: ethers.Provider,
    signer: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const contractAddress = await contract.getAddress();

    const data = contract.interface.encodeFunctionData("fundCampaign", [
      campaignId,
    ]);

    const tx = new ethers.Transaction();
    tx.to = contractAddress;
    tx.data = data;
    tx.value = ethers.parseEther(ether);

    const populatedTx = await signer.populateTransaction(tx);

    const txRes = await signer.sendTransaction(populatedTx);

    const receipt = await txRes.wait();
    return receipt;
  };

  const response = await fetcher(_contributeToCampaign);
  return response;
};

export const getCampaignContributions = async (campaignId: string) => {
  const _getCampaignContributions = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const filter = contract.filters.Funded(campaignId);
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

  const response = await fetcher(_getCampaignContributions);
  return response;
};

export const withdrawContributions = async (campaignId: string) => {
  const _withdrawContributions = async (
    _: ethers.Provider,
    signer: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const contractAddress = await contract.getAddress();

    const data = contract.interface.encodeFunctionData("withdrawFunds", [
      campaignId,
    ]);

    const tx = new ethers.Transaction();
    tx.to = contractAddress;
    tx.data = data;
    tx.value = ethers.parseEther("0");

    const populatedTx = await signer.populateTransaction(tx);

    const txRes = await signer.sendTransaction(populatedTx);

    const receipt = await txRes.wait();
    return receipt;
  };

  const response = await fetcher(_withdrawContributions);
  return response;
};

export const refundContribution = async (campaignId: string) => {
  const _refundContribution = async (
    _: ethers.Provider,
    signer: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const contractAddress = await contract.getAddress();

    const data = contract.interface.encodeFunctionData("refundContributions", [
      campaignId,
    ]);

    const tx = new ethers.Transaction();
    tx.to = contractAddress;
    tx.data = data;
    tx.value = ethers.parseEther("0");

    const populatedTx = await signer.populateTransaction(tx);

    const txRes = await signer.sendTransaction(populatedTx);

    const receipt = await txRes.wait();
    return receipt;
  };

  const response = await fetcher(_refundContribution);
  return response;
};

export const getCampaignStats = async (campaignId: string) => {
  const _getCampaignStats = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const campaign = await contract.getCampaign(campaignId);

    const filter = contract.filters.Funded(campaignId);
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
      campaign,
      contributions,
    };
  };

  const response = await fetcher(_getCampaignStats);
  return response;
};
