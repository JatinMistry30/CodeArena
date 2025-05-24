import { db } from "../DB/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

export const register = async (req, res) => {
  const { username, email, password, mobile_number } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const query = `
        INSERT INTO users (username, email, password, mobile_number)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        query,
        [username, email, hashedPassword, mobile_number],
        (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
          }

          res.status(201).json({ message: "User registered successfully" });
        }
      );
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required" });
  }
  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: "24h" }
        );
        res.cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: COOKIE_MAX_AGE,
        });
        res.status(200).json({
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("auth_token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const FetchLanguages = async (req, res) => {
  try {
    db.query("SELECT * FROM languages", (err, results) => {
      if (err) {
        console.error("Error fetching languages:", err);
        return res.status(500).json({ message: "Error fetching languages" });
      }
      res.status(200).json(results);
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Unexpected server error" });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.id;

    db.query(
      "SELECT id, username, email, mobile_number, created_at FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(results[0]);
      }
    );
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Server error" });
  }
}
export const storeMatchResult = async (matchId, winnerId, loserId, scores, language) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO matches 
      (match_id, winner_id, loser_id, scores, language, completed_at) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    
    db.query(
      query,
      [matchId, winnerId, loserId, JSON.stringify(scores), language],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

export const updateUserStats = async (userId, isWinner) => {
  return new Promise((resolve, reject) => {
    const fieldToUpdate = isWinner ? 'wins' : 'losses';
    const query = `
      UPDATE users 
      SET ${fieldToUpdate} = ${fieldToUpdate} + 1, 
          rating = rating + ${isWinner ? 10 : -5} 
      WHERE id = ?
    `;
    
    db.query(query, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.id; // From auth middleware

    // Get basic user stats
    const userStatsQuery = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.wins,
        u.losses,
        u.rating,
        u.created_at,
        (u.wins + u.losses) as total_matches,
        CASE 
          WHEN (u.wins + u.losses) > 0 
          THEN ROUND((u.wins / (u.wins + u.losses)) * 100, 1)
          ELSE 0 
        END as win_rate
      FROM users u 
      WHERE u.id = ?
    `;

    db.query(userStatsQuery, [userId], async (err, userResults) => {
      if (err) {
        console.error("Error fetching user stats:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = userResults[0];

      try {
        // Get match history with opponent names
        const matchHistory = await getMatchHistory(userId);
        
        // Get language statistics
        const languageStats = await getLanguageStats(userId);
        
        // Get performance data over time
        const performanceData = await getPerformanceData(userId);
        
        // Get recent activity
        const recentActivity = await getRecentActivity(userId);
        
        // Calculate additional stats
        const additionalStats = await getAdditionalStats(userId);

        // Combine all data
        const analytics = {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at
          },
          stats: {
            totalMatches: user.total_matches,
            wins: user.wins,
            losses: user.losses,
            winRate: user.win_rate,
            rating: user.rating,
            ...additionalStats
          },
          matchHistory,
          languageStats,
          performanceData,
          recentActivity
        };

        res.status(200).json(analytics);

      } catch (error) {
        console.error("Error processing analytics data:", error);
        res.status(500).json({ error: "Error processing analytics data" });
      }
    });

  } catch (error) {
    console.error("Error in getUserAnalytics:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Helper function to get match history
const getMatchHistory = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        m.completed_at as date,
        m.language,
        m.scores,
        m.winner_id,
        m.loser_id,
        CASE 
          WHEN m.winner_id = ? THEN 'win'
          ELSE 'loss'
        END as result,
        CASE 
          WHEN m.winner_id = ? THEN u2.username
          ELSE u1.username
        END as opponent,
        JSON_EXTRACT(m.scores, CONCAT('$."', ?, '"')) as user_score
      FROM matches m
      LEFT JOIN users u1 ON m.winner_id = u1.id
      LEFT JOIN users u2 ON m.loser_id = u2.id
      WHERE m.winner_id = ? OR m.loser_id = ?
      ORDER BY m.completed_at DESC
      LIMIT 10
    `;

    db.query(query, [userId, userId, userId, userId, userId], (err, results) => {
      if (err) return reject(err);
      
      const formattedResults = results.map(match => ({
        date: match.date.toISOString().split('T')[0],
        language: match.language,
        result: match.result,
        opponent: match.opponent || 'Unknown',
        score: parseInt(match.user_score) || 0
      }));
      
      resolve(formattedResults);
    });
  });
};

// Helper function to get language statistics
const getLanguageStats = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        language,
        COUNT(*) as matches,
        SUM(CASE WHEN winner_id = ? THEN 1 ELSE 0 END) as wins,
        ROUND(
          (SUM(CASE WHEN winner_id = ? THEN 1 ELSE 0 END) / COUNT(*)) * 100, 
          1
        ) as win_rate
      FROM matches 
      WHERE winner_id = ? OR loser_id = ?
      GROUP BY language
      ORDER BY matches DESC
    `;

    db.query(query, [userId, userId, userId, userId], (err, results) => {
      if (err) return reject(err);
      
      const formattedResults = results.map(lang => ({
        name: lang.language,
        matches: lang.matches,
        wins: lang.wins,
        winRate: parseFloat(lang.win_rate) || 0
      }));
      
      resolve(formattedResults);
    });
  });
};

