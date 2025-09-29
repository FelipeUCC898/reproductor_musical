import React from 'react';
import { Search, Music, Trash2 } from 'lucide-react';
import { Song, Playlist } from '../types';

interface MainPlaylistProps {
  songs: Song[];
  currentSong: Song | null;
  onRemoveSong: (song: Song) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentPlaylist: Playlist | null;
}

const MainPlaylist: React.FC<MainPlaylistProps> = ({
  songs,
  currentSong,
  onRemoveSong,
  searchTerm,
  onSearchChange,
  currentPlaylist
}) => {
  const filteredSongs = songs.filter(song => 
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-xl flex flex-col h-full">
      {/* Header de Playlist */}
      {currentPlaylist && (
        <div className="mb-4 text-center">
          <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 bg-clip-text mb-2">
            {currentPlaylist.name}
          </h2>
          <p className="text-fuchsia-400 text-lg">
            {filteredSongs.length} {filteredSongs.length === 1 ? 'canción' : 'canciones'}
          </p>
        </div>
      )}

      {/* Buscador Integrado en Playlist */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-cyan-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar canciones en esta playlist..."
          className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-2 border-cyan-400/50 rounded-xl text-cyan-300 placeholder-cyan-500 focus:border-yellow-400 focus:shadow-[0_0_20px_#ffff00] transition-all duration-300 backdrop-blur-sm"
        />
      </div>

      {/* Lista de Canciones con Scroll */}
      <div className="bg-gradient-to-b from-purple-900/30 to-blue-900/30 rounded-2xl border border-cyan-400/30 backdrop-blur-sm overflow-hidden flex-1">
        <div className="h-full overflow-y-auto scrollbar-custom">
          {filteredSongs.map((song, index) => (
            <div
              key={song.id}
              className={`flex items-center justify-between p-4 border-b border-cyan-400/10 transition-all duration-300 hover:bg-purple-800/30 ${
                currentSong?.id === song.id
                  ? 'bg-gradient-to-r from-fuchsia-600/20 to-cyan-600/20 border-l-4 border-l-yellow-400 shadow-[0_0_20px_#ffff00]'
                  : 'hover:border-l-4 hover:border-l-fuchsia-400'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  currentSong?.id === song.id ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-400'
                }`}></div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center border border-cyan-400/50 flex-shrink-0">
                  <Music className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className={`font-bold text-base truncate ${
                    currentSong?.id === song.id ? 'text-yellow-400' : 'text-cyan-300'
                  }`} title={song.name}>
                    {song.name}
                  </div>
                  <div className="text-fuchsia-400 text-sm">
                    Track #{index + 1}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onRemoveSong(song)}
                className="p-2 rounded-full bg-red-600/20 border border-red-400/50 hover:bg-red-500/40 hover:shadow-[0_0_20px_#ff0040] transition-all duration-300 flex-shrink-0 ml-3"
              >
                <Trash2 className="w-4 h-4 text-red-300" />
              </button>
            </div>
          ))}
        </div>
        
        {filteredSongs.length === 0 && (
          <div className="text-center py-16">
            <Music className="w-16 h-16 text-fuchsia-400/50 mx-auto mb-4" />
            <div className="text-fuchsia-400 text-xl">
              {searchTerm ? 'No se encontraron canciones' : 'Tu playlist está vacía'}
            </div>
            <div className="text-cyan-500 mt-2">
              {searchTerm ? 'Intenta con otra búsqueda' : 'Agrega canciones desde el sidebar'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPlaylist;