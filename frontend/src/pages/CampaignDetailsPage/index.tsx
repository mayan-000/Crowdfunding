import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContractTransactionResponse, formatEther } from "ethers";
import {
  FaCoins,
  FaFlag,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getCampaign,
  contributeToCampaign,
  inActivateCampaign,
  withdrawContributions,
  refundContributions,
} from "../../api/campaign";
import { useDataStore } from "../../store/useDataStore";

const CampaignDetailsPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isContributing, setIsContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const contract = useDataStore((state) => state.contract);
  const signer = useDataStore((state) => state.signer);
  const addTransaction = useDataStore((state) => state.addTransaction);
  const [userAddress, setUserAddress] = useState<string>();

  useEffect(() => {
    (async () => {
      const campaignData = await getCampaign(BigInt(campaignId!));
      const isActive =
        new Date() < new Date(+campaignData.deadline * 1000) &&
        campaignData.isActive;

      setCampaign({
        ...campaignData,
        raised: formatEther(campaignData.raised),
        goal: formatEther(campaignData.goal),
        isActive,
        contributions: campaignData.contributions.map((contribution: any) => ({
          ...contribution,
          amount: formatEther(contribution.amount),
        })),
      });

      const user = await signer?.getAddress();
      setUserAddress(user);

      setLoading(false);
    })();
  }, [campaignId, signer]);

  // Check this later, also add more listener for deactivate, withdraw, refund
  useEffect(() => {
    const filter = contract?.filters.Funded(BigInt(campaignId!));

    const listener = (...args: any) => {
      const [, funder, amount] = args[0].args;

      const newContribution = {
        address: funder,
        amount: formatEther(amount),
      };

      setCampaign((prevCampaign: any) => ({
        ...prevCampaign,
        raised: formatEther(
          BigInt(String(prevCampaign.raised) || "0") +
            BigInt(newContribution.amount)
        ),
      }));
    };

    if (filter) contract?.on(filter, listener);

    return () => {
      if (filter) contract?.off(filter, listener);
    };
  }, [contract, campaignId]);

  const handleContribute = useCallback(async () => {
    if (!contributionAmount || isNaN(Number(contributionAmount))) {
      toast("Please enter a valid amount.");
      return;
    }

    const res = await contributeToCampaign(
      BigInt(campaignId!),
      contributionAmount
    );

    setIsContributing(false);

    if ((res as ResponseError)?.error) {
      toast((res as ResponseError).error?.message);
      return;
    }

    const { hash } = res as ContractTransactionResponse;
    addTransaction(hash);

    toast("Contribution successful!");

    setContributionAmount("");
  }, [campaignId, contributionAmount]);

  // check this later
  useEffect(() => {
    const filter = contract?.filters.Deactivated(BigInt(campaignId!));

    const listener = (...args: any) => {
      toast("Campaign deactivated by creator!");

      setCampaign((prevCampaign: any) => ({
        ...prevCampaign,
        isActive: false,
      }));
    };

    if (filter) contract?.on(filter, listener);

    return () => {
      if (filter) contract?.off(filter, listener);
    };
  }, [campaignId]);

  const handleInactiveCampaign = useCallback(async () => {
    if (!campaign.isActive || campaign?.creator !== userAddress) {
      return;
    }

    const res = await inActivateCampaign(BigInt(campaignId!));

    if ((res as ResponseError)?.error) {
      toast((res as ResponseError).error?.message);
      return;
    }

    const { hash } = res as ContractTransactionResponse;
    addTransaction(hash);
  }, [campaign?.creator, campaign?.isActive, campaignId, userAddress]);

  useEffect(() => {
    const filter = contract?.filters.Withdrawn(BigInt(campaignId!));
    const listener = (...args: any) => {
      toast("Funds withdrawn by creator!");
    };

    if (filter) contract?.on(filter, listener);

    return () => {
      if (filter) contract?.off(filter, listener);
    };
  }, [campaignId]);

  const handleWithdraw = useCallback(async () => {
    if (campaign.isActive || campaign.creator !== userAddress) {
      return;
    }

    if (campaign.raised !== campaign.goal) {
      toast("Cannot withdraw funds until the goal is reached.");
      return;
    }

    const res = await withdrawContributions(BigInt(campaignId!));

    if ((res as ResponseError)?.error) {
      toast((res as ResponseError).error?.message);
    }

    const { hash } = res as ContractTransactionResponse;
    addTransaction(hash);

    toast("Funds withdrawn successfully!");
  }, [campaignId]);

  useEffect(() => {
    const filter = contract?.filters.Refunded(BigInt(campaignId!));
    const listener = (...args: any) => {
      toast("Contributors refunded!");
    };

    if (filter) contract?.on(filter, listener);

    return () => {
      if (filter) contract?.off(filter, listener);
    };
  }, [campaignId]);

  const handleRefund = useCallback(async () => {
    if (campaign.isActive || campaign.creator !== userAddress) {
      return;
    }

    const res = await refundContributions(BigInt(campaignId!));

    if ((res as ResponseError)?.error) {
      toast((res as ResponseError).error?.message);
    }

    const { hash } = res as ContractTransactionResponse;
    addTransaction(hash);

    toast("Refund successful!");
  }, [campaign?.creator, campaign?.isActive, campaignId, userAddress]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4">Loading campaign details...</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-blue-600 border-b border-gray-200 pb-2 flex items-center justify-between">
        {campaign.title}
        <span
          className={`text-sm font-semibold flex items-center ${
            campaign.isActive ? "text-green-600" : "text-red-600"
          }`}
        >
          {campaign.isActive ? (
            <>
              <FaCheckCircle className="mr-1" /> Active
            </>
          ) : (
            <>
              <FaTimesCircle className="mr-1" /> Inactive
            </>
          )}
        </span>
      </h1>
      <p className="text-gray-700 mb-6 text-lg">{campaign.description}</p>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <p className="text-gray-700 flex items-center">
          <FaFlag className="mr-2 text-green-500" />
          <span className="font-semibold">Goal:</span> {campaign.goal || "0"}{" "}
          ETH
        </p>
        <p className="text-gray-700 flex items-center">
          <FaCoins className="mr-2 text-yellow-500" />
          <span className="font-semibold">Funds Raised:</span>{" "}
          {campaign.raised || "0"} ETH
        </p>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <p className="text-gray-700 flex items-center">
          <FaCalendarAlt className="mr-2 text-purple-500" />
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(+campaign.createdAt * 1000).toLocaleDateString()}
        </p>
        <p className="text-gray-700 flex items-center">
          <FaCalendarAlt className="mr-2 text-red-500" />
          <span className="font-semibold">Deadline:</span>{" "}
          {new Date(+campaign.deadline * 1000).toLocaleDateString()}
        </p>
      </div>
      <div className="mb-8 flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
        <div className="w-fit">
          {!isContributing ? (
            <button
              onClick={() => setIsContributing(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
              disabled={!campaign.isActive}
            >
              Contribute
            </button>
          ) : (
            <div className="flex flex-col space-y-3">
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="Enter amount in ETH"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleContribute}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all w-full"
                >
                  Continue
                </button>
                <button
                  onClick={() => {
                    setIsContributing(false);
                    setContributionAmount("");
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-all w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {campaign?.creator === userAddress && (
          <>
            <button
              className="bg-blue-600 text-white px-4 py-2 h-fit rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              disabled={!campaign.isActive}
              onClick={handleInactiveCampaign}
            >
              Deactivate Campaign
            </button>
            <button
              className="bg-yellow-600 text-white px-4 py-2 h-fit rounded-lg font-medium hover:bg-yellow-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-yellow-600"
              disabled={campaign?.isActive || campaign.raised !== campaign.goal}
              onClick={handleWithdraw}
            >
              Withdraw Funds
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 h-fit rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-red-600"
              disabled={campaign?.isActive}
              onClick={handleRefund}
            >
              Refund Contributors
            </button>
          </>
        )}
      </div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600 border-t border-gray-200 pt-4">
        Contributors
      </h2>
      {campaign.contributions?.length > 0 ? (
        <div className="space-y-3">
          {campaign.contributions.map((contributor: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <div>
                <button
                  className="text-sm font-medium text-gray-700 flex gap-2 items-center cursor-pointer hover:text-blue-500 mb-3"
                  onClick={() =>
                    window.open(`/user/${contributor.contributor}`, "_blank")
                  }
                >
                  <FaUserCircle
                    className="text-blue-500 cursor-pointer hover:text-blue-700 transition-all"
                    title="View Contributor Profile"
                  />
                  {contributor.contributor}
                </button>
                <p className="text-xs text-gray-500">
                  {new Date(contributor.timestamp * 1000).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <p className="text-sm font-semibold text-blue-600">
                  {contributor.amount} ETH
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No contributors yet.</p>
      )}
    </div>
  );
};

export default CampaignDetailsPage;
