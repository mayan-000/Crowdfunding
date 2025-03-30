import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, getUserContributions } from "../../api";
import { formatEther } from "ethers";

const UserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const userData = await getUser(userId!);

        const [name, address] = userData.user;

        const { contributions } = await getUserContributions(userId!);
        const totalContributions = contributions.reduce(
          (acc: number, curr: any) => acc + parseFloat(curr.amount),
          0
        );

        const campaignsSupported = contributions.length;
        console.log(contributions);

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
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {user.name}
        </h2>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Address:</span> {user.address}
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Total Contributions:</span>{" "}
          {user.totalContributions} ETH
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Campaigns Supported:</span>{" "}
          {user.campaignsSupported}
        </p>
      </div>

      {/* Contributions Section */}
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Contributions</h2>
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
                  Timestamp: {contribution.timestamp}
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
    </div>
  );
};

export default UserDetailsPage;
