import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useSocket } from './SocketContext';

const MatchArena = ({ match, onBackToMatchmaking }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [scores, setScores] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [matchStatus, setMatchStatus] = useState('starting');
  const [players, setPlayers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [winnerId, setWinnerId] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState('coding');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions] = useState(5);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const editorRef = useRef(null);
  const timerRef = useRef(null);
  
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !match) {
      console.error('Socket or match not available');
      onBackToMatchmaking();
      return;
    }

    const user = match.users.find(u => u.socketId === socket.id);
    if (!user) {
      console.error('Current user not found in match participants');
      onBackToMatchmaking();
      return;
    }

    setCurrentUser(user);

    socket.emit('joinMatch', {
      matchId: match.matchId,
      userId: user.userId
    });

    const onMatchReady = (data) => {
      setCurrentQuestion(data.question);
      setPlayers(data.participants);
      setMatchStatus('active');
      setQuestionNumber(1);
      startTimer();
      triggerPulse();
    };

    const onNextQuestion = (data) => {
      setCurrentQuestion(data.question);
      setScores(data.scores);
      setCode('');
      setSubmissionStatus(null);
      setOpponentStatus('coding');
      setQuestionNumber(prev => prev + 1);
      setQuestionsAttempted(prev => prev + 1);
      triggerPulse();
    };

    const onPlayerDisconnected = (data) => {
      setConnectionStatus('disconnected');
      setMatchStatus('opponent_left');
      setTimeout(() => {
        setMatchStatus('ended');
        setWinnerId(user.userId);
        setScores(prev => ({
          ...prev,
          [user.userId]: (prev[user.userId] || 0) + 500
        }));
      }, 3000);
    };

    const onSubmissionReceived = (data) => {
      if (data.userId === user.userId) {
        setSubmissionStatus('submitted');
        setOpponentStatus('coding');
      } else {
        setOpponentStatus('submitted');
      }
    };

    const onEvaluationResults = (data) => {
      setSubmissionStatus('evaluated');
      setOpponentStatus('evaluated');
      setIsSubmitting(false);
      
      if (data.results && currentUser) {
        const userScore = calculateScore(
          data.results[currentUser.userId] || 0,
          data.accuracy,
          data.submissionTime,
          currentQuestion.difficulty
        );
        
        setScores(prev => ({
          ...prev,
          [currentUser.userId]: (prev[currentUser.userId] || 0) + userScore
        }));
      }
    };

    const onMatchEnded = (data) => {
      clearInterval(timerRef.current);
      setMatchStatus('ended');
      setScores(data.finalScores);
      setWinnerId(data.winnerId);
      setIsDraw(data.isDraw);
      
      const matchHistory = JSON.parse(localStorage.getItem('matchHistory') || '[]');
      matchHistory.unshift({
        matchId: match.matchId,
        date: new Date().toISOString(),
        language: match.language,
        scores: data.finalScores,
        winnerId: data.winnerId,
        isDraw: data.isDraw,
        questionsAttempted: questionsAttempted + 1
      });
      localStorage.setItem('matchHistory', JSON.stringify(matchHistory));
    };

    const onMatchError = (error) => {
      console.error('Match error:', error);
      onBackToMatchmaking();
    };

    socket.on('matchReady', onMatchReady);
    socket.on('nextQuestion', onNextQuestion);
    socket.on('playerDisconnected', onPlayerDisconnected);
    socket.on('submissionReceived', onSubmissionReceived);
    socket.on('evaluationResults', onEvaluationResults);
    socket.on('matchEnded', onMatchEnded);
    socket.on('matchError', onMatchError);

    return () => {
      socket.off('matchReady', onMatchReady);
      socket.off('nextQuestion', onNextQuestion);
      socket.off('playerDisconnected', onPlayerDisconnected);
      socket.off('submissionReceived', onSubmissionReceived);
      socket.off('evaluationResults', onEvaluationResults);
      socket.off('matchEnded', onMatchEnded);
      socket.off('matchError', onMatchError);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [socket, match, onBackToMatchmaking, questionsAttempted, currentQuestion]);

  const triggerPulse = () => {
    setPulseAnimation(true);
    setTimeout(() => setPulseAnimation(false), 1000);
  };

  const calculateScore = (basePoints, accuracy, submissionTimestamp, difficulty) => {
    const timeFactor = calculateTimeFactor(submissionTimestamp);
    const accuracyFactor = accuracy / 100;
    const difficultyMultiplier = getDifficultyMultiplier(difficulty);
    
    return Math.round(basePoints * timeFactor * accuracyFactor * difficultyMultiplier);
  };

  const calculateTimeFactor = (submissionTimestamp) => {
    if (!submissionTimestamp) return 1;
    
    const timeTaken = (Date.now() - submissionTimestamp) / 1000;
    const maxTime = 600;
    const timePercentage = Math.max(0, 1 - (timeTaken / maxTime));
    
    return 0.5 + timePercentage;
  };

  const getDifficultyMultiplier = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 1.5;
      case 'hard': return 2.5;
      default: return 1;
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTimeLeft(600);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCodeChange = (value) => {
    if (!currentUser || !socket) return;
    setCode(value);
  };

  const submitCode = () => {
    if (!currentQuestion || !currentUser || !socket || isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmissionStatus('submitting');
    
    socket.emit('submitCode', {
      matchId: match.matchId,
      userId: currentUser.userId,
      code,
      questionId: currentQuestion.id,
      difficulty: currentQuestion.difficulty,
      submissionTime: Date.now()
    });

    setTimeout(() => {
      setSubmissionStatus('submitted');
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getOpponent = () => {
    if (!currentUser) return null;
    return Object.values(players).find(p => p.userId !== currentUser.userId);
  };

  const getPointRules = () => {
    return [
      { rule: "Base Points", easy: "100", medium: "150", hard: "250" },
      { rule: "Speed Bonus", easy: "0.5x-1.5x", medium: "0.5x-1.5x", hard: "0.5x-1.5x" },
      { rule: "Difficulty Multiplier", easy: "1x", medium: "1.5x", hard: "2.5x" },
      { rule: "Accuracy Factor", easy: "0-100%", medium: "0-100%", hard: "0-100%" },
      { rule: "Opponent Leaves", easy: "+500", medium: "+500", hard: "+500" }
    ];
  };

  const renderStatusIndicator = () => {
    const getStatusInfo = () => {
      switch (submissionStatus) {
        case 'submitting':
          return { text: 'Submitting Solution...', color: 'text-blue-400', icon: '⏳' };
        case 'submitted':
          return { text: 'Solution Submitted! Waiting for opponent...', color: 'text-green-400', icon: '✅' };
        case 'evaluated':
          return { text: 'Round Complete!', color: 'text-purple-400', icon: '🎯' };
        default:
          return { text: 'Solve the problem and submit your solution', color: 'text-gray-400', icon: '💡' };
      }
    };

    const status = getStatusInfo();

    return (
      <div className={`bg-gray-800 p-4 rounded-lg mb-4 border-l-4 ${
        submissionStatus === 'submitted' ? 'border-green-500' : 
        submissionStatus === 'submitting' ? 'border-blue-500' : 
        'border-gray-600'
      } transition-all duration-500`}>
        <div className="flex items-center space-x-3">
          <span className="text-2xl animate-pulse">{status.icon}</span>
          <div>
            <p className={`font-medium ${status.color}`}>{status.text}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
              <span>You: {submissionStatus || 'Coding'}</span>
              <span>•</span>
              <span>Opponent: {opponentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={`bg-gray-800 p-6 rounded-lg mb-6 transform transition-all duration-500 ${
        pulseAnimation ? 'scale-105 shadow-2xl' : 'scale-100'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{currentQuestion.title}</h2>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-900 text-green-300' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span className="text-gray-400 text-sm">
                Question {questionNumber} of {totalQuestions}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Points Available</div>
            <div className="text-xl font-bold text-orange-400">
              {getDifficultyMultiplier(currentQuestion.difficulty) * 100}
            </div>
          </div>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed">{currentQuestion.description}</p>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Examples</h3>
            <div className="space-y-3">
              {currentQuestion.examples?.map((example, i) => (
                <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-400">Input:</span>
                      <pre className="text-green-400 mt-1">{example.input}</pre>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400">Output:</span>
                      <pre className="text-blue-400 mt-1">{example.output}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Test Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.testCases?.map((testCase, i) => (
                <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm font-medium text-gray-400 mb-2">Case {i + 1}</div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Input:</span>
                      <pre className="text-green-400 text-sm">{testCase.input}</pre>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Expected:</span>
                      <pre className="text-blue-400 text-sm">{testCase.output}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center bg-gray-700 px-6 py-3 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-mono text-sm ml-4">{match.language}</span>
          </div>
          <button
            onClick={submitCode}
            disabled={!currentQuestion || !code.trim() || isSubmitting}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 transform ${
              isSubmitting 
                ? 'bg-blue-600 cursor-not-allowed scale-95' 
                : !currentQuestion || !code.trim()
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 hover:scale-105 shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Solution'
            )}
          </button>
        </div>
        <MonacoEditor
          height="500px"
          language={match.language.toLowerCase()}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 16,
            fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            automaticLayout: true
          }}
        />
      </div>
    );
  };

  const renderScoreboard = () => {
    const opponent = getOpponent();
    
    if (!currentUser) return null;
    
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
          <h3 className="text-xl font-bold mb-6 text-center text-orange-400">Live Scoreboard</h3>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-900/20 to-orange-800/20 p-4 rounded-lg border border-orange-500/30">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold">
                    {(currentUser.username || 'You').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{currentUser.username || 'You'}</span>
                </div>
                <span className="text-2xl font-bold text-orange-400">{scores[currentUser.userId] || 0}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (scores[currentUser.userId] || 0) / 20)}%` }}
                ></div>
              </div>
            </div>
            
            {opponent && (
              <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 p-4 rounded-lg border border-gray-600">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center font-bold">
                      {(opponent.username || 'Opponent').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{opponent.username || 'Opponent'}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-400">{scores[opponent.userId] || 0}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-gray-500 to-gray-400 h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (scores[opponent.userId] || 0) / 20)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center">
            <div className={`text-4xl font-bold mb-2 ${
              timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-orange-400'
            }`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-400">TIME REMAINING</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  timeLeft < 60 ? 'bg-red-500' : 'bg-orange-500'
                }`}
                style={{ width: `${(timeLeft / 600) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
          <h3 className="text-lg font-bold mb-4 text-orange-400">Match Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Questions Attempted</span>
              <span className="font-bold text-white">{questionsAttempted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Connection Status</span>
              <span className={`font-bold ${
                connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'
              }`}>
                {connectionStatus === 'connected' ? 'Stable' : 'Unstable'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Language</span>
              <span className="font-bold text-white">{match.language}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
          <h3 className="text-lg font-bold mb-4 text-orange-400">Scoring Rules</h3>
          <div className="space-y-3 text-sm">
            {getPointRules().map((rule, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 py-2 border-b border-gray-700 last:border-b-0">
                <span className="text-gray-400 font-medium">{rule.rule}</span>
                <span className="text-green-400 text-center">{rule.easy}</span>
                <span className="text-yellow-400 text-center">{rule.medium}</span>
                <span className="text-red-400 text-center">{rule.hard}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Final Score = Base × Speed × Accuracy × Difficulty
          </div>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-orange-400 mb-3">Initializing Match</h2>
          <p className="text-gray-300">Setting up your coding arena...</p>
        </div>
      </div>
    );
  }

  if (matchStatus === 'starting') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-orange-400 mb-3">Match Starting</h2>
          <p className="text-gray-300">Preparing your coding challenge...</p>
          <div className="mt-6 bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">Connected Players</div>
            <div className="space-y-2">
              {Object.values(players).map(player => (
                <div key={player.userId} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{player.username || 'Anonymous'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (matchStatus === 'opponent_left') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 text-6xl mb-6">🏆</div>
          <h2 className="text-3xl font-bold text-green-400 mb-4">You Win!</h2>
          <p className="text-gray-300 mb-6">Your opponent has left the match</p>
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <div className="text-lg font-bold text-orange-400 mb-2">Bonus Points Awarded</div>
            <div className="text-3xl font-bold text-green-400">+500</div>
          </div>
          <div className="text-sm text-gray-400">Redirecting to results...</div>
        </div>
      </div>
    );
  }

  if (matchStatus === 'ended') {
    const opponent = getOpponent();
    const userScore = scores[currentUser.userId] || 0;
    const opponentScore = opponent ? scores[opponent.userId] || 0 : 0;
    const isUserWinner = winnerId === currentUser.userId;
    
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl p-10 max-w-lg w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {isDraw ? '🤝' : isUserWinner ? '🏆' : '🎯'}
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${
              isDraw ? 'text-yellow-400' : 
              isUserWinner ? 'text-green-400' : 'text-orange-400'
            }`}>
              {isDraw ? 'Draw Match!' : 
               isUserWinner ? 'Victory!' : 'Match Complete'}
            </h1>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-700 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-center mb-6 text-orange-400">Final Scoreboard</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                  <span className="font-medium">{currentUser.username || 'You'}</span>
                  <span className="text-2xl font-bold text-orange-400">{userScore}</span>
                </div>
                {opponent && (
                  <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                    <span className="font-medium">{opponent.username || 'Opponent'}</span>
                    <span className="text-2xl font-bold text-gray-400">{opponentScore}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-400">{questionsAttempted}</div>
                  <div className="text-sm text-gray-400">Questions Solved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">{match.language}</div>
                  <div className="text-sm text-gray-400">Language Used</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onBackToMatchmaking}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Return to Matchmaking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-orange-400">CodeArena</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Live Match</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                {match.language}
              </div>
              <div className="bg-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                vs {getOpponent()?.username || 'Opponent'}
              </div>
              <button
                onClick={onBackToMatchmaking}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Leave Match
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {renderStatusIndicator()}
            {renderQuestion()}
            {renderEditor()}
          </div>
          
          <div className="xl:col-span-1">
            {renderScoreboard()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchArena;