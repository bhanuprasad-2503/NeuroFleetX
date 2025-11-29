import React, { useEffect, useState } from "react";
import api from "../services/api";
import { AlertTriangle, CheckCircle, Wrench } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Maintenance() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api
      .get("/api/maintenance")
      .then((r) => {
        const sorted = r.data.sort((a, b) => b.riskScore - a.riskScore);
        setAlerts(sorted);
      })
      .catch((err) => console.error("Error fetching maintenance alerts:", err));
  }, []);

  
  const getRiskStyle = (score) => {
    if (score >= 80)
      return {
        badge: "bg-red-500/30 text-red-300 border-red-400 shadow-red-500/50",
        icon: <AlertTriangle size={16} />,
        label: "HIGH",
      };

    if (score >= 50)
      return {
        badge:
          "bg-yellow-500/25 text-yellow-300 border-yellow-400 shadow-yellow-400/50",
        icon: <Wrench size={16} />,
        label: "MEDIUM",
      };

    return {
      badge: "bg-green-500/25 text-green-300 border-green-400 shadow-green-400/50",
      icon: <CheckCircle size={16} />,
      label: "LOW",
    };
  };

  
  const getChartData = (riskScore) => {
    return [
      { name: "Fuel", value: Math.max(20, 100 - riskScore) },
      { name: "Brakes", value: Math.max(25, 95 - riskScore) },
      { name: "Engine", value: Math.max(30, 90 - riskScore) },
    ];
  };

  return (
    <div className="flex-1 p-10 min-h-screen bg-gradient-to-br from-[#0D1224] to-[#101A33] text-white">
      <h1 className="text-3xl font-extrabold mb-10 tracking-wide">
        🔧 Predictive Maintenance Console
      </h1>

      {alerts.length ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {alerts.map((a, index) => {
            const risk = getRiskStyle(a.riskScore);
            const health = (100 - a.riskScore).toFixed(1);

            return (
              <div
                key={a.id || index}
                className="
                  p-6 rounded-2xl backdrop-blur-xl border shadow-md 
                  shadow-[0_0_30px_rgba(150,150,255,0.25)]
                  hover:shadow-[0_0_40px_rgba(200,200,255,0.45)]
                  hover:scale-[1.03] transition-all duration-300
                  bg-white/10 border-white/20
                "
              >
                {}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-wide">
                    {a.vehicleRegistration}
                  </h2>

                  <span
                    className={`px-3 py-1 text-xs font-bold border rounded-full flex items-center gap-1 shadow-md ${risk.badge}`}
                  >
                    {risk.icon}
                    {risk.label} • {a.riskScore}%
                  </span>
                </div>

                {}
                <p className="text-sm opacity-80 mb-3">
                  Vehicle ID:{" "}
                  <span className="font-semibold text-white">{a.vehicleId}</span>
                </p>

                {}
                <div className="mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 border border-blue-400 text-blue-300">
                    Health: {health}%
                  </span>
                </div>

                {}
                <div className="h-40 mb-5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData(a.riskScore)}>
                      <XAxis dataKey="name" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#6366F1"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {}
                <p className="text-base font-semibold leading-tight">
                  🛠 Recommendation:{" "}
                  <span className="text-indigo-300 font-bold">
                    {a.recommendation || "N/A"}
                  </span>
                </p>

                <p className="text-xs opacity-50 mt-3 italic">
                  Reported:{" "}
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleString()
                    : "Unknown"}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 italic text-center mt-20 text-lg">
          🎉 No maintenance risks detected. System normal.
        </p>
      )}
    </div>
  );
}
