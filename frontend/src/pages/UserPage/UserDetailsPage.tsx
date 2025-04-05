import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, getUserCampaigns, getUserContributions } from "../../api";
import { formatEther, toNumber } from "ethers";
import { FaUserCircle, FaEthereum, FaCalendarAlt } from "react-icons/fa";

const UserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"contributions" | "campaigns">(
    "contributions"
  );

  useEffect(() => {
    (async () => {
      try {
        const userData = await getUser(userId!);
        const {name, address} = userData;

        const contributions = await getUserContributions(userId!);
        const totalContributions = contributions.reduce(
          (acc: number, curr: any) => acc + parseFloat(curr.amount),
          0
        );
        const campaignsSupported = contributions.length;

        const campaigns = await getUserCampaigns(userId!);

        setUser({
          name,
          address,
          totalContributions: formatEther(totalContributions.toString()),
          campaignsSupported,
          contributions: contributions.map((contributor: any) => ({
            address: contributor.contributor,
            amount: formatEther(contributor.amount),
            campaignId: contributor.campaignId,
            timestamp: contributor.timestamp,
          })),
          campaignsCreated: campaigns.map((campaign: any) => ({
            id: campaign.id,
            title: campaign.title,
            goal: formatEther(campaign.goal || "0"),
            raised: formatEther(campaign.raised || "0"),
            deadline: campaign.deadline,
          })),
        });
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600">User not found.</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        User Details
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mb-10">
        <div className="flex items-center mb-4">
          <FaUserCircle className="text-blue-600 text-4xl mr-4" />
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
        </div>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Address:</span> {user.address}
        </p>
        <p className="text-gray-700 mb-4 flex items-center">
          <FaEthereum className="text-yellow-500 mr-2" />
          <span className="font-semibold">Total Contributions:</span>{" "}
          {user.totalContributions} ETH
        </p>
        <p className="text-gray-700 flex items-center">
          <FaCalendarAlt className="text-purple-500 mr-2" />
          <span className="font-semibold">Campaigns Supported:</span>{" "}
          {user.campaignsSupported}
        </p>
      </div>

      <div className="flex justify-start mb-6 space-x-4">
        <button
          className={`px-6 py-2 font-medium text-sm rounded-full transition-all ${
            activeTab === "contributions"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("contributions")}
        >
          Contributions
        </button>
        <button
          className={`px-6 py-2 font-medium text-sm rounded-full transition-all ${
            activeTab === "campaigns"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("campaigns")}
        >
          Campaigns Created
        </button>
      </div>

      {activeTab === "contributions" && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Contributions
          </h2>
          {user.contributions.length > 0 ? (
            <div className="space-y-3">
              {user.contributions.map((contribution: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Campaign ID: {contribution.campaignId}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        toNumber(contribution.timestamp || "0") * 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-blue-600">
                    {contribution.amount} ETH
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No contributions found.</p>
          )}
        </>
      )}

      {activeTab === "campaigns" && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Campaigns Created
          </h2>
          {user.campaignsCreated.length > 0 ? (
            <div className="space-y-3">
              {user.campaignsCreated.map((campaign: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {campaign.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Goal: {campaign.goal} ETH | Raised: {campaign.raised} ETH
                    </p>
                    <p className="text-xs text-gray-500">
                      Deadline:{" "}
                      {new Date(
                        toNumber(campaign.deadline) * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={`/campaign/${campaign.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Campaign
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No campaigns created.</p>
          )}
        </>
      )}
    </div>
  );
};

export default UserDetailsPage;
