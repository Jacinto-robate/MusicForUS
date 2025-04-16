import PropTypes from "prop-types";
import { FaPlay } from "react-icons/fa";

const PopularArtists = ({ artists, onArtistClick }) => {
  console.log("Artists Data:", artists);

  return (
    <div className="px-4 mt-6 sm:px-6 md:px-8 lg:px-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Artistas Populares</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="text-gray-700 flex flex-col items-center relative group cursor-pointer"
            onClick={() => onArtistClick(artist.id)}
          >
            <div className="relative">
              <img
                src={
                  artist.image
                    ? `http://127.0.0.1:8000${artist.image}`
                    : "default-image-url.jpg"
                }
                alt={artist.name}
                className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 object-cover rounded-full border-4 border-green-500 mb-2"
              />
              <button className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <FaPlay className="text-3xl" />
              </button>
            </div>
            <h3 className="text-xl font-semibold">{artist.name}</h3>
            <p className="text-center text-gray-400">{artist.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

PopularArtists.propTypes = {
  artists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  onArtistClick: PropTypes.func.isRequired,
};

export default PopularArtists;
