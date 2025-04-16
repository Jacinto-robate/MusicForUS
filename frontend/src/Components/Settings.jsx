import { useState, useEffect } from "react";

const Settings = () => {
  const [currentLanguage, setCurrentLanguage] = useState("pt-BR");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const languages = [
    { code: "pt-BR", name: "Português" },
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
  ];

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setCurrentLanguage(storedLanguage);
    }
  }, []);

  const handleLanguageChange = async (languageCode) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/auth/update-settings/",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ language: languageCode }),
        }
      );

      if (response.ok) {
        localStorage.setItem("language", languageCode);
        setCurrentLanguage(languageCode);
        setSuccess("Idioma alterado com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Erro ao atualizar idioma:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Configurações</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Idioma</h3>
            <div className="grid grid-cols-1 gap-4">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  disabled={isLoading || currentLanguage === language.code}
                  className={`flex items-center justify-between p-4 rounded-lg border transition duration-200 ${
                    currentLanguage === language.code
                      ? "bg-blue-50 border-blue-500"
                      : "border-gray-200 hover:border-blue-500"
                  }`}
                >
                  <span className="font-medium">{language.name}</span>
                  {currentLanguage === language.code && (
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700">{success}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
