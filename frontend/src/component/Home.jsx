// component/Home.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../component/Sidebar';
import MessageContainer from '../component/MessageContainer';

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        isMobile={isMobile} 
        showChat={showChat} 
        setShowChat={setShowChat} 
      />
      <MessageContainer 
        isMobile={isMobile} 
        showChat={showChat} 
        setShowChat={setShowChat} 
      />
    </div>
  );
};

export default Home;