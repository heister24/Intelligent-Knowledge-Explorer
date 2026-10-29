import { useDispatch, useSelector } from "react-redux";
import api from "../configs/api";
import { setUserData } from "../redux/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user data from Redux state to trigger instant UI update
      dispatch(setUserData(null));
    }
  };

  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-950 px-4 md:px-6 flex items-center justify-between text-xs select-none">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <span className="font-bold tracking-wider text-white uppercase flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-white"></span>
          KNOWLEDGE_EXPLORER
        </span>
        <span className="hidden sm:inline-block border border-neutral-800 text-neutral-400 px-2 py-0.5 text-[10px]">
          v1.0 // GRAPHRAG
        </span>
      </div>

      {/* Right: User Info + Logout Button */}
      <div className="flex items-center gap-3 md:gap-4">
        {userData && (
          <div className="flex items-center gap-2 text-neutral-300">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-6 h-6 rounded-full border border-neutral-700 object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full border border-neutral-700 bg-neutral-800 flex items-center justify-center text-[10px] font-bold">
                {userData.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <span className="hidden md:inline font-medium text-neutral-200">
              {userData.name}
            </span>
          </div>
        )}

        {/* Retro Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-1.5 border border-neutral-700 text-neutral-300 hover:border-white hover:bg-white hover:text-black transition-colors font-medium tracking-wide uppercase cursor-pointer"
        >
          [ LOGOUT ]
        </button>
      </div>
    </header>
  );
};

export default Header;
