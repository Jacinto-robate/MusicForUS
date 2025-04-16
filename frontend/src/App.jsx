import { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import PopularArtists from "./Components/PopularArtists";
import PopularAlbums from "./Components/PopularAlbums";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import ArtistSongs from "./Components/ArtistSongs";
import AlbumSongs from "./Components/AlbumSongs";
import SongPlayer from "./Components/SongPlayer";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ProtectedRoute from "./Components/ProtectedRoute";
import NotFound from "./Components/NotFound"; // Nova importação
import Profile from "./Components/Profile";
import Settings from "./Components/Settings";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/artists/");
        if (!response.ok) throw new Error("Erro ao buscar artistas");
        const data = await response.json();
        setArtists(data);
        setFilteredArtists(data);
      } catch (error) {
        console.error("Erro ao buscar artistas:", error);
      }
    };

    const fetchAlbums = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/albums/");
        if (!response.ok) throw new Error("Erro ao buscar álbuns");
        const data = await response.json();
        setAlbums(data);
        setFilteredAlbums(data);
      } catch (error) {
        console.error("Erro ao buscar álbuns:", error);
      }
    };

    const fetchSongs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/songs/");
        if (!response.ok) throw new Error("Erro ao buscar músicas");
        const data = await response.json();
        setSongs(data);
        setFilteredSongs(data);
      } catch (error) {
        console.error("Erro ao buscar músicas:", error);
      }
    };

    fetchArtists();
    fetchAlbums();
    fetchSongs();
  }, []);

  useEffect(() => {
    const searchTerm = searchQuery.toLowerCase().trim();

    if (searchTerm === "") {
      setFilteredArtists(artists);
      setFilteredAlbums(albums);
      setFilteredSongs(songs);
      return;
    }

    const matchingArtists = artists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(searchTerm) ||
        (artist.description &&
          artist.description.toLowerCase().includes(searchTerm))
    );

    const matchingAlbums = albums.filter(
      (album) =>
        album.title.toLowerCase().includes(searchTerm) ||
        album.artist_name.toLowerCase().includes(searchTerm) ||
        (album.genero && album.genero.toLowerCase().includes(searchTerm))
    );

    const matchingSongs = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchTerm) ||
        song.artist_name.toLowerCase().includes(searchTerm) ||
        (song.album_title &&
          song.album_title.toLowerCase().includes(searchTerm)) ||
        (song.genero && song.genero.toLowerCase().includes(searchTerm))
    );

    setFilteredArtists(matchingArtists);
    setFilteredAlbums(matchingAlbums);
    setFilteredSongs(matchingSongs);
  }, [searchQuery, artists, albums, songs]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleArtistClick = (artistId) => {
    navigate(`/artists/${artistId}/songs`);
  };

  const isSongPlayerRoute = location.pathname.startsWith("/songs/");

  const NoResultsMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-50 rounded-lg p-8 max-w-2xl w-full">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhum resultado encontrado
        </h3>
        <ul className="text-gray-500 text-sm space-y-2">
          <li>• Verificar se há erros de digitação</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="text-black bg-white min-h-screen flex flex-col">
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <div className={`flex-grow ${isSongPlayerRoute ? "" : "flex"}`}>
        {!isSongPlayerRoute && <aside className="w-1/4 p-4"></aside>}
        <main
          className={`${isSongPlayerRoute ? "w-full" : "w-3/4 px-4"} ${
            isSongPlayerRoute ? "" : "mt-24"
          }`}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <>
                  {searchQuery && (
                    <div className="mb-6 px-4">
                      {filteredArtists.length === 0 &&
                      filteredAlbums.length === 0 &&
                      filteredSongs.length === 0 ? (
                        <NoResultsMessage />
                      ) : (
                        <div className="space-y-8">
                          {filteredArtists.length > 0 && (
                            <div>
                              <PopularArtists
                                artists={filteredArtists}
                                onArtistClick={handleArtistClick}
                              />
                            </div>
                          )}
                          {filteredAlbums.length > 0 && (
                            <div>
                              <PopularAlbums albums={filteredAlbums} />
                            </div>
                          )}
                          {filteredSongs.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Músicas
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredSongs.map((song) => (
                                  <div
                                    key={song.id}
                                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                      navigate(`/songs/${song.id}`)
                                    }
                                  >
                                    <h4 className="font-medium">
                                      {song.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {song.artist_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {song.album_title}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {!searchQuery && (
                    <>
                      <PopularArtists
                        artists={filteredArtists}
                        onArtistClick={handleArtistClick}
                      />
                      <PopularAlbums albums={filteredAlbums} />
                    </>
                  )}
                </>
              }
            />
            <Route
              path="/artists/:artistId/songs"
              element={
                <ProtectedRoute>
                  <ArtistSongs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/albums/:albumId/songs"
              element={
                <ProtectedRoute>
                  <AlbumSongs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/songs/:songId"
              element={
                <ProtectedRoute>
                  <SongPlayer />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />{" "}
            {/* Nova rota catch-all */}
          </Routes>
        </main>
      </div>
      {location.pathname === "/" && <Footer />}
    </div>
  );
}

export default App;
