import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AudioPlayer from "./AudioPlayer";
import { Mic2, AlertCircle } from "lucide-react";

const SongPlayer = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [artistSongs, setArtistSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const fetchSongData = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/songs/${id}/`);
      if (!response.ok) throw new Error("Failed to fetch song");

      const songData = await response.json();
      setSong(songData);

      if (songData.artist_id) {
        const artistResponse = await fetch(
          `http://127.0.0.1:8000/api/artists/${songData.artist_id}/songs/`
        );
        if (!artistResponse.ok) throw new Error("Failed to fetch artist songs");

        const artistSongsData = await artistResponse.json();
        setArtistSongs(artistSongsData);
        const index = artistSongsData.findIndex((s) => s.id === parseInt(id));
        setCurrentIndex(index);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSong(null);
      setArtistSongs([]);
      setCurrentIndex(-1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (songId) {
      fetchSongData(songId);
    }
  }, [songId, fetchSongData]);

  const handleNext = useCallback(() => {
    if (artistSongs.length > 0 && currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % artistSongs.length;
      const nextSong = artistSongs[nextIndex];
      if (nextSong) {
        navigate(`/songs/${nextSong.id}`);
      }
    }
  }, [artistSongs, currentIndex, navigate]);

  const handlePrevious = useCallback(() => {
    if (artistSongs.length > 0 && currentIndex !== -1) {
      const prevIndex =
        currentIndex === 0 ? artistSongs.length - 1 : currentIndex - 1;
      const prevSong = artistSongs[prevIndex];
      if (prevSong) {
        navigate(`/songs/${prevSong.id}`);
      }
    }
  }, [artistSongs, currentIndex, navigate]);

  if (loading && !song) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl font-medium text-gray-600">
          Carregando...
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium text-red-600">
          Música não encontrada
        </div>
      </div>
    );
  }

  const lyrics = song?.lyrics ?? "";
  const hasLyrics = lyrics.trim() !== "";
  const artistName = song?.artist_name || song?.artist?.name;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Player fixo no topo com altura ajustada */}
      <div className="fixed top-16 left-0 right-0 z-30">
        {song && (
          <AudioPlayer
            key={song.id}
            audioFile={{
              id: song.id,
              audio_file: song.audio_file,
              title: song.title,
              artist_name: artistName,
              cover_image: song.cover_image,
            }}
            onClose={() => {}}
            onPlayNext={artistSongs.length > 1 ? handleNext : undefined}
            onPlayPrevious={artistSongs.length > 1 ? handlePrevious : undefined}
            initialIsPlaying={isPlaying}
            onPlayingChange={setIsPlaying}
          />
        )}
      </div>

      {/* Conteúdo principal com padding reduzido */}
      <div className="pt-32 px-4 md:px-6">
        {/* Container para título e informações do artista */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                {song.title}
              </h2>
            </div>
            <div className="flex items-center justify-center mt-3">
              <Mic2 className="w-5 h-5 text-gray-600 mr-2" />
              <p className="text-2xl text-gray-600 font-medium tracking-wide">
                {artistName}
              </p>
            </div>
          </div>
        </div>

        {/* Container para a letra */}
        <div className="max-w-4xl mx-auto pb-32">
          {!hasLyrics ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 tracking-wide">
                  Letra não disponível
                </h3>
                <p className="text-gray-500 max-w-md leading-relaxed font-medium">
                  A letra desta música ainda não está disponível em nosso
                  sistema. Estamos trabalhando para disponibilizar mais letras
                  em breve.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="space-y-2 tracking-wide">
                {lyrics.split("\n").map((line, index) => (
                  <div
                    key={index}
                    className={`text-lg leading-relaxed transition-colors duration-200
                      ${line.trim() === "" ? "h-4" : ""}
                      font-medium text-gray-800 hover:text-indigo-600 
                      hover:translate-x-2 transform transition-transform duration-200`}
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongPlayer;
