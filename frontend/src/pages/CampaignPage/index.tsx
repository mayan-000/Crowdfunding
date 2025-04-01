import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import CampaignComponent from "../../components/CampaignComponent";
import { useDataStore } from "../../store/useDataStore";
import NoCampaignsImage from "../../assets/showing-love.svg";
import CreateCampaign from "./CreateCampaign";

const CampaignPage = () => {
  const campaigns = useDataStore((state) => state.campaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="px-8 py-12 bg-gray-50 min-h-screen relative">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-blue-600">Campaigns</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
        >
          Create Campaign
        </button>
      </div>

      <div>
        {campaigns?.length === 0 ? (
          <div className="flex flex-col items-center text-center text-gray-500 text-lg">
            <img
              src={NoCampaignsImage}
              alt="No Campaigns"
              className="w-64 h-64 mb-6"
            />
            <p className="mb-4 font-medium text-gray-700 text-xl">
              No campaigns available at the moment.
            </p>
            <p className="mb-4 text-gray-600">
              Start by creating a new campaign to bring your ideas to life and
              inspire others to contribute to your cause.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
            >
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <>
            {campaigns?.map((campaign) => (
              <CampaignComponent
                key={campaign.id}
                campaign={campaign}
              />
            ))}
          </>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg border border-gray-300"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CreateCampaign
                onClose={() => {
                  setIsModalOpen(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Outlet />
    </div>
  );
};

export default CampaignPage;
