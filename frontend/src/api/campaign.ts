import { ethers } from "ethers";

import { fetcher } from "../utils";

export const createCampaign = async (
  title: string,
  description: string,
  goal: string
): Promise<ethers.ContractTransactionResponse | ResponseError> => {
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

    return ctxRes;
  };

  const response = <ethers.ContractTransactionResponse | ResponseError>(
    await fetcher(_createCampaign)
  );
  return response;
};

export const getAllCampaign = async (): Promise<Campaign[]> => {
  const _getAllCampaign = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const res = await contract.getAllCampaigns();

    const campaigns: Campaign[] = res.map((campaign: any) => {
      const [
        id,
        creator,
        title,
        description,
        goal,
        raised,
        isActive,
        contributions,
        createdAt,
        deadline,
      ] = campaign;

      return {
        id,
        creator,
        title,
        description,
        goal,
        raised,
        isActive,
        contributions: contributions.map((contribution: any) => ({
          amount: contribution.amount,
          contributor: contribution.contributor,
          campaignId: contribution.campaignId,
          timestamp: contribution.timestamp.toString(),
        })),
        createdAt: createdAt.toString(),
        deadline: deadline.toString(),
      };
    });

    return campaigns;
  };

  const response = <Campaign[]>await fetcher(_getAllCampaign);
  return response;
};

export const getCampaign = async (campaignId: bigint): Promise<Campaign> => {
  const _getCampaign = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const res = await contract.getCampaign(campaignId);

    const [
      id,
      creator,
      title,
      description,
      goal,
      raised,
      isActive,
      contributions,
      createdAt,
      deadline,
    ] = res;

    const campaign: Campaign = {
      id,
      creator,
      title,
      description,
      goal,
      raised,
      isActive,
      contributions: contributions.map((contribution: any) => ({
        amount: contribution.amount,
        contributor: contribution.contributor,
        campaignId: contribution.campaignId,
        timestamp: contribution.timestamp.toString(),
      })),
      createdAt: createdAt.toString(),
      deadline: deadline.toString(),
    };

    return campaign;
  };

  const response = <Campaign>await fetcher(_getCampaign);
  return response;
};

export const contributeToCampaign = async (
  campaignId: bigint,
  ether: string
): Promise<ethers.ContractTransactionResponse | ResponseError> => {
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

  const response = <ethers.ContractTransactionResponse | ResponseError>(
    await fetcher(_contributeToCampaign)
  );
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

export const withdrawContributions = async (
  campaignId: bigint
): Promise<ethers.ContractTransactionResponse | ResponseError> => {
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

  const response = <ethers.ContractTransactionResponse | ResponseError>(
    await fetcher(_withdrawContributions)
  );
  return response;
};

export const inActivateCampaign = async (
  campaignId: bigint
): Promise<ethers.ContractTransactionResponse | ResponseError> => {
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

  const response = <ethers.ContractTransactionResponse | ResponseError>(
    await fetcher(_inActivateCampaign)
  );
  return response;
};

export const refundContributions = async (
  campaignId: bigint
): Promise<ethers.ContractTransactionResponse | ResponseError> => {
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

    return ctxRes;
  };

  const response = <ethers.ContractTransactionResponse | ResponseError>(
    await fetcher(_refundContributions)
  );
  return response;
};
