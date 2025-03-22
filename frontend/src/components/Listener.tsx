import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ContractEventName } from "ethers";
import { Contract } from "ethers";
import { getContract, getProvider } from "../utils";

interface ListenerProps {
  eventName: ContractEventName | null;
  callback: (...args: unknown[]) => void;
  toastMessage: string;
  once?: boolean;
}

const Listener = ({
  eventName,
  callback,
  toastMessage,
  once = false,
}: ListenerProps) => {
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    (async () => {
      const provider = await getProvider();
      const signer = await provider?.getSigner();

      if (!signer) {
        return;
      }

      const contract = getContract(signer);
      setContract(contract);
    })();
  }, []);

  useEffect(() => {
    if (!eventName) {
      return;
    }

    const eventListener = (...args: unknown[]) => {
      console.log("args", args);
      toast(toastMessage);
      callback(...args);
    };

    if (once) {
      contract?.once(eventName, eventListener);
    } else {
      contract?.on(eventName, eventListener);
    }

    return () => {
      contract?.off(eventName, eventListener);
    };
  }, [eventName, callback, toastMessage, once, contract]);

  return <ToastContainer />;
};

export default Listener;
