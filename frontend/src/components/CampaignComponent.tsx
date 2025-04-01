import { formatEther } from "ethers";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCalendarAlt,
  FaFlag,
  FaCoins,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useCallback } from "react";

interface CampaignComponentProps {
  campaign: Campaign;
}

const CampaignComponent = ({ campaign }: CampaignComponentProps) => {
  const navigate = useNavigate();

  const handleViewCampaign = useCallback(() => {
    navigate(`/campaign/${campaign.id}`);
  }, []);

  const handleViewCreator = useCallback(() => {
    navigate(`/user/${campaign.creator}`);
  }, []);

  const isActive =
    new Date() < new Date(+campaign.deadline * 1000) && campaign.isActive;

  return (
    <div className="w-full border border-gray-200 p-6 my-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-2/3">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-blue-600 truncate">
              {campaign.title}
            </h2>
            <span
              className={`text-sm font-semibold flex items-center ${
                isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isActive ? (
                <>
                  <FaCheckCircle className="mr-1" /> Active
                </>
              ) : (
                <>
                  <FaTimesCircle className="mr-1" /> Inactive
                </>
              )}
            </span>
          </div>

          <div className="flex items-center text-gray-700 mb-3">
            <FaUser className="mr-2 text-blue-500" />
            <p className="text-sm flex items-center">
              <span className="font-semibold">Creator:</span> {campaign.creator}
              <FaExternalLinkAlt
                className="ml-2 text-blue-500 cursor-pointer hover:text-blue-700 transition-all"
                onClick={handleViewCreator}
                title="View Creator Profile"
              />
            </p>
          </div>

          <div className="flex items-center justify-between text-gray-700 mb-3">
            <div className="flex items-center">
              <FaCoins className="mr-2 text-yellow-500" />
              <p className="text-sm">
                <span className="font-semibold">Raised:</span>{" "}
                {formatEther(campaign?.raised || "0")} ETH
              </p>
            </div>
            <div className="flex items-center">
              <FaFlag className="mr-2 text-green-500" />
              <p className="text-sm">
                <span className="font-semibold">Goal:</span>{" "}
                {formatEther(campaign?.goal || "0")} ETH
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full"
                style={{
                  width: `${Math.min(
                    (Number(campaign.raised) / Number(campaign.goal)) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Progress:{" "}
              {Math.min(
                (Number(campaign.raised) / Number(campaign.goal)) * 100,
                100
              ).toFixed(2)}
              %
            </p>
          </div>
        </div>

        <div className="md:w-1/3 md:pl-6 mt-6 md:mt-0">
          <div className="flex items-center text-gray-700 mb-3">
            <FaCalendarAlt className="mr-2 text-purple-500" />
            <p className="text-sm">
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(+campaign.createdAt * 1000).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="mr-2 text-red-500" />
            <p className="text-sm">
              <span className="font-semibold">Deadline:</span>{" "}
              {new Date(+campaign.deadline * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleViewCampaign}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all w-full mt-6"
      >
        View Campaign
      </button>
    </div>
  );
};

export default CampaignComponent;
