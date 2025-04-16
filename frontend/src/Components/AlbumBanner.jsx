import { Play, Pause, Heart, Share2, Clock } from "lucide-react";
import PropTypes from "prop-types";

const AlbumBanner = ({
  artistName,
  albumName,
  albumCover,
  releaseYear,
  songCount,
  totalDuration,
  isPlaying,
  onPlayFirstSong,
}) => {
  return (
    <div className="relative overflow-hidden bg-transparent">
      {/* Background blur effect with album art */}

      {/* Main content */}
      <div className="relative flex flex-col md:flex-row items-start gap-8 p-8 bg-transparent">
        {/* Album Cover with hover effect */}
        <div className="group relative w-48 h-48 flex-shrink-0 shadow-2xl rounded-md overflow-hidden">
          <img
            src={albumCover || "/api/placeholder/400/400"}
            alt={albumName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Album Info */}
        <div className="flex-grow space-y-4">
          <div className="space-y-1">
            <p className="text-white/80 font-medium">ALBUM</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {albumName || "Untitled Album"}
            </h1>
          </div>

          {/* Artist and Meta Info */}
          <div className="flex items-center gap-2 text-white/80">
            <img
              src={albumCover || "/api/placeholder/40/40"}
              alt={artistName}
              className="w-6 h-6 rounded-full"
            />
            <span className="font-medium hover:underline cursor-pointer">
              {artistName || "Unknown Artist"}
            </span>
            <span className="text-white/60">•</span>
            <span>{releaseYear || "Year not available"}</span>
            <span className="text-white/60">•</span>
            <span>{songCount || 0} songs</span>
            <span className="text-white/60">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {totalDuration || "0:00"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={() => onPlayFirstSong(!isPlaying)}
              className="bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full px-8 py-3 flex items-center gap-2 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current" />
              )}
              Play
            </button>
            <button className="text-white/80 hover:text-white p-2 rounded-full transition-colors">
              <Heart className="w-8 h-8" />
            </button>
            <button className="text-white/80 hover:text-white p-2 rounded-full transition-colors">
              <Share2 className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AlbumBanner.propTypes = {
  artistName: PropTypes.string.isRequired,
  albumName: PropTypes.string.isRequired,
  albumCover: PropTypes.string,
  releaseYear: PropTypes.string,
  songCount: PropTypes.number,
  totalDuration: PropTypes.string,
  isPlaying: PropTypes.bool.isRequired,
  onPlayFirstSong: PropTypes.func.isRequired,
};

export default AlbumBanner;
