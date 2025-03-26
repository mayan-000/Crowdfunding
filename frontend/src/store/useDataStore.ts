import { ethers } from "ethers";
import { create } from "zustand";
import { toast } from "react-toastify";

import { getProvider, getContract } from "../utils";
import { Campaign } from "../components/CampaignComponent";
import { getAllCampaign } from "../api/campaign";

interface Transaction {
  type: "campaign" | "user";
  key: string;
}

interface DataStore {
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  campaigns: Campaign[];
  latestTransaction: Transaction | null;
  setProvider: (provider: ethers.Provider) => void;
  setSigner: (signer: ethers.Signer) => void;
  setContract: (contract: ethers.Contract) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  setLatestTransaction: (transaction: Transaction) => void;
  initialize: () => Promise<(() => void) | void>;
}

export const useDataStore = create<DataStore>((set) => ({
  provider: null,
  signer: null,
  contract: null,
  campaigns: [],
  latestTransaction: null,
  setProvider: (provider) => set({ provider }),
  setSigner: (signer) => set({ signer }),
  setContract: (contract) => set({ contract }),
  setCampaigns: (campaigns) => set({ campaigns }),
  setLatestTransaction: (transaction) =>
    set({ latestTransaction: transaction }),
  initialize: async () => {
    const provider = await getProvider();
    const signer = await provider?.getSigner();

    if (!signer) {
      alert("Please connect your wallet");
      return;
    }

    const contract = getContract(signer);

    if (!contract) {
      alert("Contract not found");
      return;
    }

    set({ provider, signer, contract });

    const filter = contract.filters.CampaignCreated();
    const listener = (...args: any) => {
      const [campaignId, creator, , title, goal] = args[0].args;

      set((state) => {
        const campaign = {
          campaignId,
          creator,
          title,
          goal: goal,
        };

        const lastCampaign = state.campaigns[state.campaigns.length - 1];
        if (lastCampaign && lastCampaign.campaignId === campaign.campaignId) {
          return state;
        }


        toast("Campaign created successfully");

        return { campaigns: [...state.campaigns, campaign] };
      });
    };

    contract.on(filter, listener);

    const res = await getAllCampaign();
    if (res.error) {
      toast(res.error.message);
      return;
    }

    set({ campaigns: res.campaigns });

    return () => {
      contract.off(filter, listener);
    };
  },
}));
