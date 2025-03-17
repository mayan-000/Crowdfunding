import { registerUser } from "./api";

function App() {
  const registerUserHandler = async () => {
    const name = "Spiderman";

    await registerUser(name);
  };

  return (
    <>
      <div>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={registerUserHandler}
        >
          Register User
        </button>
      </div>
    </>
  );
}

export default App;
