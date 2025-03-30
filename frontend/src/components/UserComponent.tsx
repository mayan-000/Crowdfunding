import { useEffect, useMemo, useState } from "react";

import { getUserContributions } from "../api";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { User } from "../store/useDataStore";

type Contribution = {
  campaignId: string;
  funder: string;
  amount: string;
};

interface UserComponentProps {
  user: User;
}

const UserComponent = ({ user }: UserComponentProps) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const [totalContributions, totalETHContributed] = useMemo(() => {
    const totalContributions = contributions.length;
    const totalETHContributed = contributions.reduce(
      (total, contribution) =>
        total + parseFloat(ethers.formatEther(contribution.amount)),
      0
    );

    return [totalContributions, totalETHContributed];
  }, [contributions]);

  useEffect(() => {
    (async () => {
      try {
        const _contributions = await getUserContributions(user.address);
        setContributions(_contributions.contributions);
      } catch (error) {
        console.error("Error fetching contributions:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user.address]);

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            User Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-800 w-32">Name:</span>
              <span className="text-gray-700">{user.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-800 w-32">Address:</span>
              <span className="text-blue-500 break-all">{user.address}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Contribution Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-800 w-32">
                Contributions:
              </span>
              <span className="text-gray-700">{totalContributions}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-800 w-32">Total ETH:</span>
              <span className="text-gray-700">
                {totalETHContributed.toFixed(4)} ETH
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="flex items-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="text-gray-600 ml-3">Loading contributions...</p>
          </div>
        ) : contributions && contributions.length > 0 ? (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Your Contributions
            </h3>
            <div className="space-y-6">
              {contributions.map((contribution, index) => (
                <div key={index} className="text-gray-700">
                  <p>
                    <span className="font-medium">Campaign ID:</span>{" "}
                    <span className="text-blue-500">
                      {contribution.campaignId}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {ethers.formatEther(contribution.amount).toString()} ETH
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-gray-600 text-center mt-20">
            <p className="text-lg font-semibold text-gray-800">
              You haven’t made any contributions yet.
            </p>
            <p className="mt-2 text-gray-700">
              Start exploring campaigns and support innovative ideas to make a
              difference.
            </p>
            <button
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
              onClick={() => navigate("/campaign")}
            >
              Explore Campaigns
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserComponent;
