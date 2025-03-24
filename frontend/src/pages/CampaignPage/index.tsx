import { useCallback, useEffect, useState } from "react";
import { getAllCampaign } from "../../api/campaign";
import CampaignComponent, {
  Campaign,
} from "../../components/CampaignComponent";
import { Link, Outlet, useLocation } from "react-router-dom";
import Listener from "../../components/Listener";
import { DeferredTopicFilter } from "ethers";

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [campaignCreateReponseHash, setCampaignCreateReponseHash] = useState<
    string | null
  >(null);
  const [deferredTopicFilter, setDeferredTopicFilter] =
    useState<DeferredTopicFilter | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getAllCampaign();

      setLoading(false);

      if (res.error) {
        setError(res.error.message);
        return;
      }

      setCampaigns(res.campaigns);
    })();
  }, []);

  const eventListener = useCallback(async (...args: unknown[]) => {
    const res = await getAllCampaign();

    setLoading(false);

    if (res.error) {
      setError(res.error.message);
      return;
    }

    setCampaigns(res.campaigns);
		console.log('felo')
  }, []);

  if (loading) {
    return <div className="text-center text-xl">Loading campaigns...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

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

      <Outlet
        context={{ setCampaignCreateReponseHash, setDeferredTopicFilter }}
      />

      {campaignCreateReponseHash && (
        <div>
          <p className="text-green-500 text-center">
            Campaign created successfully with hash: {campaignCreateReponseHash}
          </p>
          <Listener
            eventName={deferredTopicFilter}
            callback={eventListener}
            toastMessage="Campaign created successfully!"
            once={true}
          />
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
