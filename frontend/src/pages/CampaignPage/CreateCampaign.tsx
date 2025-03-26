import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createCampaign } from "../../api/campaign";
import { useDataStore } from "../../store/useDataStore";

const CreateCampaign = () => {
  const navigate = useNavigate();
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
        alert(res.error.message);
        return;
      }

      setLatestTransaction({
        type: "campaign",
        key: res.hash,
      });

      navigate("/campaign");
    },
    [navigate, setLatestTransaction]
  );

  const handleClose = () => {
    navigate("/campaign");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 border rounded shadow-md relative"
    >
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Create Campaign</h1>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="goal"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Goal in ETH
        </label>
        <input
          type="text"
          id="goal"
          name="goal"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {loading ? "Creating..." : "Create Campaign"}
      </button>
    </form>
  );
};

export default CreateCampaign;
