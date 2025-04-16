import { useState, useEffect } from "react";
import {
  FiCamera,
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dados do perfil
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    birthday: "",
    location: "",
    bio: "",
  });

  // Dados de senha
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Imagem do perfil
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Função para carregar o perfil do usuário
  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/auth/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        if (data.profileImage) setPreviewImage(data.profileImage);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Erro ao carregar dados do perfil");
    }
  };

  // Função para carregar a imagem de perfil
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validação de tipo e tamanho da imagem
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Por favor, envie apenas imagens (JPEG, PNG ou GIF)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("A imagem deve ter menos que 5MB");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Função para validar a senha
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength)
      errors.push(`Mínimo de ${minLength} caracteres`);
    if (!hasUpperCase) errors.push("Uma letra maiúscula");
    if (!hasLowerCase) errors.push("Uma letra minúscula");
    if (!hasNumbers) errors.push("Um número");
    if (!hasSpecialChar) errors.push("Um caractere especial");

    return errors;
  };

  // Função para atualizar a senha
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validação das senhas
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    const passwordErrors = validatePassword(passwordData.newPassword);
    if (passwordErrors.length > 0) {
      setError(`A senha deve conter: ${passwordErrors.join(", ")}`);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/auth/change-password/",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_password: passwordData.currentPassword,
            new_password: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccess("Senha alterada com sucesso!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(data.error || "Erro ao alterar senha");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Erro ao conectar ao servidor");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar o perfil
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.keys(profileData).forEach((key) =>
        formData.append(key, profileData[key])
      );
      if (profileImage) formData.append("profile_image", profileImage);

      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/auth/update-profile/",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccess("Perfil atualizado com sucesso!");
        localStorage.setItem("username", profileData.username);
      } else {
        setError(data.error || "Erro ao atualizar perfil");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Erro ao conectar ao servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Seu Perfil</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === "personal"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Informações Pessoais
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === "security"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Segurança
            </button>
          </div>
        </div>

        {/* Mensagens de Feedback */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Aba de Informações Pessoais */}
        {activeTab === "personal" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Foto do Perfil */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white text-6xl">
                        {profileData.username[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 cursor-pointer shadow-lg transition duration-200">
                    <FiCamera className="w-6 h-6" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {profileData.fullName || profileData.username}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {profileData.bio || "Sem bio definida"}
                  </p>
                </div>
              </div>
            </div>

            {/* Formulário de Atualização */}
            <div className="md:col-span-2 space-y-6">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Campos de texto */}
                  <div className="relative">
                    <label
                      htmlFor="username"
                      className="text-sm font-medium text-gray-700 block mb-2"
                    >
                      Nome de Usuário
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        id="username"
                        type="text"
                        value={profileData.username}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            username: e.target.value,
                          })
                        }
                        className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 block mb-2"
                    >
                      E-mail
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-gray-700 block mb-2"
                    >
                      Nome Completo
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        id="fullName"
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            fullName: e.target.value,
                          })
                        }
                        className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700 block mb-2"
                    >
                      Telefone
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        id="phone"
                        type="text"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <label
                      htmlFor="birthday"
                      className="text-sm font-medium text-gray-700 block mb-2"
                    >
                      Data de Nascimento
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        id="birthday"
                        type="date"
                        value={profileData.birthday}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            birthday: e.target.value,
                          })
                        }
                        className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="location"
                      className="text-sm font-medium text-gray-700 block mb-2"
                    >
                      Localização
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        id="location"
                        type="text"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            location: e.target.value,
                          })
                        }
                        className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                    rows="4"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Aba de Segurança */
          <div className="space-y-6">
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Senha Atual
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Alterando..." : "Alterar Senha"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
