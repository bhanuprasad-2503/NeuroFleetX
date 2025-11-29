import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Gauge, Droplets, Thermometer, Route, Clock } from "lucide-react";

export default function Telemetry() {
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTelemetry = async () => {
    try {
      const response = await api.get("/api/telemetry");
      setTelemetry(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("❌ Error fetching telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  // Badge Logic
  const getFuelBadge = (fuel) => {
    if (fuel < 30) return { col: "bg-red-500/30 text-red-300 border-red-400", txt: "LOW" };
    if (fuel < 60) return { col: "bg-yellow-500/30 text-yellow-300 border-yellow-400", txt: "MEDIUM" };
    return { col: "bg-green-500/30 text-green-300 border-green-400", txt: "GOOD" };
  };

  const getTempBadge = (temp) => {
    if (temp >= 90) return { col: "bg-red-500/30 text-red-300 border-red-400", txt: "HIGH" };
    if (temp >= 75) return { col: "bg-yellow-500/30 text-yellow-300 border-yellow-400", txt: "MEDIUM" };
    return { col: "bg-green-500/30 text-green-300 border-green-400", txt: "NORMAL" };
  };

  const getTimeAgo = (t) => {
    const mins = Math.floor((new Date() - new Date(t)) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    return `${Math.floor(mins / 60)} hr ago`;
  };

  return (
    <div className="flex-1 p-10 min-h-screen bg-gradient-to-br from-[#0D1224] to-[#101A33] text-white">

      {/* Title */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-wide">
          <Gauge size={30} className="text-indigo-400" />
          LIVE VEHICLE TELEMETRY
        </h1>

        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock size={18} />
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {loading ? (
        <p className="opacity-60 italic">📡 Loading telemetry...</p>
      ) : telemetry.length ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {telemetry.map((t) => {
            const fuel = getFuelBadge(t.fuelLevel);
            const temp = getTempBadge(t.engineTemp);

            return (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_25px_rgba(120,120,255,.35)] hover:shadow-[0_0_35px_rgba(160,160,255,.55)] hover:scale-[1.02] transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-xl tracking-wide">
                    {t.vehicleRegistration || "Unknown Vehicle"}
                  </h2>
                  <span className="text-xs opacity-70">
                    {new Date(t.recordedAt).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm opacity-80 mb-4">
                  Vehicle ID: <span className="font-semibold">{t.vehicleId}</span>
                </p>

                {/* Fuel */}
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2">
                    <Droplets className="text-blue-400" size={18} />
                    Fuel: <span className="font-semibold">{t.fuelLevel}%</span>
                  </span>
                  <span
                    className={`px-2 py-1 border rounded-xl text-xs font-bold ${fuel.col}`}
                  >
                    {fuel.txt}
                  </span>
                </div>

                {/* Temperature */}
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2">
                    <Thermometer className="text-orange-400" size={18} />
                    Temp: <span className="font-semibold">{t.engineTemp}°C</span>
                  </span>
                  <span
                    className={`px-2 py-1 border rounded-xl text-xs font-bold ${temp.col}`}
                  >
                    {temp.txt}
                  </span>
                </div>

                {/* Mileage */}
                <span className="flex items-center gap-2 mt-2 text-sm text-indigo-300">
                  <Route size={18} />
                  {t.mileage} km
                </span>

                {/* Location */}
                {t.lat && t.lng && (
                  <p className="text-xs opacity-70 mt-3">
                    📍 {t.lat.toFixed(3)}, {t.lng.toFixed(3)}
                  </p>
                )}

                {/* Time Ago */}
                <p className="text-xs opacity-50 mt-2 italic">
                  Last update {getTimeAgo(t.recordedAt)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="opacity-60">❌ No telemetry data</p>
      )}
    </div>
  );
}
