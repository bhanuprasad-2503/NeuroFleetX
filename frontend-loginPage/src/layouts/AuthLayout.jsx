import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#05081b]">

      {}
      <div
        className="absolute inset-0 opacity-25"
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
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
