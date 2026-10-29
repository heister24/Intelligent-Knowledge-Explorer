import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../configs/firebase";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (token) => {
    try {
      const response = await api.post("/auth/login", { token });
      if (response.data?.success && response.data?.user) {
        dispatch(setUserData(response.data.user));
      } else {
        setErrorMsg("Session creation failed. Please try again.");
      }
    } catch (error) {
      const status = error.response?.status;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred during login";
      console.error(`Login failed [HTTP ${status || "Network Error"}]:`, errorMessage);
      setErrorMsg(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const googleLogin = async () => {
    setErrorMsg("");
    setIsLoggingIn(true);
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const token = await response.user.getIdToken();
      await handleLogin(token);
    } catch (error) {
      setIsLoggingIn(false);
      if (error.code === "auth/popup-closed-by-user") {
        console.info("Google sign-in popup was closed by user.");
      } else {
        console.error(`Google auth error [${error.code || "unknown"}]:`, error.message);
        setErrorMsg(error.message || "Failed to authenticate with Google");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-neutral-700 bg-neutral-950 p-6 md:p-8 relative shadow-[0_0_50px_rgba(255,255,255,0.03)]">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6 text-xs text-neutral-400">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEM // GATEWAY:8000</span>
          </span>
          <span className="border border-neutral-800 px-2 py-0.5 text-[10px]">AUTH_MODE_OAUTH</span>
        </div>

        {/* Title */}
        <div className="space-y-2 mb-8">
          <div className="text-[10px] tracking-widest text-neutral-500 uppercase">
            [ KNOWLEDGE GRAPH EXPLORER ]
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase">
            GraphRAG Engine
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Multi-document entity extraction, knowledge graph traversal, and contextual retrieval.
          </p>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mb-6 p-3 border border-red-500/50 bg-red-950/20 text-red-300 text-xs flex items-start gap-2">
            <span>[!]</span>
            <span className="break-all">{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={googleLogin}
          disabled={isLoggingIn}
          className="w-full py-3.5 px-4 bg-white text-black font-semibold text-xs uppercase tracking-wider border border-white hover:bg-black hover:text-white transition-colors duration-150 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            <span>[ AUTHENTICATING... ]</span>
          ) : (
            <>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887C18.2 16.14 15.645 18 12.24 18c-3.315 0-6-2.685-6-6s2.685-6 6-6c1.47 0 2.815.54 3.86 1.425l2.36-2.36C16.89 3.51 14.715 2.667 12.24 2.667 7.07 2.667 2.89 6.847 2.89 12.017s4.18 9.35 9.35 9.35c5.4 0 8.98-3.795 8.98-9.14 0-.615-.06-1.215-.175-1.792H12.24z" />
              </svg>
              <span>SIGN IN WITH GOOGLE</span>
            </>
          )}
        </button>

        {/* Terminal Footer */}
        <div className="mt-8 pt-4 border-t border-neutral-900 text-center text-[10px] text-neutral-600">
          SECURE REDIS SESSION // HTTPONLY COOKIE
        </div>
      </div>
    </div>
  );
};

export default Login;

