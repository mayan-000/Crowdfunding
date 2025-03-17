import { BrowserProvider, JsonRpcSigner, Contract } from "ethers";

import { getContract, getProvider } from "./blockchain";

export const fetcher = async (
  callback: (
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    contract: Contract
  ) => Promise<unknown>
) => {
  try {
    const provider = await getProvider();
    if (!provider) {
      throw new Error("Provider not found!");
    }

    const signer = await provider?.getSigner();
    if (!signer) {
      throw new Error("Signer not found!");
    }

    const contract = getContract(signer);
    const response = await callback(provider, signer, contract);
		return response;
  } catch (error) {
    console.log(error);
  }
};
