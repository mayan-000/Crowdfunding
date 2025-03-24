import { useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createCampaign } from "../../api/campaign";
import { getContract, getProvider } from "../../utils";
import { Transaction } from "ethers";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { setCampaignCreateReponseHash, setDeferredTopicFilter } =
    useOutletContext();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

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

      setCampaignCreateReponseHash(res.hash);

      const signer = await (await getProvider())?.getSigner();

      if (!signer) {
        return;
      }

      const contract = getContract(signer);
      const filter = contract.filters.CampaignCreated(
        null,
        await signer.getAddress()
      );

      setDeferredTopicFilter(filter);
    },
    [setCampaignCreateReponseHash, setDeferredTopicFilter]
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
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Campaign
      </button>
    </form>
  );
};

export default CreateCampaign;
