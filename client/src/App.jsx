import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [status, setStatus] = useState("Checking...");
  const [error, setError] = useState("");

  useEffect(() => {
    const fun = async () => {
      const {data} = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth/health`,
      );
      console.log(data);
      setStatus(data)
    };
    fun();
  }, []);
  return (
    <main style={{ padding: 30 }}>
      <h1>Intelligent Knowledge Explorer</h1>
      <h2>Auth Service Status</h2>
      <p>{status}</p>
      {error && <p role="alert">{error}</p>}
    </main>
  );
}
