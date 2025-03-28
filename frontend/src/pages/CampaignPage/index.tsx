import { Link, Outlet, useLocation } from "react-router-dom";

import CampaignComponent from "../../components/CampaignComponent";
import { useDataStore } from "../../store/useDataStore";

const CampaignPage = () => {
  const campaigns = useDataStore((state) => state.campaigns);
  const latestTransaction = useDataStore((state) => state.latestTransaction);
  const location = useLocation();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        {location.pathname !== "/campaign/create" && (
          <Link
            to="/campaign/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Campaign
          </Link>
        )}
      </div>

      <Outlet />

      {latestTransaction && latestTransaction.type === "campaign" && (
        <div className="mb-4 p-4 border rounded bg-green-100">
          Latest Campaign Creation Transaction: {latestTransaction.key}
        </div>
      )}

      {campaigns.length === 0 ? (
        <p className="text-center text-gray-500">No campaigns available</p>
      ) : (
        campaigns.map((campaign) => (
          <CampaignComponent key={campaign.campaignId} campaign={campaign} />
        ))
      )}
    </div>
  );
};

export default CampaignPage;
