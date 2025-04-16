import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  Volume1,
  VolumeX,
  Shuffle,
} from "lucide-react";

const AudioPlayer = ({
  audioFile,
  onPlayNext,
  onPlayPrevious,
  initialIsPlaying,
  onPlayingChange,
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(
    parseFloat(localStorage.getItem("audioVolume")) || 0.7
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none"); // none, one, all
  const [isShuffling, setIsShuffling] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeTimeoutRef = useRef(null);
  const wasPlayingRef = useRef(false); // Novo ref para rastrear o estado de reprodução

  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const cleanupAudio = (audio) => {
    if (audio) {
      audio.pause();
      audio.src = "";
      audio.load();
    }
  };

  useEffect(() => {
    if (audioFile?.audio_file) {
      // Cleanup previous audio instance
      if (audioRef.current) {
        cleanupAudio(audioRef.current);
      }

      const audio = new Audio(`http://127.0.0.1:8000${audioFile.audio_file}`);
      audioRef.current = audio;
      audio.volume = volume;
      setIsLoaded(false);
      setIsError(false);

      const handleLoadedData = () => {
        setDuration(audio.duration);
        setIsLoaded(true);
        setIsError(false);
        if (isPlaying) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error("Playback failed:", error);
              setIsPlaying(false);
            });
          }
        }
      };

      const handleEnded = () => {
        if (repeatMode === "one") {
          audio.currentTime = 0;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error("Replay failed:", error);
              setIsPlaying(false);
            });
          }
        } else if (repeatMode === "all" || isShuffling) {
          handleNext();
        } else {
          setIsPlaying(false);
        }
      };

      const handleError = () => {
        setIsError(true);
        setIsPlaying(false);
        setIsLoaded(false);
      };

      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

      audio.addEventListener("loadeddata", handleLoadedData);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleError);

      return () => {
        audio.removeEventListener("loadeddata", handleLoadedData);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("error", handleError);
        cleanupAudio(audio);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFile, repeatMode, isShuffling, volume, isPlaying]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);

  const handleVolumeIconClick = () => {
    setShowVolumeSlider(true);
    // Clear any existing timeout
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
  };

  const handleVolumeContainerMouseLeave = () => {
    // Set a timeout to hide the slider
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000); // Keep the slider visible for 1 second after mouse leave
  };

  const handleVolumeContainerMouseEnter = () => {
    // Clear the timeout if the mouse re-enters
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
  };

  const handlePlayPause = () => {
    if (!isLoaded || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPlayingChange(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            onPlayingChange(true);
          })
          .catch((error) => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
            onPlayingChange(false);
          });
      }
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current && !isNaN(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = async (e) => {
    const newVolume = parseFloat(e.target.value);
    if (!isNaN(newVolume) && newVolume >= 0 && newVolume <= 1) {
      setVolume(newVolume);
      if (audioRef.current) {
        // Salva o estado atual de reprodução
        wasPlayingRef.current = !audioRef.current.paused;

        // Define o novo volume
        audioRef.current.volume = newVolume;

        // Se estava tocando antes, continua tocando
        if (wasPlayingRef.current) {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
            onPlayingChange(true);
          } catch (error) {
            console.error("Erro ao retomar a reprodução:", error);
            setIsPlaying(false);
            onPlayingChange(false);
          }
        }
      }
      localStorage.setItem("audioVolume", newVolume);
    }
  };

  const handleNext = () => {
    if (onPlayNext) {
      setIsPlaying(false);
      onPlayNext();
    } else {
      if (audioFile && audioFile.id) {
        navigate(`/songs/${audioFile.id + 1}`);
      }
    }
  };

  const handlePrevious = () => {
    if (onPlayPrevious) {
      setIsPlaying(false);
      onPlayPrevious();
    } else {
      if (audioFile && audioFile.id) {
        navigate(`/songs/${audioFile.id - 1}`);
      }
    }
  };

  const toggleRepeat = () => {
    const modes = ["none", "one", "all"];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const getRepeatColor = () => {
    switch (repeatMode) {
      case "one":
        return "text-purple-500";
      case "all":
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg p-4 shadow-2xl border-t border-gray-800">
      {isError ? (
        <div className="mb-4 p-4 bg-red-500/10 text-red-500 rounded-lg">
          Error loading audio file. Please try again later.
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Song Info */}
            <div className="flex items-center space-x-4">
              {audioFile?.cover_image && (
                <img
                  src={`http://127.0.0.1:8000${audioFile.cover_image}`}
                  alt={audioFile?.title || "Album cover"}
                  className="w-14 h-14 rounded-lg object-cover shadow-lg"
                />
              )}
              <div className="flex flex-col">
                <span className="text-white font-medium truncate">
                  {audioFile?.title || "Unknown Title"}
                </span>
                <span className="text-gray-400 text-sm truncate">
                  {audioFile?.artist_name || "Unknown Artist"}
                </span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setIsShuffling(!isShuffling)}
                  className={`transition-colors ${
                    isShuffling ? "text-green-500" : "text-gray-400"
                  } hover:text-white`}
                >
                  <Shuffle size={20} />
                </button>
                <button
                  onClick={handlePrevious}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipBack size={24} />
                </button>
                <button
                  onClick={handlePlayPause}
                  disabled={!isLoaded}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlaying ? (
                    <Pause size={24} className="text-gray-900" />
                  ) : (
                    <Play size={24} className="text-gray-900 ml-1" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipForward size={24} />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`transition-colors hover:text-white ${getRepeatColor()}`}
                >
                  <Repeat size={20} />
                  {repeatMode === "one" && (
                    <span className="absolute text-xs">1</span>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full flex items-center space-x-2">
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    disabled={!isLoaded}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: `linear-gradient(to right, #22c55e ${
                        (currentTime / (duration || 1)) * 100
                      }%, #4b5563 ${(currentTime / (duration || 1)) * 100}%)`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-end">
              <div
                className="relative"
                onMouseEnter={handleVolumeContainerMouseEnter}
                onMouseLeave={handleVolumeContainerMouseLeave}
              >
                <button
                  onClick={handleVolumeIconClick}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {volume === 0 ? (
                    <VolumeX size={20} />
                  ) : volume < 0.5 ? (
                    <Volume1 size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </button>
                {showVolumeSlider && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-gray-800 rounded-lg shadow-lg">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #22c55e ${
                          volume * 100
                        }%, #4b5563 ${volume * 100}%)`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AudioPlayer.propTypes = {
  audioFile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artist_name: PropTypes.string.isRequired,
    audio_file: PropTypes.string.isRequired,
    cover_image: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onPlayNext: PropTypes.func,
  onPlayPrevious: PropTypes.func,
  initialIsPlaying: PropTypes.bool.isRequired,
  onPlayingChange: PropTypes.func.isRequired,
};

export default AudioPlayer;
