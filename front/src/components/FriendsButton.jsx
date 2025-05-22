// src/components/FriendsButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FriendsButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/friends');
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
    >
      Mis Amigos
    </button>
  );
};

export default FriendsButton;
