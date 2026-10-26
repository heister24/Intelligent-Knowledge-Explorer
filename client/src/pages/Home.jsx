import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../configs/firebase";
import api from "../configs/api";

const Home = () => {
  const handleLogin = async (token) => {
    try {
      const response = await api.post("/auth/login", { token });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const googleLogin = async () => {
    const response = await signInWithPopup(auth, googleProvider);
    const token = await response.user.getIdToken();
    await handleLogin(token);
  };
  return (
    <div>
      <button type="button" onClick={googleLogin}>
        Login using Google
      </button>
    </div>
  );
};

export default Home;
