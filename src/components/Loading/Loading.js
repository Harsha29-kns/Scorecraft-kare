import React from 'react';
import './Loading.css';
import loadingGif from '../assets/loading.gif'; // Assuming you place the GIF in an assets folder

const Loading = () => {
  return (
    <div className="loading-overlay">
      <img src={loadingGif} alt="Loading..." className="loading-gif" />
    </div>
  );
};

export default Loading;