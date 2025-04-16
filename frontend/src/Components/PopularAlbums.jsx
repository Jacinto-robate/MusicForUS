import { FaPlay } from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const PopularAlbums = ({ albums }) => {
  const navigate = useNavigate();

  const handleAlbumClick = (albumId) => {
    navigate(`/albums/${albumId}/songs`);
  };

  return (
    <div className="px-4 mt-6 mb-10 sm:px-6 md:px-8 lg:px-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Álbuns Populares</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => handleAlbumClick(album.id)}
            className="relative group bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
          >
            <img
              src={`http://127.0.0.1:8000${album.cover_image}`}
              alt={album.title}
              className="w-full h-36 sm:h-40 md:h-44 lg:h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{album.title}</h3>
              <p className="text-gray-500">{album.genero}</p>
              <p className="text-sm text-gray-400">{album.artist_name}</p>
            </div>
            <button className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-70 rounded-lg">
              <FaPlay className="text-3xl" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

PopularAlbums.propTypes = {
  albums: PropTypes.array.isRequired,
};

export default PopularAlbums;
