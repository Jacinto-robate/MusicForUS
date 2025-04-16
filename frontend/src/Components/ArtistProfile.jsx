import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Music,
  Users,
  PlayCircle,
  Edit,
  Save,
  Image as ImageIcon,
  Calendar,
  Disc,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [artist, setArtist] = useState({
    id: "",
    name: "",
    description: "",
    genre: "",
    totalSongs: 0,
    followers: 0,
    totalPlays: 0,
    joinDate: "",
    albums: 0,
    averageLength: "",
    bannerUrl: "",
    avatarUrl: "",
    recentReleases: [],
    analyticsData: [],
  });

  const [editForm, setEditForm] = useState({ ...artist });

  // Fetch artist data
  const fetchArtistData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/artists/${id}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch artist data");

      const data = await response.json();
      setArtist(data);
      setEditForm(data);
    } catch (err) {
      setError("Erro ao carregar dados do artista");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArtistData();
  }, [fetchArtistData]);

  // Handle image uploads
  const handleImageUpload = async (file, type) => {
    const setLoading =
      type === "banner" ? setUploadingBanner : setUploadingAvatar;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/artists/${id}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setArtist((prev) => ({
        ...prev,
        [type === "banner" ? "bannerUrl" : "avatarUrl"]: data.imageUrl,
      }));
    } catch (err) {
      setError(
        `Erro ao fazer upload da ${type === "banner" ? "capa" : "foto"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/artists/${id}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) throw new Error("Failed to update artist");

      const data = await response.json();
      setArtist(data);
      setIsEditing(false);
    } catch (err) {
      setError("Erro ao atualizar perfil");
    } finally {
      setSaveLoading(false);
    }
  };

  const stats = [
    { label: "Músicas", value: artist.totalSongs, icon: Music },
    { label: "Seguidores", value: artist.followers, icon: Users },
    { label: "Reproduções", value: artist.totalPlays, icon: PlayCircle },
    { label: "Desde", value: artist.joinDate, icon: Calendar },
    { label: "Álbuns", value: artist.albums, icon: Disc },
    { label: "Duração Média", value: artist.averageLength, icon: Clock },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-blue-600">Carregando perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-600">
            {artist.bannerUrl && (
              <img
                src={artist.bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            )}
            <input
              type="file"
              id="banner-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], "banner")}
            />
            <label
              htmlFor="banner-upload"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition cursor-pointer"
            >
              {uploadingBanner ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ImageIcon className="w-5 h-5" />
              )}
            </label>

            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e.target.files[0], "avatar")
                  }
                />
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  {artist.avatarUrl ? (
                    <img
                      src={artist.avatarUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white">
                      {uploadingAvatar ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        artist.name[0]
                      )}
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="pt-20 pb-6 px-8">
            <div className="flex justify-between items-start">
              <div className="w-full max-w-2xl">
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="text-3xl font-bold block w-full bg-gray-50 rounded px-2 py-1"
                      required
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="text-gray-600 block w-full bg-gray-50 rounded px-2 py-1"
                      rows="3"
                      required
                    />
                    <input
                      type="text"
                      value={editForm.genre}
                      onChange={(e) =>
                        setEditForm({ ...editForm, genre: e.target.value })
                      }
                      className="text-sm bg-gray-50 rounded px-2 py-1"
                      placeholder="Gênero musical"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={saveLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {saveLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm(artist);
                          setIsEditing(false);
                        }}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold">{artist.name}</h1>
                    <p className="text-gray-600 mt-2">{artist.description}</p>
                    <div className="mt-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {artist.genre}
                      </span>
                    </div>
                  </>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <Edit className="w-4 h-4" /> Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Latest Releases Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Últimos Lançamentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {artist.recentReleases.map((release, index) => (
              <div
                key={release.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition cursor-pointer"
                onClick={() => navigate(`/songs/${release.id}`)}
              >
                <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3">
                  {release.coverUrl && (
                    <img
                      src={release.coverUrl}
                      alt={release.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <h3 className="font-medium">{release.title}</h3>
                <p className="text-sm text-gray-600">
                  {release.albumTitle} • {release.releaseYear}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Análise de Desempenho</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={artist.analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="plays"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
