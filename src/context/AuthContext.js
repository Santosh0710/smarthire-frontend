import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Create the context
const AuthContext = createContext(null);

// AuthProvider wraps our entire app
// Any component inside can access auth state
export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user is already logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser({
      email: data.email,
      role: data.role,
    });
    return data;
  };

  // Register function
  const register = async (userData) => {
    const data = await authService.register(userData);
    return data;
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isEmployer: user?.role === 'EMPLOYER',
      isJobSeeker: user?.role === 'JOB_SEEKER',
      loading,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context easily
export function useAuth() {
  return useContext(AuthContext);
}