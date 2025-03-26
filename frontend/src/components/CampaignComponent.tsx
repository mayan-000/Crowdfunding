import { formatEther } from "ethers";
import { Campaign } from "../store/useDataStore";

interface CampaignComponentProps {
  campaign: Campaign;
}

const CampaignComponent = ({ campaign }: CampaignComponentProps) => {
  return (
    <div className="border border-gray-200 p-6 mb-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
      <p className="text-gray-700 mb-1">
        <span className="font-semibold">Creator:</span> {campaign.creator}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Goal:</span>{" "}
        {formatEther(campaign.goal)} ETH
      </p>
    </div>
  );
};

export default CampaignComponent;
