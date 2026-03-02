import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );

      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back 🤍");

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1EB]" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="bg-[#FAF7F2] p-10 rounded-3xl shadow-xl w-96 transition-all duration-300 hover:shadow-2xl">

        <h2
          className="text-3xl text-[#3E3A37] text-center mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-[#F5F1EB] border border-[#E4DAD2] focus:outline-none focus:ring-2 focus:ring-[#B08968]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-[#F5F1EB] border border-[#E4DAD2] focus:outline-none focus:ring-2 focus:ring-[#B08968]"
          />

          <button
            type="submit"
            className="w-full bg-[#B08968] text-white p-3 rounded-xl font-medium hover:bg-[#9C7455] transition duration-300"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;