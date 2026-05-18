import { useAuth, isCandidateUser, isAdminUser } from "../../hooks/useAuth";
import { STORAGE_KEYS } from "../../api/config";

const AuthDebug = () => {
  const { user, token, isAuthenticated, isLoading } = useAuth();

  const rawUser = localStorage.getItem(STORAGE_KEYS.user);
  const rawToken = localStorage.getItem(STORAGE_KEYS.accessToken);
  const rawRefreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Auth Debug Panel</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">useAuth Hook State</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <strong>isLoading:</strong> {String(isLoading)}
            </div>
            <div>
              <strong>isAuthenticated:</strong> {String(isAuthenticated)}
            </div>
            <div>
              <strong>token:</strong>{" "}
              {token ? `${token.substring(0, 30)}...` : "null"}
            </div>
            <div>
              <strong>user:</strong>{" "}
              {user ? JSON.stringify(user, null, 2) : "null"}
            </div>
            <div>
              <strong>isCandidateUser:</strong> {String(isCandidateUser(user))}
            </div>
            <div>
              <strong>isAdminUser:</strong> {String(isAdminUser(user))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Raw localStorage</h2>
          <div className="space-y-2 font-mono text-sm break-all">
            <div>
              <strong>rp_user:</strong> {rawUser || "null"}
            </div>
            <div>
              <strong>rp_access_token:</strong>{" "}
              {rawToken ? `${rawToken.substring(0, 50)}...` : "null"}
            </div>
            <div>
              <strong>rp_refresh_token:</strong>{" "}
              {rawRefreshToken
                ? `${rawRefreshToken.substring(0, 50)}...`
                : "null"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
