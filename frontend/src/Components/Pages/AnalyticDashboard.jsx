import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Trophy, Target, Code, Calendar, TrendingUp, Award, Users, Clock, RefreshCw, AlertCircle } from "lucide-react";

const AnalyticsDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userStats, setUserStats] = useState({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    averageScore: 0,
    bestScore: 0,
    favoriteLanguage: '',
    totalPlayTime: 0,
    currentRank: 0,
    currentStreak: 0,
    rating: 0
  });
  const [matchHistory, setMatchHistory] = useState([]);
  const [languageStats, setLanguageStats] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data from backend
  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://codearena-u4dp.onrender.com/api/analytics', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Check if response is ok
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in.");
        } else if (response.status === 404) {
          throw new Error("Analytics endpoint not found. Check if the server is running correctly.");
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      // Check content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error("Non-JSON response received:", responseText);
        throw new Error("Server returned HTML instead of JSON. Check if the API endpoint is configured correctly.");
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response format from server");
      }
      
      // Set user data
      setCurrentUser(data.user || { username: 'Unknown User' });
      
      // Set stats with proper fallbacks
      setUserStats({
        totalMatches: data.stats?.totalMatches || 0,
        wins: data.stats?.wins || 0,
        losses: data.stats?.losses || 0,
        winRate: data.stats?.winRate || 0,
        averageScore: data.stats?.averageScore || 0,
        bestScore: data.stats?.bestScore || 0,
        favoriteLanguage: data.stats?.favoriteLanguage || 'N/A',
        totalPlayTime: data.stats?.totalPlayTime || 0,
        currentRank: data.stats?.currentRank || 0,
        currentStreak: data.stats?.currentStreak || 0,
        rating: data.stats?.rating || 0
      });
      
      // Set other data arrays
      setMatchHistory(Array.isArray(data.matchHistory) ? data.matchHistory : []);
      setLanguageStats(Array.isArray(data.languageStats) ? data.languageStats : []);
      setPerformanceData(Array.isArray(data.performanceData) ? data.performanceData : []);
      setRecentActivity(Array.isArray(data.recentActivity) ? data.recentActivity : []);
      
    } catch (error) {
      console.error("Error fetching analytics:", error);
      
      // Provide user-friendly error messages
      if (error.message.includes("Failed to fetch")) {
        setError("Unable to connect to server. Please check your internet connection and ensure the backend server is running.");
      } else if (error.message.includes("HTML instead of JSON")) {
        setError("The API endpoint is not configured correctly. The server is returning HTML instead of data.");
      } else if (error.message.includes("Authentication required")) {
        setError("Please log in to view your analytics.");
      } else {
        setError(error.message || "Failed to load analytics data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "orange" }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/10`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
      </div>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-4">Unable to Load Analytics</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchAnalytics}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <div className="text-xs text-gray-400">
              <p>Troubleshooting tips:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                <li>Make sure you're logged in</li>
                <li>Check if the backend server is running</li>
                <li>Verify the API endpoint (/api/analytics) exists</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-orange-400 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-300">
              Welcome back, <span className="text-orange-400">{currentUser?.username || 'Player'}</span>! Here's your coding battle performance.
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-gray-600"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* No data message */}
        {userStats.totalMatches === 0 && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8 text-center">
            <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No Match Data Yet</h3>
            <p className="text-gray-400">Start playing matches to see your analytics and statistics!</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Trophy}
            title="Total Matches"
            value={userStats.totalMatches}
            subtitle={`${userStats.wins} wins, ${userStats.losses} losses`}
          />
          <StatCard
            icon={Target}
            title="Win Rate"
            value={`${userStats.winRate}%`}
            subtitle={`${userStats.currentStreak} win streak`}
            color="green"
          />
          <StatCard
            icon={Award}
            title="Best Score"
            value={userStats.bestScore}
            subtitle={`Avg: ${userStats.averageScore}`}
            color="blue"
          />
          <StatCard
            icon={Clock}
            title="Rating"
            value={userStats.rating}
            subtitle={`Rank #${userStats.currentRank}`}
            color="purple"
          />
        </div>

        {/* Charts Grid */}
        {userStats.totalMatches > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Over Time */}
            {performanceData.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                  Performance Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="week" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="avgScore" 
                      stroke="#f97316" 
                      fill="#f97316" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Language Distribution */}
            {languageStats.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-orange-500" />
                  Language Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={languageStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, matches}) => `${name}: ${matches}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="matches"
                    >
                      {languageStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Language Performance Table */}
        {languageStats.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-orange-500" />
              Language Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 text-gray-300">Language</th>
                    <th className="pb-3 text-gray-300">Matches</th>
                    <th className="pb-3 text-gray-300">Wins</th>
                    <th className="pb-3 text-gray-300">Win Rate</th>
                    <th className="pb-3 text-gray-300">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {languageStats.map((lang, index) => (
                    <tr key={index} className="border-b border-gray-700/50">
                      <td className="py-4 font-medium text-white">{lang.name}</td>
                      <td className="py-4 text-gray-300">{lang.matches}</td>
                      <td className="py-4 text-green-400">{lang.wins || 0}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          (lang.winRate || 0) >= 70 ? 'bg-green-500/20 text-green-400' :
                          (lang.winRate || 0) >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {lang.winRate || 0}%
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              (lang.winRate || 0) >= 70 ? 'bg-green-500' :
                              (lang.winRate || 0) >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(lang.winRate || 0, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Activity & Match History */}
        {(recentActivity.length > 0 || matchHistory.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        activity.type === 'match' ? 'bg-orange-500' :
                        activity.type === 'achievement' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.description}</p>
                        <p className="text-gray-400 text-xs">{activity.time}</p>
                        {activity.score && (
                          <p className="text-orange-400 text-xs">Score: {activity.score}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Match History */}
            {matchHistory.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Recent Matches</h3>
                <div className="space-y-3">
                  {matchHistory.map((match, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          match.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="text-white text-sm font-medium">vs {match.opponent}</p>
                          <p className="text-gray-400 text-xs">{match.language} • {match.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          match.result === 'win' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {match.result.toUpperCase()}
                        </p>
                        <p className="text-gray-400 text-xs">Score: {match.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

       
      </div>
    </div>
  );
};

export default AnalyticsDashboard;