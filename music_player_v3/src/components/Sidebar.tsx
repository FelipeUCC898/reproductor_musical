import React, { useState, useRef } from 'react';
import { Home, Plus, Music, Disc3, List, Trash2 } from 'lucide-react';
import { Playlist } from '../types';

interface SidebarProps {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  onCreatePlaylist: (name: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onDeletePlaylist: (playlist: Playlist) => void;
  onAddSongs: (files: FileList) => void;
  onShazamDetect: () => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({
  playlists,
  currentPlaylist,
  onCreatePlaylist,
  onSelectPlaylist,
  onDeletePlaylist,
  onAddSongs,
  onShazamDetect
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowInput(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAddSongs(e.target.files);
    }
  };

  const handleShazamDetect = async () => {
    if (!currentPlaylist) {
      alert('❌ Selecciona una playlist primero');
      return;
    }

    setIsDetecting(true);
    try {
      await onShazamDetect();
    } catch (error) {
      console.error('Error detecting song:', error);
    } finally {
      setIsDetecting(false);
      setCountdown(0);
    }
  };

  // Función para actualizar el countdown desde el componente padre
  React.useEffect(() => {
    const handleCountdownUpdate = (event: CustomEvent) => {
      setCountdown(event.detail);
    };

    window.addEventListener('shazamCountdown', handleCountdownUpdate as EventListener);
    return () => {
      window.removeEventListener('shazamCountdown', handleCountdownUpdate as EventListener);
    };
  }, []);

  const getDetectButtonContent = () => {
    if (countdown > 0) {
      return (
        <>
          <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          <span>Grabando {countdown}s</span>
        </>
      );
    } else if (isDetecting) {
      return (
        <>
          <Music className="w-5 h-5 animate-pulse" />
          <span>Analizando...</span>
        </>
      );
    } else {
      return (
        <>
          <Music className="w-5 h-5" />
          <span>Detectar Canción</span>
        </>
      );
    }
  };

  return (
    <div className="w-80 h-screen bg-gradient-to-b from-purple-900/80 to-black/90 border-r-2 border-cyan-400/30 backdrop-blur-sm flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Logo y Header */}
      <div className="p-6 border-b border-cyan-400/30">
        <div className="flex items-center gap-3 mb-6">
          <Disc3 className="w-8 h-8 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            RETRO BEATS
          </h1>
        </div>

        {/* Navegación Principal */}
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-400/50 text-cyan-300 hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300">
            <Home className="w-5 h-5" />
            <span>Inicio</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-fuchsia-400/50 text-fuchsia-300 hover:border-yellow-400 hover:text-yellow-400 hover:shadow-[0_0_20px_#ffff00] transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Música</span>
          </button>
          <button 
            onClick={handleShazamDetect}
            disabled={isDetecting || countdown > 0}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
              isDetecting || countdown > 0
                ? 'border-green-400 text-green-400 bg-green-400/10 cursor-not-allowed'
                : 'border-green-400/50 text-green-300 hover:border-yellow-400 hover:text-yellow-400 hover:shadow-[0_0_20px_#00ff41]'
            }`}
          >
            {getDetectButtonContent()}
          </button>
          {(isDetecting || countdown > 0) && (
            <div className="text-center text-xs text-green-400/80 px-3">
              {countdown > 0 ? '🎤 Escuchando ambiente...' : '🔍 Identificando canción...'}
            </div>
          )}
        </div>
      </div>

      {/* Lista de Playlists */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-fuchsia-400 flex items-center gap-2">
            <List className="w-5 h-5" />
            Tus Playlists
          </h2>
        </div>

        <div className="space-y-2 mb-6">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="group flex items-center justify-between">
              <button
                onClick={() => onSelectPlaylist(playlist)}
                className={`flex-1 flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  currentPlaylist?.id === playlist.id
                    ? 'bg-gradient-to-r from-fuchsia-600/30 to-cyan-600/30 border-yellow-400 text-yellow-400 shadow-[0_0_15px_#ffff00]'
                    : 'border-fuchsia-600/30 text-fuchsia-300 hover:border-cyan-400/50 hover:text-cyan-300 hover:bg-purple-800/20'
                }`}
              >
                <Music className="w-4 h-4" />
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{playlist.name}</div>
                  <div className="text-xs opacity-70">{playlist.songs.size} canciones</div>
                </div>
              </button>
              {playlists.length > 1 && (
                <button
                  onClick={() => onDeletePlaylist(playlist)}
                  className="ml-2 p-2 rounded-lg bg-red-600/20 border border-red-400/50 text-red-300 opacity-0 group-hover:opacity-100 hover:bg-red-600/40 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Crear Nueva Playlist */}
        {showInput ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Nombre de la playlist"
              className="w-full px-3 py-2 bg-purple-900/50 border border-fuchsia-600/50 rounded-lg text-fuchsia-300 placeholder-fuchsia-500 focus:border-yellow-400 focus:shadow-[0_0_10px_#ffff00] transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreatePlaylist}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-fuchsia-600 to-cyan-600 border border-yellow-400/50 rounded-lg text-yellow-400 text-sm hover:shadow-[0_0_15px_#ffff00] transition-all duration-300"
              >
                Crear
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="px-3 py-2 bg-red-600/20 border border-red-400/50 rounded-lg text-red-300 text-sm hover:bg-red-600/40 transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="w-full py-3 border-2 border-dashed border-fuchsia-400/50 rounded-lg text-fuchsia-400 hover:border-yellow-400 hover:text-yellow-400 hover:bg-purple-800/10 transition-all duration-300"
          >
            + Nueva Playlist
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;