// Helper function to get performance data over time
const getPerformanceData = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        DATE_FORMAT(completed_at, '%Y-%u') as week_year,
        CONCAT('Week ', WEEK(completed_at, 1)) as week,
        COUNT(*) as matches,
        AVG(
          CASE 
            WHEN winner_id = ? THEN JSON_EXTRACT(scores, CONCAT('$."', ?, '"'))
            ELSE JSON_EXTRACT(scores, CONCAT('$."', ?, '"'))
          END
        ) as avg_score
      FROM matches 
      WHERE winner_id = ? OR loser_id = ?
      AND completed_at >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
      GROUP BY week_year
      ORDER BY week_year ASC
    `;

    db.query(query, [userId, userId, userId, userId, userId], (err, results) => {
      if (err) return reject(err);
      
      const formattedResults = results.map(week => ({
        week: week.week,
        matches: week.matches,
        avgScore: Math.round(parseFloat(week.avg_score) || 0)
      }));
      
      resolve(formattedResults);
    });
  });
};

// Helper function to get recent activity
const getRecentActivity = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        'match' as type,
        CASE 
          WHEN m.winner_id = ? THEN CONCAT('Won against ', u2.username)
          ELSE CONCAT('Lost to ', u1.username)
        END as description,
        m.completed_at as time,
        JSON_EXTRACT(m.scores, CONCAT('$."', ?, '"')) as score
      FROM matches m
      LEFT JOIN users u1 ON m.winner_id = u1.id
      LEFT JOIN users u2 ON m.loser_id = u2.id
      WHERE m.winner_id = ? OR m.loser_id = ?
      ORDER BY m.completed_at DESC
      LIMIT 5
    `;

    db.query(query, [userId, userId, userId, userId], (err, results) => {
      if (err) return reject(err);
      
      const formattedResults = results.map(activity => ({
        type: activity.type,
        description: activity.description,
        time: getTimeAgo(activity.time),
        score: parseInt(activity.score) || 0
      }));
      
      resolve(formattedResults);
    });
  });
};

// Helper function to get additional stats
const getAdditionalStats = (userId) => {
  return new Promise((resolve, reject) => {
    const queries = [
      // Best score
      `SELECT MAX(JSON_EXTRACT(scores, CONCAT('$."', ?, '"'))) as best_score
       FROM matches WHERE winner_id = ? OR loser_id = ?`,
      
      // Average score
      `SELECT AVG(JSON_EXTRACT(scores, CONCAT('$."', ?, '"'))) as avg_score
       FROM matches WHERE winner_id = ? OR loser_id = ?`,
      
      // Current win streak
      `SELECT COUNT(*) as current_streak FROM (
        SELECT winner_id, completed_at 
        FROM matches 
        WHERE winner_id = ? OR loser_id = ?
        ORDER BY completed_at DESC
        LIMIT 10
      ) recent WHERE winner_id = ?`,
      
      // Favorite language (most played)
      `SELECT language as favorite_language 
       FROM matches 
       WHERE winner_id = ? OR loser_id = ?
       GROUP BY language 
       ORDER BY COUNT(*) DESC 
       LIMIT 1`,
       
      // Total play time (estimate based on matches)
      `SELECT COUNT(*) * 15 as total_play_time 
       FROM matches 
       WHERE winner_id = ? OR loser_id = ?`,
       
      // Current rank (based on rating)
      `SELECT COUNT(*) + 1 as current_rank 
       FROM users 
       WHERE rating > (SELECT rating FROM users WHERE id = ?)`
    ];

    const promises = queries.map((query, index) => {
      return new Promise((res, rej) => {
        let params;
        switch(index) {
          case 0: case 1: // best_score, avg_score
            params = [userId, userId, userId];
            break;
          case 2: // current_streak
            params = [userId, userId, userId];
            break;
          case 3: case 4: // favorite_language, total_play_time
            params = [userId, userId];
            break;
          case 5: // current_rank
            params = [userId];
            break;
          default:
            params = [userId];
        }
        
        db.query(query, params, (err, results) => {
          if (err) return rej(err);
          res(results[0] || {});
        });
      });
    });

    Promise.all(promises)
      .then(results => {
        const [bestScore, avgScore, streak, favLang, playTime, rank] = results;
        
        resolve({
          bestScore: parseInt(bestScore.best_score) || 0,
          averageScore: Math.round(parseFloat(avgScore.avg_score) || 0),
          currentStreak: streak.current_streak || 0,
          favoriteLanguage: favLang.favorite_language || 'N/A',
          totalPlayTime: playTime.total_play_time || 0,
          currentRank: rank.current_rank || 1
        });
      })
      .catch(reject);
  });
};

// Helper function to format time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

// Get leaderboard data
export const getLeaderboard = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.wins,
        u.losses,
        u.rating,
        (u.wins + u.losses) as total_matches,
        CASE 
          WHEN (u.wins + u.losses) > 0 
          THEN ROUND((u.wins / (u.wins + u.losses)) * 100, 1)
          ELSE 0 
        END as win_rate
      FROM users u
      WHERE (u.wins + u.losses) > 0
      ORDER BY u.rating DESC, u.wins DESC
      LIMIT 50
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching leaderboard:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const leaderboard = results.map((user, index) => ({
        rank: index + 1,
        id: user.id,
        username: user.username,
        wins: user.wins,
        losses: user.losses,
        totalMatches: user.total_matches,
        winRate: user.win_rate,
        rating: user.rating
      }));

      res.status(200).json(leaderboard);
    });

  } catch (error) {
    console.error("Error in getLeaderboard:", error);
    res.status(500).json({ error: "Server error" });
  }
};