import { ethers } from "ethers";

import { fetcher } from "../utils";

export const registerUser = async (name: string) => {
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

    return {
      user,
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
      contributions,
    };
  };

  const response = await fetcher(_getUserContributions);
  return response;
};
