import { useCallback, useEffect, useState } from "react";
import { getContract, getProvider } from "../../utils";
import { getUser, registerUser } from "../../api";
import UserComponent from "../../components/UserComponent";
import { DeferredTopicFilter } from "ethers";
import Listener from "../../components/Listener";

export type User = {
  name: string;
  address: string;
  isRegistered: boolean;
};

const UserPage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [name, setName] = useState<string>("");
  const [responseHash, setResponseHash] = useState<string>("");
  const [deferredTopicFilter, setDeferredTopicFilter] =
    useState<DeferredTopicFilter | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const provider = await getProvider();
      const address = await (await provider?.getSigner())?.getAddress();

      if (!address) {
        return;
      }

      const userData = await getUser(address);
      const [name, , isRegistered] = userData?.user ?? [];

      setUserData({
        name,
        address,
        isRegistered,
      });
    })();
  }, []);

  const registerUserHandler = useCallback(async () => {
    const provider = await getProvider();
    const address = await (await provider?.getSigner())?.getAddress();

    if (!address) {
      return;
    }

    const res = await registerUser(name);

    if (res.error) {
      setError(res.error.message);
      return;
    }

    setResponseHash(res.hash);

    const signer = await provider?.getSigner();

    if (!signer) {
      return;
    }

    const contract = getContract(signer);
    const filter = contract.filters.UserRegistered(address);

    setDeferredTopicFilter(filter);
  }, [name]);

  const eventListener = useCallback(async (...args: unknown[]) => {
    const name = args[0].args[0] as string;
    const address = args[0].args[1] as string;

    console.log(name, address);

    setUserData({
      name,
      address,
      isRegistered: true,
    });

    setResponseHash("");
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>
      {userData?.isRegistered ? (
        <UserComponent user={userData} />
      ) : (
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Enter your name"
            className="border border-gray-300 p-2 rounded w-1/2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={() => registerUserHandler()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register User
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {responseHash && (
        <div>
          <p className="text-green-500 text-center mt-4">
            Transaction Hash: {responseHash}
          </p>
          <Listener
            eventName={deferredTopicFilter}
            callback={eventListener}
            toastMessage="User registered successfully!"
            once={true}
          />
        </div>
      )}
    </div>
  );
};

export default UserPage;
