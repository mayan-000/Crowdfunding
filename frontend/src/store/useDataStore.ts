import { ethers } from "ethers";
import { create } from "zustand";
import { toast } from "react-toastify";

import { getProvider, getContract } from "../utils";
import { getAllCampaign } from "../api/campaign";
import { getUser } from "../api";

interface Transaction {
  type: "campaign" | "user";
  key: string;
}

export type Campaign = {
  campaignId: string;
  creator: string;
  title: string;
  goal: string;
};

export type User = {
  name: string;
  address: string;
  isRegistered: boolean;
};

interface DataStore {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
  campaigns: Campaign[];
  user: User | null;
  latestTransaction: Transaction | null;
  isLoggedIn: boolean;
  setProvider: (provider: ethers.BrowserProvider) => void;
  setSigner: (signer: ethers.JsonRpcSigner) => void;
  setContract: (contract: ethers.Contract) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  setLatestTransaction: (transaction: Transaction) => void;
  initialize: () => Promise<(() => void) | void>;
  setLoggedIn: (isLoggedIn: boolean) => void;
  login: () => Promise<boolean>;
  register: (name: string) => Promise<void>;
  logout: () => void;
  attachListeners: () => (() => void) | void;
  getCampaigns: () => Promise<void>;
}

export const useDataStore = create<DataStore>((set, get) => ({
  provider: null,
  signer: null,
  contract: null,
  user: null,
  campaigns: [],
  latestTransaction: null,
  isLoggedIn: false,
  setProvider: (provider) => set({ provider }),
  setSigner: (signer) => set({ signer }),
  setContract: (contract) => set({ contract }),
  setCampaigns: (campaigns) => set({ campaigns }),
  setLatestTransaction: (transaction) =>
    set({ latestTransaction: transaction }),
  initialize: async () => {
    await get().login();

    const signer = get().signer;
    if (!signer) {
      return;
    }

    const contract = getContract(signer);
    if (!contract) {
      alert("Contract not found");
      return;
    }

    set({ contract });

    const cleanup = get().attachListeners();
    get().getCampaigns();

    return cleanup;
  },
  setLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  login: async () => {
    const provider = await getProvider();
    const signer = await provider?.getSigner();

    if (!signer) {
      alert("Please connect your wallet");

      return false;
    }

    set({ provider, signer });

    const address = await signer.getAddress();

    const userData = await getUser(address);
    const [name, , isRegistered] = userData?.user ?? [];

    if (isRegistered) {
      set({ user: { name, address, isRegistered }, isLoggedIn: true });

      return true;
    }

    return false;
  },
  register: async (name: string) => {
    const contract = get().contract;
    const address = await get().signer?.getAddress();

    if (!contract || !address) {
      return;
    }

    const res = await contract.registerUser(name);

    if (res.error) {
      toast(res.error.message);
      return;
    }

    set({ latestTransaction: { type: "user", key: res.hash } });

    const filter = contract.filters.UserRegistered(address);

    const listener = (...args: any) => {
      const name = args[0].args[0];
      const address = args[0].args[1];

      set({ user: { name, address, isRegistered: true }, isLoggedIn: true });

      toast("User registered successfully!");
    };

    contract.once(filter, listener);
  },
  logout: () => {
    set({ user: null, isLoggedIn: false });
  },
  attachListeners: () => {
    const contract = get().contract;

    if (!contract) {
      return;
    }

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

    return () => {
      contract.off(filter, listener);
    };
  },
  getCampaigns: async () => {
    const res = await getAllCampaign();
    if (res.error) {
      toast(res.error.message);
      return;
    }
    set({ campaigns: res.campaigns });
  },
}));
