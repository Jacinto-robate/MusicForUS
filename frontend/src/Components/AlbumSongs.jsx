import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate here
import { Play, Pause, Clock, Heart, MoreHorizontal } from "lucide-react";
import AlbumBanner from "./AlbumBanner";

const AlbumSongs = () => {
  const { albumId } = useParams();
  const [songs, setSongs] = useState([]);
  const [album, setAlbum] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [hoveredSong, setHoveredSong] = useState(null);
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/albums/${albumId}/`
        );
        if (!response.ok) throw new Error("Error fetching album");
        const data = await response.json();
        setAlbum(data);
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };

    const fetchSongs = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/albums/${albumId}/songs/`
        );
        if (!response.ok) throw new Error("Error fetching songs");
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchAlbum();
    fetchSongs();
  }, [albumId]);

  const handlePlayPause = (song) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Use navigate from useNavigate hook
      return;
    }
    if (currentAudio && currentSongId === song.id) {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play();
        setIsPlaying(true);
      }
    } else {
      if (currentAudio) {
        currentAudio.pause();
      }
      const newAudio = new Audio(`http://127.0.0.1:8000${song.audio_file}`);
      newAudio.play();
      setCurrentAudio(newAudio);
      setCurrentSongId(song.id);
      setIsPlaying(true);

      newAudio.onended = () => {
        setIsPlaying(false);
        setCurrentSongId(null);
      };
    }
  };

  const handlePlayFirstSong = () => {
    if (songs.length > 0) {
      handlePlayPause(songs[0]);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const totalSongs = songs.length;
  const totalDuration = songs.reduce((total, song) => total + song.duration, 0);
  const formattedTotalDuration = formatDuration(totalDuration);

  return (
    <div className="min-h-screen bg-[#182641f1]">
      {/* Gradient effect on top */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />

      <div className="relative">
        {album ? (
          <div className="relative">
            {/* Dynamic background based on album cover */}
            <div
              className="absolute top-0 left-0 right-0 h-[500px] opacity-30 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  album.cover_image || "/api/placeholder/400/400"
                })`,
                filter: "blur(100px)",
              }}
            />

            {/* Main container with consistent padding */}
            <div className="relative max-w-[1500px] mx-auto px-8">
              <AlbumBanner
                artistName={album.artist_name || "Unknown Artist"}
                albumName={album.title || "Untitled Album"}
                albumCover={album.cover_image}
                releaseYear={album.release_date?.split("-")[0]}
                songCount={totalSongs}
                totalDuration={formattedTotalDuration}
                onPlayFirstSong={handlePlayFirstSong}
              />

              {/* Song list */}
              <div className="mt-8">
                {/* Table header */}
                <div className="grid grid-cols-[16px,1fr,1fr,48px] md:grid-cols-[48px,4fr,2fr,1fr,48px] gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-white/10">
                  <div className="text-center">#</div>
                  <div>TITLE</div>
                  <div className="hidden md:block">ARTIST</div>
                  <div className="hidden md:block">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div></div>
                </div>

                {/* Song list */}
                <div className="mt-2">
                  {songs.map((song, index) => {
                    const isCurrentSong = currentSongId === song.id;
                    const isHovered = hoveredSong === song.id;

                    return (
                      <div
                        key={song.id}
                        className={`grid grid-cols-[16px,1fr,1fr,48px] md:grid-cols-[48px,4fr,2fr,1fr,48px] gap-4 px-4 py-3 rounded-md group transition-colors duration-200 ${
                          isCurrentSong ? "bg-white/10" : "hover:bg-white/10"
                        }`}
                        onMouseEnter={() => setHoveredSong(song.id)}
                        onMouseLeave={() => setHoveredSong(null)}
                      >
                        <div className="flex items-center justify-center">
                          {isHovered || isCurrentSong ? (
                            <button
                              onClick={() => handlePlayPause(song)}
                              className="text-white hover:text-green-400 transition-colors"
                            >
                              {isCurrentSong && isPlaying ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <span
                              className={`${
                                isCurrentSong
                                  ? "text-green-400"
                                  : "text-gray-400"
                              }`}
                            >
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 min-w-0">
                          <div className="hidden md:block w-10 h-10">
                            <img
                              src={
                                album?.cover_image || "/api/placeholder/40/40"
                              }
                              alt=""
                              className="w-full h-full object-cover rounded shadow-lg"
                            />
                          </div>
                          <div className="truncate">
                            <p
                              className={`font-medium truncate ${
                                isCurrentSong ? "text-green-400" : "text-white"
                              }`}
                            >
                              {song.title}
                            </p>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center text-gray-400 hover:text-white truncate transition-colors">
                          {album?.artist_name}
                        </div>

                        <div className="hidden md:flex items-center text-gray-400">
                          {formatDuration(song.duration)}
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="invisible group-hover:visible text-gray-400 hover:text-green-400 transition-colors"
                            aria-label="Favorite"
                          >
                            <Heart className="w-5 h-5" />
                          </button>
                          <button
                            className="invisible group-hover:visible text-gray-400 hover:text-white transition-colors"
                            aria-label="More options"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-white/10 h-12 w-12"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-[250px]"></div>
                <div className="h-4 bg-white/10 rounded w-[200px]"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumSongs;
