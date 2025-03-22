import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to the Crowdfunding Platform</h1>
      <nav>
        <ul className="flex justify-center space-x-4">
          <li>
            <Link to="/user" className="text-blue-500 hover:underline">
              User Management
            </Link>
          </li>
          <li>
            <Link to="/campaign" className="text-blue-500 hover:underline">
              Campaign Management
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
