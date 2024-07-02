// components/FullscreenLoader.js
import React from 'react';
import { BarLoader } from 'react-spinners';
import './loader.css'

const FullscreenLoader = () => {
  return (
    <div className="fullscreen-loader">
      <BarLoader />
    </div>
  );
};

export default FullscreenLoader;
