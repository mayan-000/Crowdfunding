import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { formatEther, Listener } from "ethers";
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
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContributing, setIsContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const contract = useDataStore((state) => state.contract);
  const signer = useDataStore((state) => state.signer);
  const [userAddress, setUserAddress] = useState<string>();

  useEffect(() => {
    (async () => {
      const campaignData = await getCampaign(BigInt(campaignId!));
      const [
        creator,
        title,
        description,
        goal,
        raised,
        isActive,
        contributions,
      ] = campaignData.campaign;

      setCampaign({
        creator,
        title,
        description,
        goal: formatEther(goal),
        raised: formatEther(raised),
        isActive,
      });

      setContributions(
        contributions.map((contributor: any) => ({
          address: contributor.contributor,
          amount: formatEther(contributor.amount),
        }))
      );

      const user = await signer?.getAddress();
      setUserAddress(user);

      setLoading(false);
    })();
  }, [campaignId, signer]);

  // Check it's not working currently
  useEffect(() => {
    const filter = contract?.filters.Funded(BigInt(campaignId));

    const listener: Listener = (...args: any) => {
      console.log("Funding event detected:", args);
      const [, funder, amount] = args[0].args;

      const newContribution = {
        address: funder,
        amount: formatEther(amount),
      };

      setContributions((prevContributions) => [
        ...prevContributions,
        newContribution,
      ]);

      setCampaign((prevCampaign: any) => ({
        ...prevCampaign,
        raised: formatEther(
          BigInt(prevCampaign.raised) + BigInt(newContribution.amount)
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
      alert("Please enter a valid amount.");
      return;
    }

    try {
      await contributeToCampaign(BigInt(campaignId!), contributionAmount);
      setIsContributing(false);
      setContributionAmount("");
    } catch (error) {
      alert("Failed to contribute. Please try again.");
    }
  }, [campaignId, contributionAmount]);

  const handleInactiveCampaign = useCallback(async () => {
    if (!campaign.isActive || campaign?.creator !== userAddress) {
      return;
    }

    await inActivateCampaign(BigInt(campaignId!));
  }, [campaign?.creator, campaign?.isActive, campaignId, userAddress]);

  const handleWithdraw = useCallback(async () => {
    await withdrawContributions(BigInt(campaignId!));
  }, [campaignId]);

  const handleRefund = useCallback(async () => {
    if (campaign.isActive || campaign.creator !== userAddress) {
      return;
    }

    await refundContributions(BigInt(campaignId!));
  }, [campaign?.creator, campaign?.isActive, campaignId, userAddress]);

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading campaign details...</p>
    );
  }

  return (
    <div className="px-8 py-12 bg-gray-50 min-h-screen">
      {/* Campaign Title */}
      <h1 className="text-4xl font-bold mb-4 text-blue-600 border-b border-gray-200 pb-2">
        {campaign.title}
        <span className="text-sm text-gray-500 ml-2">
          {campaign.isActive ? " (Active)" : " (Inactive)"}
        </span>
      </h1>

      {/* Campaign Description */}
      <p className="text-gray-700 mb-6 text-lg">{campaign.description}</p>

      {/* Goal and Raised Info */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <p className="text-gray-700">
          <span className="font-semibold">Goal:</span> {campaign.goal || "0"}{" "}
          ETH
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Funds Raised:</span>{" "}
          {campaign.raised || "0"} ETH
        </p>
      </div>

      {/* CTAs */}
      <div className="mb-8 flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
        {/* Contribute Button */}
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              disabled={!campaign.isActive}
              onClick={handleInactiveCampaign}
            >
              Inactivate Campaign
            </button>
            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-yellow-600"
              disabled={campaign?.isActive || campaign.raised !== campaign.goal}
              onClick={handleWithdraw}
            >
              Withdraw Funds
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-red-600"
              disabled={campaign?.isActive}
              onClick={handleRefund}
            >
              Refund Contributors
            </button>
          </>
        )}
      </div>

      {/* Contributors List */}
      <h2 className="text-2xl font-bold mb-4 text-blue-600 border-t border-gray-200 pt-4">
        Contributors
      </h2>
      {contributions?.length > 0 ? (
        <div className="space-y-3">
          {contributions.map((contributor: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {contributor.address}
                </p>
              </div>
              <p className="text-sm font-semibold text-blue-600">
                {contributor.amount} ETH
              </p>
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
