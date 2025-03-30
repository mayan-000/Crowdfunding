import { formatEther } from "ethers";
import { useNavigate } from "react-router-dom";
import { Campaign } from "../store/useDataStore";

interface CampaignComponentProps {
  campaign: Campaign;
}

const CampaignComponent = ({ campaign }: CampaignComponentProps) => {
  const navigate = useNavigate();

  const handleViewCampaign = () => {
    navigate(`/campaign/${campaign.campaignId}`);
  };

  return (
    <div className="w-full border border-gray-200 p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      {/* Campaign Title */}
      <h2 className="text-2xl font-bold mb-4 text-blue-600">{campaign.title}</h2>

      {/* Creator Info */}
      <p className="text-gray-700 mb-2">
        <span className="font-semibold">Creator:</span> {campaign.creator}
      </p>

      {/* Goal Info */}
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">Goal:</span> {formatEther(campaign.goal)} ETH
      </p>

      {/* Progress Bar */}
      {campaign.raised && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full">
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
            Raised: {formatEther(campaign.raised)} ETH
          </p>
        </div>
      )}

      {/* View Campaign CTA */}
      <button
        onClick={handleViewCampaign}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all w-fit"
      >
        View Campaign
      </button>
    </div>
  );
};

export default CampaignComponent;
