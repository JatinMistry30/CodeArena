import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  FetchLanguages,
  login,
  logout,
  register,
  getCurrentUser,
  storeMatchResult,
  updateUserStats,
  getUserAnalytics,
  getLeaderboard
} from "./Routes/Routes.js";
import { authAuthenticate } from "./Middleware/AuthMiddleWare.js";
import { v4 as uuidv4 } from "uuid";
import { generateQuestions } from './utils/questionGenerator.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Request origin:', origin);
      console.log('Allowed CLIENT_URL:', process.env.CLIENT_URL);
      
      if (!origin || origin === process.env.CLIENT_URL) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// API routes
app.post("/api/register", register);
app.post("/api/login", login);
app.post("/api/logout", logout);
app.get("/api/languages", FetchLanguages);
app.get("/api/current-user", authAuthenticate, getCurrentUser);
app.get('/api/analytics' , authAuthenticate , getUserAnalytics)
app.get('/api/leaderboard' , authAuthenticate , getLeaderboard)

app.get("/dashboard", authAuthenticate, (req, res) => {
  res.json({
    message: "You have access to the dashboard",
    user: req.user,
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

const matchmakingQueues = {};
const activeMatches = {};

io.on("connection", (socket) => {
  console.log('Client connected:', socket.id);

  socket.on("joinMatchmaking", ({ language, userId }) => {
    console.log(`User ${userId} joining ${language} queue`);
    
    if (!matchmakingQueues[language]) {
      matchmakingQueues[language] = [];
    }

    const existingUser = matchmakingQueues[language].find(
      (u) => u.userId == userId
    );
    if (existingUser) {
      socket.emit("matchmakingError", { message: "You are already in queue" });
      return;
    }

    matchmakingQueues[language].push({ socketId: socket.id, userId });
    socket.join(`matchmaking_${language}`);

    socket.emit("matchmakingStatus", { status: "searching", language });

    // Check for matches
    checkForMatches(language);
  });

  socket.on("cancelMatchmaking", ({ language, userId }) => {
    if (matchmakingQueues[language]) {
      matchmakingQueues[language] = matchmakingQueues[language].filter(
        (user) => user.userId !== userId
      );
      socket.leave(`matchmaking_${language}`);
      socket.emit("matchmakingStatus", { status: "cancelled" });
      console.log(`User ${userId} left ${language} queue`);
    }
  });

  socket.on('joinMatch', ({ matchId, userId }) => {
    console.log(`User ${userId} trying to join match ${matchId}`);
    
    if (!activeMatches[matchId]) {
      console.error(`Match ${matchId} not found. Active matches:`, Object.keys(activeMatches));
      socket.emit('matchError', { message: 'Match not found' });
      return;
    }

    const match = activeMatches[matchId];
    
    // Check if user is part of this match
    if (!match.participants[userId]) {
      console.error(`User ${userId} not part of match ${matchId}`);
      socket.emit('matchError', { message: 'User not part of this match' });
      return;
    }

    socket.join(`match_${matchId}`);
    match.participants[userId].socketId = socket.id;
    match.participants[userId].connected = true;

    console.log(`User ${userId} joined match ${matchId}`);

    // Check if all players are connected
    const allConnected = Object.values(match.participants).every(p => p.connected);
    console.log(`All players connected: ${allConnected}`);

    if (allConnected) {
      console.log(`Starting match ${matchId}`);
      io.to(`match_${matchId}`).emit('matchReady', {
        matchId,
        question: match.currentQuestion,
        language: match.language,
        participants: match.participants
      });
    }
  });

  socket.on('submitCode', ({ matchId, userId, code, questionId }) => {
    const match = activeMatches[matchId];
    if (!match) {
      console.error(`Match ${matchId} not found for code submission`);
      return;
    }

    console.log(`Code submitted by ${userId} for question ${questionId}`);

    // Store the submission
    match.participants[userId].currentCode = code;
    match.participants[userId].submissions.push({
      questionId,
      code,
      timestamp: Date.now()
    });

    // Check if both players have submitted
    const bothSubmitted = Object.values(match.participants).every(
      p => p.submissions.some(s => s.questionId === questionId)
    );

    if (bothSubmitted) {
      console.log(`Both players submitted for question ${questionId}, evaluating...`);
      evaluateSubmissions(matchId, questionId);
    }
  });

  socket.on('updateCode', ({ matchId, userId, code }) => {
    const match = activeMatches[matchId];
    if (!match) return;

    match.participants[userId].currentCode = code;
    socket.to(`match_${matchId}`).emit('codeUpdated', { userId, code });
  });

  socket.on("disconnect", () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove from matchmaking queues
    Object.keys(matchmakingQueues).forEach((language) => {
      const index = matchmakingQueues[language].findIndex(
        (user) => user.socketId === socket.id
      );
      if (index !== -1) {
        const [user] = matchmakingQueues[language].splice(index, 1);
        console.log(`User ${user.userId} disconnected from ${language} queue`);
        checkForMatches(language);
      }
    });

    // Handle disconnection from active matches
    Object.entries(activeMatches).forEach(([matchId, match]) => {
      const participant = Object.values(match.participants).find(
        p => p.socketId === socket.id
      );
      if (participant) {
        participant.connected = false;
        console.log(`Player ${participant.userId} disconnected from match ${matchId}`);
        
        // Notify other players
        socket.to(`match_${matchId}`).emit('playerDisconnected', {
          userId: participant.userId
        });
      }
    });
  });
});

function checkForMatches(language) {
  const queue = matchmakingQueues[language] || [];
  console.log(`Checking for matches in ${language} queue. Queue size: ${queue.length}`);

  // If we have at least 2 users in queue
  if (queue.length >= 2) {
    const [user1, user2] = queue.splice(0, 2);
    const matchId = uuidv4();

    console.log(`Creating match ${matchId} between ${user1.userId} and ${user2.userId} for ${language}`);

    // Create the match data
    const matchData = {
      matchId,
      language,
      users: [
        { userId: user1.userId, socketId: user1.socketId },
        { userId: user2.userId, socketId: user2.socketId },
      ],
    };

    // Actually create the match in activeMatches - THIS WAS MISSING!
    createMatch(matchData);

    // Emit matchFound to both users
    io.to(user1.socketId)
      .to(user2.socketId)
      .emit("matchFound", matchData);

    console.log(`Match ${matchId} created and emitted to users`);
  }
}

function createMatch(matchData) {
  console.log(`Creating match ${matchData.matchId} for language ${matchData.language}`);
  
  try {
    const questions = generateQuestions(matchData.language, 3); // Generate 3 questions
    const participants = {};
    
    matchData.users.forEach(user => {
      participants[user.userId] = {
        userId: user.userId,
        socketId: user.socketId,
        username: user.username || null, // Add username if available
        connected: false,
        score: 0,
        submissions: [],
        currentCode: ''
      };
    });

    activeMatches[matchData.matchId] = {
      matchId: matchData.matchId,
      participants,
      language: matchData.language,
      questions,
      currentQuestionIndex: 0,
      currentQuestion: questions[0],
      startTime: Date.now(),
      status: 'waiting' // Start as waiting for players to join
    };

    console.log(`Match ${matchData.matchId} created successfully`);
  } catch (error) {
    console.error(`Error creating match ${matchData.matchId}:`, error);
  }
}

async function evaluateSubmissions(matchId, questionId) {
  const match = activeMatches[matchId];
  if (!match) return;

  console.log(`Evaluating submissions for match ${matchId}, question ${questionId}`);

  // Evaluate submissions (in a real app, this would run the code against test cases)
  const evaluationResults = {};
  const participantIds = Object.keys(match.participants);
  
  // For demo purposes, we'll give random scores
  participantIds.forEach(userId => {
    const score = Math.floor(Math.random() * 100);
    match.participants[userId].score += score;
    evaluationResults[userId] = score;
  });

  // Notify players of evaluation results
  io.to(`match_${matchId}`).emit('evaluationResults', {
    questionId,
    results: evaluationResults
  });

  // Move to next question or end match
  match.currentQuestionIndex++;
  if (match.currentQuestionIndex < match.questions.length) {
    match.currentQuestion = match.questions[match.currentQuestionIndex];
    console.log(`Moving to question ${match.currentQuestionIndex + 1}`);
    
    io.to(`match_${matchId}`).emit('nextQuestion', {
      question: match.currentQuestion,
      scores: getCurrentScores(match)
    });
  } else {
    console.log(`Match ${matchId} completed`);
    await endMatch(matchId, 'All questions completed');
  }
}
function getCurrentScores(match) {
  return Object.entries(match.participants).reduce((acc, [userId, participant]) => {
    acc[userId] = participant.score;
    return acc;
  }, {});
}

async function endMatch(matchId, reason) {
  const match = activeMatches[matchId];
  if (!match) return;

  console.log(`Ending match ${matchId}: ${reason}`);

  // Determine winner and loser
  const participants = Object.values(match.participants);
  const scores = getCurrentScores(match);
  
  // Sort participants by score (descending)
  participants.sort((a, b) => scores[b.userId] - scores[a.userId]);
  
  const winner = participants[0];
  const loser = participants[1];
  const isDraw = participants.length > 1 && scores[winner.userId] === scores[loser.userId];

  try {
    if (!isDraw && participants.length > 1) {
      await storeMatchResult(
        matchId,
        winner.userId,
        loser.userId,
        scores,
        match.language
      );
      
      // Update user stats
      await updateUserStats(winner.userId, true);
      await updateUserStats(loser.userId, false);
    } else {
      // Handle draw or single player case
      await storeMatchResult(
        matchId,
        null, // No winner
        null, // No loser
        scores,
        match.language
      );
    }
  } catch (error) {
    console.error('Error saving match results:', error);
    // Even if saving fails, continue with ending the match
  }

  // Notify players
  match.status = 'completed';
  io.to(`match_${matchId}`).emit('matchEnded', {
    reason,
    finalScores: scores,
    winnerId: isDraw ? null : winner?.userId || null,
    isDraw
  });

  // Clean up after delay
  setTimeout(() => {
    console.log(`Cleaning up match ${matchId}`);
    delete activeMatches[matchId];
  }, 60000);
}
function handlePlayerDisconnect(matchId, disconnectedUserId) {
  const match = activeMatches[matchId];
  if (!match || match.status !== 'active') return;

  const remainingPlayer = Object.values(match.participants).find(
    p => p.userId !== disconnectedUserId && p.connected
  );

  if (remainingPlayer) {
    // End the match with the remaining player as winner
    endMatch(matchId, 'Opponent disconnected')
      .then(() => {
        console.log(`Match ${matchId} ended due to disconnect`);
      })
      .catch(error => {
        console.error('Error ending match after disconnect:', error);
      });
  }
}
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});