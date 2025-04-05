import { ContractTransactionResponse, ethers } from "ethers";

import { fetcher } from "../utils";

export const registerUser = async (
  name: string
): Promise<ContractTransactionResponse | ResponseError> => {
  const _registerUser = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    try {
      await contract.registerUser.staticCall(name);
    } catch (error: unknown) {
      console.error(error);

      return {
        error: {
          // @ts-expect-error - error is unknown
          message: error?.reason ?? "Something went wrong",
        },
      };
    }

    const ctxRes = await contract.registerUser.send(name);

    return ctxRes;
  };

  const response = <ContractTransactionResponse | ResponseError>(
    await fetcher(_registerUser)
  );
  return response;
};

export const getUser = async (address: string): Promise<User> => {
  const _getUser = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const res = await contract.getUserData(address);

    const [name, , isRegistered] = res;
    const user = {
      name,
      address,
      isRegistered,
    };

    return user;
  };

  const response = <User>await fetcher(_getUser);
  return response;
};

export const getAllUser = async (): Promise<User[]> => {
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

  const response = <User[]>await fetcher(_getAllUser);
  return response;
};

export const getUserContributions = async (
  address: string
): Promise<Contributions[]> => {
  const _getUserContributions = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ): Promise<Contributions[]> => {
    const filter = contract.filters.Funded(null, address);
    const events = await contract.queryFilter(filter, 0, "latest");

    const contributions = events.map((event) => {
      const _event = event as ethers.EventLog;

      return {
        campaignId: _event.args.campaignId,
        contributor: _event.args.funder,
        amount: _event.args.amount,
        timestamp: _event.args.timestamp,
      };
    });

    return contributions;
  };

  const response = <Contributions[]>await fetcher(_getUserContributions);
  return response;
};

export const getUserCampaigns = async (
  address: string
): Promise<Campaign[]> => {
  const _getUserCampaigns = async (
    _: ethers.Provider,
    __: ethers.Signer,
    contract: ethers.Contract
  ) => {
    const filter = contract.filters.CampaignCreated(null, address);

    const events = await contract.queryFilter(filter, 0, "latest");

    const campaignIds = events.map((event) => {
      const _event = event as ethers.EventLog;

      return _event.args.campaignId;
    });

    const campaigns = await Promise.all(
      campaignIds.map(async (campaignId) => {
        const campaign = await contract.getCampaign(campaignId);

        return {
          id: campaignId,
          creator: address,
          title: campaign.title,
          description: campaign.description,
          goal: campaign.goal,
          raised: campaign.raised,
          isActive: campaign.isActive,
          contributions: [],
          createdAt: campaign.createdAt,
          deadline: campaign.deadline,
        };
      })
    );

    return campaigns;
  };
  const response = <Campaign[]>await fetcher(_getUserCampaigns);
  return response;
};
