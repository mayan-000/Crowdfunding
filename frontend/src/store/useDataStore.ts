import { ContractTransactionResponse, ethers, formatEther } from "ethers";
import { create } from "zustand";
import { toast } from "react-toastify";

import { getProvider, getContract } from "../utils";
import { getAllCampaign, getCampaign } from "../api/campaign";
import { getUser, registerUser } from "../api";

interface DataStore {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
  campaigns: Campaign[];
  user: User | null;
  isLoggedIn: boolean;
  setProvider: (provider: ethers.BrowserProvider) => void;
  setSigner: (signer: ethers.JsonRpcSigner) => void;
  setContract: (contract: ethers.Contract) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  initialize: () => Promise<(() => void) | void>;
  setLoggedIn: (isLoggedIn: boolean) => void;
  login: () => Promise<boolean>;
  register: (name: string) => Promise<void>;
  logout: () => void;
  attachListeners: () => (() => void) | void;
  getCampaigns: () => Promise<void>;
  pendingTransactions: { hash: string; confirmed: boolean }[];
  addTransaction: (hash: string) => void;
  updateTransactionStatus: (hash: string, confirmed: boolean) => void;
}

export const useDataStore = create<DataStore>((set, get) => ({
  provider: null,
  signer: null,
  contract: null,
  user: null,
  campaigns: [],
  isLoggedIn: false,
  setProvider: (provider) => set({ provider }),
  setSigner: (signer) => set({ signer }),
  setContract: (contract) => set({ contract }),
  setCampaigns: (campaigns) => set({ campaigns }),
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

    const user = await getUser(address);

    if (user.isRegistered) {
      set({
        user: { name: user.name, address, isRegistered: true },
        isLoggedIn: true,
      });

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

    const res = await registerUser(name);

    if ((res as ResponseError).error) {
      toast((res as ResponseError).error.message);
      throw new Error((res as ResponseError).error.message);
    }

    const { hash } = res as ContractTransactionResponse;
    get().addTransaction(hash);

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

    const listener = async (...args: any) => {
      const [campaignId] = args[0].args;

      const campaignData = await getCampaign(BigInt(campaignId!));

      const camapaign: Campaign = {
        ...campaignData,
        raised: campaignData.raised,
        goal: campaignData.goal,
        contributions: campaignData.contributions.map((contribution: any) => ({
          ...contribution,
          amount: formatEther(contribution.amount),
        })),
      };

      set((state) => ({ campaigns: [...state.campaigns, camapaign] }));
    };

    contract.on(filter, listener);

    return () => {
      contract.off(filter, listener);
    };
  },
  getCampaigns: async () => {
    const campaigns = await getAllCampaign();

    set({ campaigns });
  },
  pendingTransactions: [],
  addTransaction: (hash) => {
    const provider = get().provider;

    if (!provider) {
      return;
    }

    set((state) => ({
      pendingTransactions: [
        ...state.pendingTransactions,
        { hash, confirmed: false },
      ],
    }));

    provider
      .waitForTransaction(hash)
      .then((receipt) => {
        if (receipt?.status === 1) {
          set((state) => ({
            pendingTransactions: state.pendingTransactions.map((tx) =>
              tx.hash === hash ? { ...tx, confirmed: true } : tx
            ),
          }));

          toast("Transaction confirmed");
        } else {
          toast("Transaction failed");
        }
      })
      .catch((error) => {
        console.error("Error waiting for transaction:", error);
        set((state) => ({
          pendingTransactions: state.pendingTransactions.filter(
            (tx) => tx.hash !== hash
          ),
        }));

        toast("Transaction failed");
      });
  },
  updateTransactionStatus: (hash, confirmed) =>
    set((state) => ({
      pendingTransactions: state.pendingTransactions.map((tx) =>
        tx.hash === hash ? { ...tx, confirmed } : tx
      ),
    })),
}));
