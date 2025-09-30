import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Heart } from 'lucide-react';

interface MainControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentPlaylist: any;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const MainControls: React.FC<MainControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  currentPlaylist,
  currentTime,
  duration,
  onSeek
}) => {
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      {/* Información de la canción actual */}
      {currentPlaylist && (
        <div className="text-center mb-6 max-w-sm">
          <div className="text-cyan-500 text-xs mt-2">
            Playlist: {currentPlaylist.name}
          </div>
        </div>
      )}

      {/* Controles Principales */}
      <div className="flex justify-center items-center gap-6 mb-6">
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

      {/* Barra de Reproducción Retro */}
      <div className="w-full max-w-md">
        {/* Tiempos */}
        <div className="flex justify-between text-sm text-cyan-400 mb-2 font-mono">
          <span className="drop-shadow-[0_0_5px_#00ffff]">{formatTime(currentTime)}</span>
          <span className="drop-shadow-[0_0_5px_#00ffff]">{formatTime(duration)}</span>
        </div>

        {/* Barra de Progreso */}
        <div 
          className="relative h-3 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full border-2 border-cyan-400/50 cursor-pointer overflow-hidden group hover:border-yellow-400 transition-all duration-300"
          onClick={handleProgressClick}
        >
          {/* Progreso Actual */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 rounded-full shadow-[0_0_15px_#00ffff] transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          ></div>

          {/* Indicador de Posición */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-[0_0_20px_#ffff00] transition-all duration-100 opacity-0 group-hover:opacity-100"
            style={{ left: `calc(${progressPercentage}% - 8px)` }}
          ></div>

          {/* Efecto de brillo al hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Indicador de Porcentaje */}
        <div className="text-center mt-2">
          <span className="text-xs text-fuchsia-400 font-mono">
            {duration > 0 ? `${Math.round(progressPercentage)}%` : '0%'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainControls;