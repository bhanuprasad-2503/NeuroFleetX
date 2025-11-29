import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    fleetUtilization: 0,
    activeBookings: 0,
    maintenanceAlerts: 0,
    telemetry: {
      activeVehicles: 0,
      avgFuelLevel: 0,
      avgEngineTemp: 0,
      lastUpdated: ""
    }
  });

  const [recentBookings, setRecentBookings] = useState([]);

  
  async function loadMetrics() {
    try {
      const res = await api.get("/api/analytics");
      setMetrics(res.data);
    } catch (e) {
      console.error("Analytics load error:", e);
    }
  }

  
  async function loadRecentBookings() {
    try {
      const res = await api.get("/api/bookings/recent");
      setRecentBookings(res.data);
    } catch (e) {
      console.error("Recent bookings load error:", e);
    }
  }


  useEffect(() => {
    loadMetrics();
    loadRecentBookings();

    const interval = setInterval(() => {
      loadMetrics();
      loadRecentBookings();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const barData = [
    { name: "Mon", uv: 4 },
    { name: "Tue", uv: 3 },
    { name: "Wed", uv: 5 },
    { name: "Thu", uv: 2 },
    { name: "Fri", uv: 6 },
    { name: "Sat", uv: 4 },
    { name: "Sun", uv: 3 },
  ];

  return (
    <div className="flex w-full h-screen bg-[#0A0F24]">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto relative">
        {}
        <div
          className="absolute inset-0 bg-grid opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(55,135,255,0.18) 1px, transparent 1px),
              linear-gradient(90deg, rgba(55,135,255,0.18) 1px, transparent 1px)
            `,
            backgroundSize: "85px 85px",
          }}
        ></div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10 relative z-10">

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-xl text-white">
            <p className="opacity-80 text-sm">Fleet Utilization</p>
            <h2 className="text-4xl font-extrabold">{metrics.fleetUtilization}%</h2>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-xl text-white">
            <p className="opacity-80 text-sm">Active Bookings</p>
            <h2 className="text-4xl font-extrabold">{metrics.activeBookings}</h2>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 shadow-xl text-white">
            <p className="opacity-80 text-sm">Maintenance Alerts</p>
            <h2 className="text-4xl font-extrabold">{metrics.maintenanceAlerts}</h2>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 shadow-xl text-white">
            <p className="opacity-80 text-sm">Live Telemetry Vehicles</p>
            <h2 className="text-4xl font-extrabold">
              {metrics.telemetry.activeVehicles}
            </h2>
          </div>

        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-xl border border-white/20 text-white">
            <h3 className="font-semibold text-lg">Avg Fuel Level</h3>
            <p className="text-3xl mt-2">{metrics.telemetry.avgFuelLevel.toFixed(1)}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-xl border border-white/20 text-white">
            <h3 className="font-semibold text-lg">Avg Engine Temp</h3>
            <p className="text-3xl mt-2">{metrics.telemetry.avgEngineTemp.toFixed(1)}°C</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-xl border border-white/20 text-white">
            <h3 className="font-semibold text-lg">Last Telemetry Update</h3>
            <p className="mt-2 opacity-80 text-sm">
              {metrics.telemetry.lastUpdated || "N/A"}
            </p>
          </div>
        </div>

        {}
        <div className="relative bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/15 mb-10 z-10">
          <h3 className="text-lg font-semibold text-white mb-4">
            Fleet Utilization Trend
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fill: "#fff" }} />
                <YAxis tick={{ fill: "#fff" }} />
                <Tooltip />
                <Bar dataKey="uv" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {}
        <div className="relative bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/15 text-white">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>

          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-300 uppercase text-sm">
                <th className="pb-2 text-left">Customer</th>
                <th className="pb-2 text-left">Vehicle</th>
                <th className="pb-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((b, i) => (
                <tr key={i} className="bg-white/5 hover:bg-indigo-500/20 transition">
                  <td className="py-3 px-2">{b.customerName}</td>
                  <td className="py-3 px-2">{b.vehicle}</td>
                  <td className="py-3 px-2 text-indigo-300">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
