import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../configs/firebase";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = async (token) => {
    try {
      const response = await api.post("/auth/login", { token });
      if (response.data?.success && response.data?.user) {
        dispatch(setUserData(response.data.user));
      } else {
        console.warn("Login response did not contain expected user data:", response.data);
      }
    } catch (error) {
      const status = error.response?.status;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred during login";
      console.error(`Login failed [HTTP ${status || "Network Error"}]:`, errorMessage);
    }
  };

  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const token = await response.user.getIdToken();
      await handleLogin(token);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.info("Google sign-in popup was closed by user.");
      } else {
        console.error(`Google authentication error [${error.code || "unknown"}]:`, error.message);
      }
    }
  };
  return (
    <div>
      <button type="button" onClick={googleLogin}>
        Login using Google
      </button>
    </div>
  );
};

export default Login;
