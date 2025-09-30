import React, { useState, useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { DoublyLinkedList } from './utils/DoublyLinkedList';
import { Song, Playlist } from './types';
import Sidebar from './components/Sidebar';
import MainTurntable from './components/MainTurntable';
import MainControls from './components/MainControls';
import MainPlaylist from './components/MainPlaylist';

const App: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Inicializar con playlist por defecto
  // Inicializar con playlist por defecto
  useEffect(() => {
    const defaultPlaylist: Playlist = {
      id: 'default',
      name: 'Mi Biblioteca',
      songs: new DoublyLinkedList<Song>()
    };

    const likedPlaylist: Playlist = {
      id: 'liked',
      name: '❤️ Me Gusta',
      songs: new DoublyLinkedList<Song>(),
      isLikedPlaylist: true
    };

    // Cargar desde localStorage si existe
    const savedPlaylists = localStorage.getItem('retroMusicPlaylists');
    if (savedPlaylists) {
      const parsed = JSON.parse(savedPlaylists);
      const loadedPlaylists = parsed.map((p: any) => {
        const playlist: Playlist = {
          id: p.id,
          name: p.name,
          songs: new DoublyLinkedList<Song>(),
          isLikedPlaylist: p.isLikedPlaylist || false
        };
        p.songs.forEach((song: Song) => {
          playlist.songs.append(song);
        });
        return playlist;
      });

      // Asegurar que existe la playlist de "Me Gusta"
      const hasLikedPlaylist = loadedPlaylists.some((p: Playlist) => p.isLikedPlaylist);
      if (!hasLikedPlaylist) {
        loadedPlaylists.unshift(likedPlaylist);
      }

      setPlaylists(loadedPlaylists);
      setCurrentPlaylist(loadedPlaylists.find((p: Playlist) => !p.isLikedPlaylist) || loadedPlaylists[0]);
    } else {
      setPlaylists([likedPlaylist, defaultPlaylist]);
      setCurrentPlaylist(defaultPlaylist);
    }
  }, []);

  // Guardar en localStorage cuando cambien las playlists
  useEffect(() => {
    const playlistsData = playlists.map(p => ({
      id: p.id,
      name: p.name,
      songs: p.songs.toArray(),
      isLikedPlaylist: p.isLikedPlaylist || false
    }));
    localStorage.setItem('retroMusicPlaylists', JSON.stringify(playlistsData));
  }, [playlists]);


  const handlePlay = () => {
    const currentSong = currentPlaylist?.songs.getCurrent();
    if (currentSong && audioRef.current) {
      // Solo cambiar la fuente si es una canción diferente
      if (audioRef.current.src !== currentSong.url) {
        audioRef.current.src = currentSong.url;
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentPlaylist) {
      const nextSong = currentPlaylist.songs.next();
      if (nextSong) {
        setPlaylists([...playlists]);
        if (isPlaying) {
          setTimeout(handlePlay, 100);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentPlaylist) {
      const prevSong = currentPlaylist.songs.previous();
      if (prevSong) {
        setPlaylists([...playlists]);
        if (isPlaying) {
          setTimeout(handlePlay, 100);
        }
      }
    }
  };

  const handleRemoveSong = (song: Song) => {
    if (currentPlaylist) {
      const wasPlaying = isPlaying && currentPlaylist.songs.getCurrent()?.id === song.id;
      if (wasPlaying) {
        handlePause();
      }
      currentPlaylist.songs.remove(song);
      setPlaylists([...playlists]);
      URL.revokeObjectURL(song.url);
    }
  };

  const handleCreatePlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songs: new DoublyLinkedList<Song>()
    };
    setPlaylists([...playlists, newPlaylist]);
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    if (isPlaying) {
      handlePause();
    }
    setCurrentPlaylist(playlist);
    setSearchTerm('');
  };

  const handleDeletePlaylist = (playlist: Playlist) => {
    if (playlists.length <= 1) return;

    const updatedPlaylists = playlists.filter(p => p.id !== playlist.id);
    setPlaylists(updatedPlaylists);

    if (currentPlaylist?.id === playlist.id) {
      setCurrentPlaylist(updatedPlaylists[0]);
      if (isPlaying) {
        handlePause();
      }
    }
  };

  const handleToggleLike = (song: Song) => {
    if (!currentPlaylist) return;

    // Encontrar la playlist de "Me Gusta"
    const likedPlaylist = playlists.find((p: Playlist) => p.isLikedPlaylist);
    if (!likedPlaylist) return;

    const currentSongInPlaylist = currentPlaylist.songs.getCurrent();

    // Alternar el estado de "liked"
    if (currentSongInPlaylist && currentSongInPlaylist.id === song.id) {
      song.liked = !song.liked;

      if (song.liked) {
        // Agregar a "Me Gusta" si no existe
        const likedSongs: Song[] = likedPlaylist.songs.toArray();
        const alreadyLiked = likedSongs.some((s: Song) => s.id === song.id);

        if (!alreadyLiked) {
          likedPlaylist.songs.append({ ...song, liked: true });
          alert(`💖 "${song.name}" agregada a Me Gusta`);
        }
      } else {
        // Remover de "Me Gusta"
        const likedSongs: Song[] = likedPlaylist.songs.toArray();
        const songToRemove = likedSongs.find((s: Song) => s.id === song.id);
        if (songToRemove) {
          likedPlaylist.songs.remove(songToRemove);
          alert(`💔 "${song.name}" removida de Me Gusta`);
        }
      }

      setPlaylists([...playlists]);
    }
  };

   const handleReorderSongs = (fromIndex: number, toIndex: number) => {
    if (!currentPlaylist) return;
    
    currentPlaylist.songs.reorder(fromIndex, toIndex);
    setPlaylists([...playlists]);
  };

  const handleAddSongs = (files: FileList) => {
    if (!currentPlaylist) return;

    Array.from(files).forEach((file) => {
      const song: Song = {
        id: Date.now().toString() + Math.random().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: URL.createObjectURL(file)
      };
      currentPlaylist.songs.append(song);
    });

    setPlaylists([...playlists]);
  };




  const handleShazamDetect = async () => {
    if (!currentPlaylist) {
      alert('❌ Selecciona una playlist primero');
      return;
    }

    try {
      // Solicitar permiso de micrófono
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      // Mostrar mensaje de inicio
      alert('🎤 ¡Micrófono activado!\n\n🎵 Reproduce la canción que quieres identificar\n⏱️ Grabaremos 5 segundos de audio');

      // Configurar MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Detener todas las pistas del stream para liberar el micrófono
        stream.getTracks().forEach(track => track.stop());

        // Crear blob de audio
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });

        // Enviar evento para limpiar countdown
        window.dispatchEvent(new CustomEvent('shazamCountdown', { detail: 0 }));

        try {
          // Llamar a la API de Shazam
          await processShazamDetection(audioBlob);
        } catch (error) {
          console.error('Error processing Shazam detection:', error);
          alert('❌ Error al procesar el audio\n\nIntenta de nuevo');
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        stream.getTracks().forEach(track => track.stop());
        alert('❌ Error al grabar audio\n\nIntenta de nuevo');
      };

      // Iniciar grabación
      mediaRecorder.start();

      // Countdown de 5 segundos
      let timeLeft = 5;
      const countdownInterval = setInterval(() => {
        window.dispatchEvent(new CustomEvent('shazamCountdown', { detail: timeLeft }));
        timeLeft--;

        if (timeLeft < 0) {
          clearInterval(countdownInterval);
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);

      let errorMessage = '❌ Error al acceder al micrófono\n\n';

      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += '🚫 Permiso denegado\n• Permite el acceso al micrófono\n• Revisa la configuración de tu navegador';
        } else if (error.name === 'NotFoundError') {
          errorMessage += '🎤 Micrófono no encontrado\n• Conecta un micrófono\n• Verifica los dispositivos de audio';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += '🌐 Navegador no compatible\n• Usa Chrome, Firefox o Safari\n• Actualiza tu navegador';
        } else {
          errorMessage += `🔧 ${error.message}`;
        }
      } else {
        errorMessage += '🔧 Error desconocido, intenta de nuevo';
      }

      alert(errorMessage);
    }
  };

  const processShazamDetection = async (audioBlob: Blob) => {
    try {
      // Convertir webm a un formato más compatible si es necesario
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      // Llamada a la API de Shazam via RapidAPI
      const response = await fetch('https://shazam-song-recognition-api.p.rapidapi.com/recognize/file', {
        method: 'POST',
        headers: {
          'x-rapidapi-host': 'shazam-song-recognition-api.p.rapidapi.com',
          'x-rapidapi-key': '8e5968301amshbe3c51fdb9420ebp1e7524jsne12303eb0a60'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Shazam API Response:', result);

      // Procesar la respuesta de Shazam
      if (result && result.track) {
        const track = result.track;
        const songName = track.title || 'Canción Desconocida';
        const artistName = track.subtitle || 'Artista Desconocido';
        const fullName = `${artistName} - ${songName}`;

        // Crear objeto de canción detectada
        const detectedSong: Song = {
          id: Date.now().toString() + Math.random().toString(),
          name: fullName,
          url: track.hub?.actions?.find((action: any) => action.type === 'uri')?.uri || '#'
        };

        // Mostrar información de la canción detectada
        const confirmMessage = `🎵 ¡Canción detectada!\n\n🎤 ${artistName}\n🎵 ${songName}\n\n¿Deseas agregarla a "${currentPlaylist!.name}"?`;

        if (window.confirm(confirmMessage)) {
          // Solo agregar si el usuario confirma
          currentPlaylist!.songs.append(detectedSong);
          setPlaylists([...playlists]);

          alert(`✅ ¡Éxito!\n\n"${fullName}" se agregó a tu playlist`);
        }
      } else {
        // No se pudo identificar la canción
        alert('😔 No se pudo identificar la canción\n\nIntenta con:\n• Una canción más popular\n• Menos ruido de fondo\n• Mayor volumen de la música\n• Acércate más a la fuente de audio');
      }

    } catch (error) {
      console.error('Error with Shazam API:', error);

      // Manejo de errores específicos
      let errorMessage = '❌ Error al detectar la canción\n\n';

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage += '🌐 Problema de conexión a internet\n• Verifica tu conexión\n• Intenta de nuevo en unos segundos';
        } else if (error.message.includes('429')) {
          errorMessage += '⏰ Límite de API alcanzado\n• Espera unos minutos antes de intentar de nuevo';
        } else if (error.message.includes('401')) {
          errorMessage += '🔑 Error de autenticación\n• Verifica las credenciales de la API';
        } else {
          errorMessage += `🔧 ${error.message}`;
        }
      } else {
        errorMessage += '🔧 Error desconocido, intenta de nuevo';
      }

      alert(errorMessage);
    }
  };

  const currentSong = currentPlaylist?.songs.getCurrent() || null;
  const playlistSongs = currentPlaylist?.songs.toArray() || [];

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white flex overflow-hidden relative">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        playlists={playlists}
        currentPlaylist={currentPlaylist}
        onCreatePlaylist={handleCreatePlaylist}
        onSelectPlaylist={handleSelectPlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onAddSongs={handleAddSongs}
        onShazamDetect={handleShazamDetect}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="p-6 text-center border-b border-cyan-400/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_#00ffff] mb-2 animate-pulse">
            RETRO BEATS 80's
          </h1>
          <div className="flex justify-center items-center gap-2 text-cyan-300 text-sm">
            <Volume2 className="w-4 h-4" />
            <span>Reproductor Musical Futurista</span>
            <Volume2 className="w-4 h-4" />
          </div>
        </header>

        {/* Área Principal */}
        <div className="flex-1 flex gap-12 items-stretch justify-around min-h-0 p-8 px-12">
          {/* Panel Centro - Tocadiscos y Controles */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 ml-16">
            {/* Tocadiscos */}
            <MainTurntable isPlaying={isPlaying} currentSong={currentSong} />

            {/* Controles Principales */}
            <MainControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              currentPlaylist={currentPlaylist}
              currentTime={currentTime}
              duration={duration}
              onSeek={(time) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = time;
                  setCurrentTime(time);
                }
              }}
              currentSong={currentSong}
              onToggleLike={handleToggleLike}
            />
          </div>

          {/* Panel Derecho - Lista de Canciones */}
          <div className="flex-1 flex items-center justify-end min-h-0">
            <MainPlaylist
              songs={playlistSongs}
              currentSong={currentSong}
              onRemoveSong={handleRemoveSong}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              currentPlaylist={currentPlaylist}
              onReorderSongs={handleReorderSongs}
            />
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          onEnded={handleNext}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      </div>
    </div>
  );
};

export default App;