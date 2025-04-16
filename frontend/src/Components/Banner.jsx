import PropTypes from "prop-types";

const Banner = ({ artist }) => {
  console.log("Artist Object:", artist);
  console.log("Image URL:", artist.image || "No image URL provided");

  return (
    <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-lg mb-6 text-white">
      <img
        src={artist.image || "default-image-url.jpg"}
        alt={artist.name}
        style={{ opacity: 1, zIndex: 0 }}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
      />
      <div className="relative z-10">
        <h1 className="text-2xl md:text-4xl font-bold">{artist.name}</h1>
        <div className="flex items-center mt-2">
          {/* Selo de verificado estilizado com imagem */}
          <div className="flex items-center bg-white text-green-600 font-semibold rounded-full px-4 py-1 shadow-md">
            <img
              src="https://img.icons8.com/color/48/verified-badge.png"
              alt="verified-badge"
              className="h-5 w-5 mr-6"
            />
            <span>Artista verificado</span>
          </div>
        </div>
        <p className="text-sm md:text-lg mt-2">
          Descubra as melhores músicas deste artista!
        </p>
      </div>
    </div>
  );
};

// Validação das props com PropTypes
Banner.propTypes = {
  artist: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default Banner;
