import React from 'react';
import { Song } from '../types';

interface MainTurntableProps {
  isPlaying: boolean;
  currentSong: Song | null;
}

const MainTurntable: React.FC<MainTurntableProps> = ({ isPlaying, currentSong }) => {
  return (
    <div className="relative flex items-center justify-center mb-8">
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-purple-500/10 to-transparent rounded-full blur-2xl"></div>
      <div className={`relative w-80 h-80 rounded-full bg-gradient-to-r from-purple-900 via-black to-blue-900 border-4 border-cyan-400 shadow-[0_0_80px_#00ffff] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
        <div className="absolute inset-6 rounded-full bg-gradient-to-r from-purple-800 to-blue-800 border-2 border-fuchsia-500"></div>
        <div className="absolute inset-16 rounded-full bg-black border border-cyan-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-400 shadow-[0_0_30px_#ffff00] z-10"></div>
        
        {/* Brazo del tocadiscos */}
        <div className={`absolute top-8 right-8 w-1 h-32 bg-gradient-to-b from-cyan-400 to-fuchsia-400 rounded-full shadow-[0_0_15px_#00ffff] transform-gpu transition-transform duration-1000 ${isPlaying ? 'rotate-12' : 'rotate-0'}`} style={{transformOrigin: 'top center'}}></div>
        
        {/* Líneas del vinilo */}
        <div className="absolute inset-20 rounded-full border border-purple-500/30"></div>
        <div className="absolute inset-24 rounded-full border border-purple-500/20"></div>
        <div className="absolute inset-28 rounded-full border border-purple-500/10"></div>
      </div>
      
      {currentSong && (
        <div className="absolute -bottom-16 text-center">
          <div className="text-cyan-400 font-bold text-2xl drop-shadow-[0_0_15px_#00ffff] animate-pulse mb-2 truncate">
            {currentSong.name}
          </div>
         
        </div>
      )}
    </div>
  );
};

export default MainTurntable;