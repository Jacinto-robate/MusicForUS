import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess("Usuário criado com sucesso! Redirecionando...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Erro ao registrar usuário");
      }
    } catch (error) {
      setError("Erro ao conectar ao servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Criar conta</h2>
          <p className="mt-2 text-gray-600">Preencha os dados para começar</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 outline-none"
              placeholder="Escolha seu nome de usuário"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 outline-none"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 outline-none"
              placeholder="Confirme sua senha"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Registrar"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-purple-600 hover:text-purple-800 font-medium transition duration-200"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
