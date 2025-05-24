import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col gap-5 items-center justify-center text-white">
      <h1 className="text-3xl">Landing Page</h1>
      <button
        onClick={() => navigate('/login')}
        className="p-4 text-lg bg-[#FF5722] rounded shadow"
      >
        Go To Login
      </button>
    </div>
  );
};

export default LandingPage;
