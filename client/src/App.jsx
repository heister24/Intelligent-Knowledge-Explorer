import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import api from "./configs/api";
import { setUserData } from "./redux/userSlice";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/getMe");
        const user = response.data?.user || response.data;
        dispatch(setUserData(user));
      } catch (error) {
        const status = error.response?.status;
        if (status === 401) {
          // Normal for non-logged-in visitors/expired sessions
          console.info("User session not found or expired [HTTP 401]. User is logged out.");
        } else {
          console.error(
            `Failed to fetch user session [HTTP ${status || "Network Error"}]:`,
            error.response?.data?.message || error.message,
          );
        }
        dispatch(setUserData(null));
      }
    };
    getUser();
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default App;
