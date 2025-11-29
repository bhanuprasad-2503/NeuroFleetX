import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { ShieldPlus, Loader2 } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("⚠ All fields are required");
      return;
    }

    setLoading(true);
    try {
      await signup({ fullName: name, email, password, role });

      // ✅ Redirect user to Login page after signup
      navigate("/login");

    } catch (err) {
      setError(err?.error || "❌ Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#05081b]">

      {/* Grid BG */}
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

      {/* Glow Effects */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/25 blur-[140px] rounded-full -top-40 -left-40"></div>
      <div className="absolute w-[600px] h-[600px] bg-purple-600/25 blur-[160px] rounded-full bottom-0 right-0"></div>

      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-[0_0_40px_rgba(160,160,255,0.35)]">

        <div className="flex items-center justify-center gap-3 mb-6">
          <ShieldPlus size={42} className="text-indigo-300 drop-shadow-lg" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-300 text-transparent bg-clip-text tracking-wider">
            NeuroFleetX
          </h1>
        </div>

        <h2 className="text-lg text-center text-gray-200 mb-6 font-medium">
          Create your Fleet Account
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-300 text-center p-2 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/30 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <select
            className="w-full p-3 rounded-xl bg-white/10 border border-white/30 text-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="DISPATCHER">Dispatcher</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 font-bold tracking-wide hover:scale-[1.03] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "SIGN UP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link className="text-indigo-300 font-semibold hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
