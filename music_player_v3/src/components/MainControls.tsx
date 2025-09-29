import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Heart } from 'lucide-react';

interface MainControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentPlaylist: any;
}

const MainControls: React.FC<MainControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  currentPlaylist
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* Información de la canción actual */}
      {currentPlaylist && (
        <div className="text-center mb-8 max-w-sm">
          
        </div>
      )}

      {/* Controles Principales */}
      <div className="flex justify-center items-center gap-6">
        <button
          onClick={() => alert('🎵 Usa la opción "Detectar Canción" desde el sidebar para analizar audio en tiempo real')}
          className="p-4 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 border-2 border-yellow-400 hover:border-white hover:shadow-[0_0_40px_#ffff00] transition-all duration-300 transform hover:scale-110"
        >
          <Music className="w-6 h-6 text-yellow-200" />
        </button>

        <button
          onClick={onPrevious}
          className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 border-2 border-fuchsia-500 hover:border-yellow-400 hover:shadow-[0_0_40px_#ff00ff] transition-all duration-300 transform hover:scale-110"
        >
          <SkipBack className="w-6 h-6 text-fuchsia-400" />
        </button>

        <button
          onClick={isPlaying ? onPause : onPlay}
          className="p-6 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 border-4 border-cyan-400 hover:border-yellow-400 hover:shadow-[0_0_60px_#00ffff] transition-all duration-300 transform hover:scale-110"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-cyan-300" />
          ) : (
            <Play className="w-8 h-8 text-cyan-300 ml-1" />
          )}
        </button>

        <button
          onClick={onNext}
          className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 border-2 border-fuchsia-500 hover:border-yellow-400 hover:shadow-[0_0_40px_#ff00ff] transition-all duration-300 transform hover:scale-110"
        >
          <SkipForward className="w-6 h-6 text-fuchsia-400" />
        </button>

        <button className="p-4 rounded-full bg-gradient-to-r from-red-600 to-pink-600 border-2 border-pink-400 hover:border-white hover:shadow-[0_0_40px_#ff1493] transition-all duration-300 transform hover:scale-110">
          <Heart className="w-6 h-6 text-pink-200" />
        </button>
      </div>
    </div>
  );
};

export default MainControls;