import { useCallback, useState, useEffect } from "react";
import UserComponent from "../../components/UserComponent";
import ShowingSupport from "../../assets/showing-support.svg";
import { useDataStore } from "../../store/useDataStore";

const UserPage = () => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const user = useDataStore((state) => state.user);
  const register = useDataStore((state) => state.register);
  const logout = useDataStore((state) => state.logout);
  const login = useDataStore((state) => state.login);

  const handleRegister = useCallback(async () => {
    setLoading(true);
    try {
      await register(name);
    } catch (error) {
      await login();
    } finally {
      setLoading(false);
    }
  }, [login, name, register]);

  useEffect(() => {
    if (user?.isRegistered) {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="px-8 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        Manage Your Profile
      </h1>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Updating your profile...</p>
        </div>
      ) : user?.isRegistered ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome, {user.name}!
              </h2>
              <p className="text-gray-600 mb-4">
                Here are your profile details. You can manage your account and
                view your activity.
              </p>
            </div>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all"
              onClick={logout}
            >
              Logout
            </button>
          </div>
          <UserComponent user={user} />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Register Your Account
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Enter your name below to register and start your crowdfunding
              journey.
            </p>
            <input
              type="text"
              placeholder="Enter your name"
              className="border border-gray-300 p-3 rounded-lg w-full max-w-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={handleRegister}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all"
            >
              Register Now
            </button>
            <p className="mt-4 text-gray-600">
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={login}
              >
                Login here
              </button>
            </p>
          </div>

          <div className="hidden md:block md:w-1/2 mt-10">
            <img src={ShowingSupport} alt="Showing Support" />
            <p className="text-gray-600 text-center mt-4">
              Join our platform to support innovative ideas and bring dreams to
              life. Registration is quick and easy!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
