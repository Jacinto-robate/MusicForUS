import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Banner from "./Banner";
import AudioPlayer from "./AudioPlayer";

const ArtistSongs = () => {
  const { artistId } = useParams();
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  // New states for audio player
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/artists/${artistId}/songs/`
        );
        if (!response.ok) throw new Error("Error fetching songs");
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    const fetchArtist = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/artists/${artistId}/`
        );
        if (!response.ok) throw new Error("Error fetching artist");
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error("Error fetching artist:", error);
      }
    };

    fetchSongs();
    fetchArtist();
  }, [artistId]);

  const handleShareMenuToggle = (songId) => {
    setShowShareMenu((prev) => (prev === songId ? null : songId));
  };

  // Updated handlePlayPause to navigate to SongPlayer

  const handlePlayPause = (song) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/songs/${song.id}`);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  // Handle next song
  const handleNextSong = () => {
    if (currentSongIndex === null) return;

    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
  };

  // Handle previous song
  const handlePreviousSong = () => {
    if (currentSongIndex === null) return;

    const previousIndex =
      currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(previousIndex);
  };

  // Handle closing the audio player
  const handleClosePlayer = () => {
    setShowPlayer(false);
    setCurrentSongIndex(null);
  };

  return (
    <div className="p-4 md:p-6 bg-transparent min-h-screen text-white">
      {artist && <Banner artist={artist} />}
      <button
        onClick={handleFollowToggle}
        className={`px-6 py-3 mb-6 font-bold rounded-full text-white transition-transform transform hover:scale-105 ${
          isFollowing
            ? "bg-gradient-to-r from-purple-500 to-red-500"
            : "bg-gradient-to-r from-green-500 to-teal-500"
        } shadow-lg hover:shadow-2xl focus:outline-none active:scale-95`}
      >
        {isFollowing ? "Seguindo" : "Seguir"}
      </button>
      <div className="space-y-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex-wrap relative group"
          >
            <div className="flex items-center flex-1">
              <div className="relative">
                <img
                  src={
                    song.cover_image
                      ? `http://127.0.0.1:8000${song.cover_image}`
                      : "default-album-image.jpg"
                  }
                  alt={song.title}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-lg ml-4 object-cover"
                />
                <button
                  onClick={() => handlePlayPause(song)}
                  className="absolute inset-0 flex items-center justify-center w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-8 h-8 text-green-600"
                  >
                    <path d={"M5 3l14 9-14 9V3z"} />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col mx-4 flex-grow text-center">
                <p className="text-lg font-semibold">{song.title}</p>
                <p className="text-sm text-gray-400">{song.artist_name}</p>
              </div>
              <button
                onClick={() => handleShareMenuToggle(song.id)}
                className="text-gray-400 relative ml-4"
              >
                <span className="text-lg">⋮</span>
                {showShareMenu === song.id && (
                  <div className="absolute right-0 mt-2 bg-gray-800 p-2 rounded shadow-lg z-10">
                    <p className="cursor-pointer hover:text-gray-300 p-2 transition">
                      Option 1
                    </p>
                    <p className="cursor-pointer hover:text-gray-300 p-2 transition">
                      Option 2
                    </p>
                    <p className="cursor-pointer hover:text-gray-300 p-2 transition">
                      Option 3
                    </p>
                  </div>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Audio Player */}
      {showPlayer && currentSongIndex !== null && (
        <AudioPlayer
          audioFile={songs[currentSongIndex]}
          onClose={handleClosePlayer}
          onPlayNext={handleNextSong}
          onPlayPrevious={handlePreviousSong}
        />
      )}
    </div>
  );
};

export default ArtistSongs;
