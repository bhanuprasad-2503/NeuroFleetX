import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!email || !password) {
      setErr("⚠ Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setErr(error?.error || "❌ Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#05081b]">

      {}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
          linear-gradient(rgba(120,150,255,0.12) 1px, transparent 1px),
          linear-gradient(90deg, rgba(120,150,255,0.12) 1px, transparent 1px)
        `,
          backgroundSize: "70px 70px",
        }}
      ></div>

      {}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/25 blur-[140px] rounded-full -top-40 -left-40"></div>

      {}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/25 blur-[160px] rounded-full bottom-0 right-0"></div>

      {}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-[0_0_40px_rgba(140,140,255,0.35)]">

        {}
        <div className="flex items-center justify-center gap-3 mb-6">
          <ShieldCheck size={42} className="text-indigo-300 drop-shadow-lg" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-300 text-transparent bg-clip-text tracking-wider">
            NeuroFleetX
          </h1>
        </div>

        <h2 className="text-lg text-center text-gray-200 mb-6 font-medium">
          Sign in to your Fleet Dashboard
        </h2>

        {err && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-300 text-center p-2 rounded-xl mb-4">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/30 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/30 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 font-bold tracking-wide hover:scale-[1.03] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "LOGIN"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          New user?{" "}
          <Link className="text-indigo-300 font-semibold hover:underline" to="/signup">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
