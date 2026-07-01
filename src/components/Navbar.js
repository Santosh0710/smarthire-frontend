import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated, isEmployer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        SmartHire
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link to="/jobs"
          className="text-gray-600 hover:text-blue-600 font-medium">
          Browse Jobs
        </Link>

        {/* Show these only when logged in */}
        {isAuthenticated && isEmployer && (
          <Link to="/dashboard"
            className="text-gray-600 hover:text-blue-600 font-medium">
            Dashboard
          </Link>
        )}

        {/* Show Login/Register when not logged in */}
        {!isAuthenticated ? (
          <div className="flex gap-3">
            <Link to="/login"
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">
              Login
            </Link>
            <Link to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Register
            </Link>
          </div>
        ) : (
          // Show user info and logout when logged in
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">
              {user?.email}
            </span>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              {user?.role}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;