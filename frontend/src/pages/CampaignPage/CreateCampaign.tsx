import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createCampaign } from "../../api/campaign";
import { useDataStore } from "../../store/useDataStore";

interface CreateCampaignProps {
  onClose: () => void;
}

const CreateCampaign = ({ onClose }: CreateCampaignProps) => {
  const setLatestTransaction = useDataStore(
    (state) => state.setLatestTransaction
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      const res = await createCampaign(
        String(data.title),
        String(data.description),
        BigInt(String(data.goal))
      );

      if (res.error) {
        setLoading(false);
        return;
      }

      setLatestTransaction({
        type: "campaign",
        key: res.hash,
      });

      onClose();
    },
    [setLatestTransaction, onClose]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white px-2 py-4 relative"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
      >
        &times;
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Create Campaign
      </h1>

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Campaign Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter campaign title"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Campaign Description
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter campaign description"
          rows={4}
          required
        ></textarea>
      </div>

      <div className="mb-6">
        <label
          htmlFor="goal"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Goal Amount (in ETH)
        </label>
        <input
          type="number"
          id="goal"
          name="goal"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter goal amount"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-3 rounded-lg text-white font-medium ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 transition-all"
        }`}
      >
        {loading ? "Creating..." : "Create Campaign"}
      </button>
    </form>
  );
};

export default CreateCampaign;
