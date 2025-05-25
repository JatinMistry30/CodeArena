import React, { useState, useEffect } from "react";
import axios from "axios";
import MatchArena from "./MatchMaking";
import { useSocket } from "./SocketContext";
import AnalyticsDashboard from "./AnalyticDashboard";
const Dashboard = () => {
  const [selectedLang, setSelectedLang] = useState("JavaScript");
  const [languages, setLanguages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get socket from context
  const socket = useSocket();

  useEffect(() => {
    const initializeMatchmaking = async () => {
      try {
        await getCurrentUser();
        await fetchLanguages();
        
        if (socket) {
          setupSocketListeners();
        }
      } catch (error) {
        console.error("Error initializing matchmaking:", error);
        setError("Failed to initialize. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeMatchmaking();

    return () => {
      // Clean up socket listeners when component unmounts
      if (socket) {
        socket.off('matchFound');
        socket.off('matchmakingError');
      }
    };
  }, [socket]);

  const setupSocketListeners = () => {
    socket.on('matchFound', (data) => {
      console.log('Match found:', data);
      setMatchData(data);
      setMatchFound(true);
      setIsSearching(false);
    });

    socket.on('matchmakingError', (error) => {
      console.error('Matchmaking error:', error);
      setError(error.message);
      setIsSearching(false);
    });
  };

  const startMatchmaking = async () => {
    if (!currentUser || !selectedLang || !socket) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      socket.emit('joinMatchmaking', {
        language: selectedLang,
        userId: currentUser.id
      });
    } catch (error) {
      console.error('Error starting matchmaking:', error);
      setError('Failed to start matchmaking');
      setIsSearching(false);
    }
  };

  const cancelMatchmaking = () => {
    if (!currentUser || !selectedLang || !socket) return;
    
    socket.emit('cancelMatchmaking', {
      language: selectedLang,
      userId: currentUser.id
    });
    
    setIsSearching(false);
  };

  const backToMatchmaking = () => {
    setMatchFound(false);
    setMatchData(null);
  };

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("https://codearena-u4dp.onrender.com/api/current-user", {
        withCredentials: true
      });

      if (response.data && response.data.id) {
        console.log(response.data)
        setCurrentUser(response.data);
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Error getting current user:", error);
      setError("Please login to continue");
      throw error;
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await axios.get("https://codearena-u4dp.onrender.com/api/languages");
      if (response.data && Array.isArray(response.data)) {
        setLanguages(response.data);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      setError("Failed to load languages");
      throw error;
    }
  };

  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-xl max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
              onClick={() => window.location.href = '/dashboard'}
            >
              Dashboard
            </button>
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If match is found, render the MatchArena component
  if (matchFound && matchData) {
    return (
      <MatchArena 
        match={matchData} 
        onBackToMatchmaking={backToMatchmaking}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-400 mb-4">Find a Match</h1>
          <p className="text-gray-300 text-lg">
            Challenge other developers in real-time coding battles
          </p>
          {currentUser && (
            <p className="text-sm text-gray-400 mt-2">
              Playing as: <span className="text-orange-400">{currentUser.username}</span>
            </p>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
          {!isSearching ? (
            <>
              <div className="mb-8">
                <label className="block text-lg font-medium text-gray-300 mb-4">
                  Select Programming Language
                </label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.name}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center">
                <button
                  onClick={startMatchmaking}
                  disabled={!currentUser}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentUser ? "Find Match" : "Loading..."}
                </button>
              </div>

              <div className="mt-8 text-center">
                <div className="text-sm text-gray-400">
                  <p>• Matches are based on selected language</p>
                  <p>• Each match consists of multiple coding questions</p>
                  <p>• Real-time competition with live scoring</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Searching for Opponent...
              </h2>
              <p className="text-gray-300 mb-6">
                Looking for another {selectedLang} developer to challenge
              </p>
              <p className="text-sm text-gray-400 mb-8">
                This may take a few moments. Please be patient.
              </p>
              <button
                onClick={cancelMatchmaking}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Cancel Search
              </button>
            </div>
          )}
        </div>

       <div className="">
        <AnalyticsDashboard />
       </div>
      </div>
    </div>
  );
};

export default Dashboard;