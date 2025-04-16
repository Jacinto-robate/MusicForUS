import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="space-y-8">
          {/* Animated 404 Number */}
          <div className="relative">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-2">
                <div className="w-40 h-40 mx-auto">
                  <svg
                    className="w-full h-full text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Página não encontrada
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Ops! Parece que você se perdeu na melodia. A página que você está
              procurando pode ter sido movida ou não existe.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Voltar ao Início</span>
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition duration-200 flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>
              <span>Voltar</span>
            </button>
          </div>

          {/* Music Wave Animation */}
          <div className="flex justify-center items-center space-x-1 pt-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-blue-500 rounded-full animate-bounce`}
                style={{
                  height: "20px",
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
