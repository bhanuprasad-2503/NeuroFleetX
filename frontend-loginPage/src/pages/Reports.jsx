import React, { useState, useEffect } from "react";
import api from "../services/api";
import { FileDown, CheckCircle, AlertTriangle } from "lucide-react";

export default function Reports() {
  const [status, setStatus] = useState(null);       
  const [progress, setProgress] = useState(0);      

  async function exportCSV() {
    try {
      setStatus("loading");
      setProgress(0);

      
      const interval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 7 : p));    
      }, 150);

      const response = await api.get("/api/analytics/export", {
        responseType: "blob",
      });

      clearInterval(interval);
      setProgress(100);
      setStatus("success");

     
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "fleet_report.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus("error");
      setProgress(0);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  return (
    <div className="flex-1 p-10 min-h-screen bg-gradient-to-br from-[#0D1224] to-[#101A33] text-white">

      <h1 className="text-3xl font-extrabold tracking-wide mb-10">
        📊 Fleet Report Export
      </h1>

      {}
      <div className="
        p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20
        shadow-[0_0_30px_rgba(120,120,255,0.25)]
        flex justify-between items-center
      ">
        <div className="text-lg font-medium tracking-wide opacity-90">
          Export full fleet analytics as downloadable report
        </div>

        <button
          onClick={exportCSV}
          disabled={status === "loading"}
          className="
            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:scale-[1.05] transition-all disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          <FileDown size={20} />
          Export CSV
        </button>
      </div>

      {/* 🟦 PROGRESS BAR */}
      {status === "loading" && (
        <div className="mt-6 w-full bg-white/20 rounded-xl overflow-hidden">
          <div
            className="h-3 rounded-xl transition-all"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(to right,
                #4f46e5,
                #6d28d9,
                #22d3ee,
                #4ade80
              )`,
            }}
          />
        </div>
      )}

      {/* 🟢 SUCCESS */}
      {status === "success" && (
        <div className="mt-6 flex items-center gap-2 text-green-400 font-semibold">
          <CheckCircle size={20} /> Report exported successfully!
        </div>
      )}

      {/* 🔴 ERROR */}
      {status === "error" && (
        <div className="mt-6 flex items-center gap-2 text-red-400 font-semibold">
          <AlertTriangle size={20} /> Export failed. Try again.
        </div>
      )}
    </div>
  );
}
