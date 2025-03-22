import { ethers } from "ethers";

import { fetcher } from "../utils";

export const createCampaign = async (
  title: string,
  description: string,
  goal: number
) => {
  const _createCampaign = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    try {
      await contract.createCampaign.staticCall(
        title,
        description,
        ethers.parseEther(String(goal))
      );
    } catch (error) {
      console.error(error);

      return {
        error: {
          // @ts-expect-error - error is unknown
          message: error?.reason ?? "Something went wrong",
        },
      };
    }

    const ctxRes = await contract.createCampaign.send(
      title,
      description,
      ethers.parseEther(String(goal))
    );
    const ctxReceipt = await ctxRes.wait();

    console.log(ctxReceipt);
    return ctxReceipt;
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
        campaignId: _event.args.getValue("campaignId"),
        creator: _event.args.getValue("creator"),
        title: _event.args.getValue("refTitle"),
        goal: _event.args.getValue("goal"),
      };
    });

    return {
      campaigns,
    };
  };

  const response = await fetcher(_getAllCampaign);
  return response;
};

export const getCampaign = async (campaignId: bigint) => {
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
  campaignId: bigint,
  ether: string
) => {
  const _contributeToCampaign = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    try {
      await contract.fundCampaign.staticCall(campaignId, {
        value: ethers.parseEther(ether),
      });
    } catch (error) {
      console.error(error);

      return {
        error: {
          // @ts-expect-error - error is unknown
          message: error?.reason ?? "Something went wrong",
        },
      };
    }

    const ctxRes = await contract.fundCampaign.send(campaignId, {
      value: ethers.parseEther(ether),
    });

    const ctxReceipt = await ctxRes.wait();

    console.log(ctxReceipt);
    return ctxReceipt;
  };

  const response = await fetcher(_contributeToCampaign);
  return response;
};

export const getCampaignContributions = async (campaignId: bigint) => {
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

export const withdrawContributions = async (campaignId: bigint) => {
  const _withdrawContributions = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    try {
      await contract.withdrawFunds.staticCall(campaignId);
    } catch (error) {
      console.error(error);

      return {
        error: {
          // @ts-expect-error - error is unknown
          message: error?.reason ?? "Something went wrong",
        },
      };
    }

    const ctxRes = await contract.withdrawFunds.send(campaignId);
    const ctxReceipt = await ctxRes.wait();

    console.log(ctxReceipt);
    return ctxReceipt;
  };

  const response = await fetcher(_withdrawContributions);
  return response;
};

export const inActivateCampaign = async (campaignId: bigint) => {
  const _inActivateCampaign = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    try {
      await contract.inActivateCampaign.staticCall(campaignId);
    } catch (error) {
      console.error(error);

      return {
        error: {
          // @ts-expect-error - error is unknown
          message: error?.reason ?? "Something went wrong",
        },
      };
    }

    const ctxRes = await contract.inActivateCampaign.send(campaignId);
    const ctxReceipt = await ctxRes.wait();

    console.log(ctxReceipt);
    return ctxReceipt;
  };

  const response = await fetcher(_inActivateCampaign);
  return response;
};

export const refundContributions = async (campaignId: bigint) => {
  const _refundContributions = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    try {
      await contract.refundContributions.staticCall(campaignId);
    } catch (error) {
      console.error(error);

      return {
        error: {
          // @ts-expect-error - error is unknown
          message: error?.reason ?? "Something went wrong",
        },
      };
    }

    const ctxRes = await contract.refundContributions.send(campaignId);
    const ctxReceipt = await ctxRes.wait();

    console.log(ctxReceipt);
    return ctxReceipt;
  };

  const response = await fetcher(_refundContributions);
  return response;
};
