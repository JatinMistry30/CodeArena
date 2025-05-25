import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// API base URL - should match your server
const API_URL = process.env.REACT_APP_API_URL || 'https://codearena-u4dp.onrender.com';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [languages, setLanguages] = useState([]);

  // Configure axios defaults
  axios.defaults.withCredentials = true;

  // Load user data on initial render
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/current-user`);
        if (response.data) {
          setCurrentUser(response.data.user);
          setUserStats(response.data.stats);
          setUserActivity(response.data.activity);
        }
      } catch (err) {
        // User is not logged in, or token is invalid
        console.log("Not authenticated:", err.response?.data || err.message);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/languages`);
        setLanguages(response.data);
      } catch (err) {
        console.error("Error fetching languages:", err);
      }
    };

    fetchCurrentUser();
    fetchLanguages();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/register`, userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  // Login user
  const login = async (credentials) => {
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/login`, credentials);
      setCurrentUser(response.data.user);
      await refreshUserData(); // Fetch user stats after login
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/logout`);
      setCurrentUser(null);
      setUserStats(null);
      setUserActivity([]);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/current-user`);
      if (response.data) {
        setCurrentUser(response.data.user);
        setUserStats(response.data.stats);
        setUserActivity(response.data.activity);
      }
      return response.data;
    } catch (err) {
      console.error("Error refreshing user data:", err);
      throw err;
    }
  };

  // Find a match
  const findMatch = async (selectedLang) => {
    if (!currentUser) {
      throw new Error("You must be logged in to find a match");
    }
    
    try {
      const matchData = {
        userId: currentUser.id,
        username: currentUser.username,
        selectedLang
      };
      
      const response = await axios.post(`${API_URL}/api/matchmaking`, matchData);
      return response.data;
    } catch (err) {
      console.error("Matchmaking error:", err);
      throw err;
    }
  };

  // The context value that will be provided
  const value = {
    currentUser,
    userStats,
    userActivity,
    loading,
    error,
    languages,
    register,
    login,
    logout,
    refreshUserData,
    findMatch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;