import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    model: "",
    registrationNumber: "",
    capacity: 4,
    status: "AVAILABLE",
  });

  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = () => {
    api
      .get("/api/vehicles")
      .then((r) => setVehicles(r.data))
      .catch(() => {});
  };

  const handleSubmit = () => {
    const request = editing
      ? api.put(`/api/vehicles/${editing.id}`, form)
      : api.post(`/api/vehicles`, form);

    request.then(fetchVehicles);
    setEditing(null);

    setForm({
      model: "",
      registrationNumber: "",
      capacity: 4,
      status: "AVAILABLE",
    });
  };

  const handleEdit = (v) => {
    setEditing(v);
    setForm({
      model: v.model,
      registrationNumber: v.registrationNumber,
      capacity: v.capacity,
      status: v.status,
    });
  };

  const handleDelete = (id) => {
    if (confirm("Delete this vehicle?")) {
      api.delete(`/api/vehicles/${id}`).then(fetchVehicles);
    }
  };

  return (
    <div className="flex-1 p-10 min-h-screen bg-gradient-to-br from-[#0D1224] to-[#101A33] text-white">

      <h1 className="text-3xl font-extrabold tracking-wide mb-8">
        🚗 Vehicles Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* 🚀 FUTURISTIC FORM */}
        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_35px_rgba(120,120,255,0.2)]">

          <h3 className="font-bold text-xl mb-5">
            {editing ? "✏️ Edit Vehicle" : "➕ Add Vehicle"}
          </h3>

          <input
            className="w-full p-3 bg-white/10 border border-white/30 rounded-xl mb-3 placeholder-gray-300"
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />

          <input
            className="w-full p-3 bg-white/10 border border-white/30 rounded-xl mb-3 placeholder-gray-300"
            placeholder="Registration Number"
            value={form.registrationNumber}
            onChange={(e) =>
              setForm({ ...form, registrationNumber: e.target.value })
            }
          />

          <input
            className="w-full p-3 bg-white/10 border border-white/30 rounded-xl mb-3 placeholder-gray-300"
            placeholder="Capacity"
            type="number"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: parseInt(e.target.value) || 0 })
            }
          />

          <select
            className="w-full p-3 bg-white/10 border border-white/30 rounded-xl mb-4"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>AVAILABLE</option>
            <option>IN_USE</option>
            <option>MAINTENANCE</option>
            <option>OFFLINE</option>
          </select>

          <button
            className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] transition-all font-semibold"
            onClick={handleSubmit}
          >
            {editing ? "💾 Save Changes" : "🚀 Create Vehicle"}
          </button>
        </div>

        {/* 🚀 NEON ANIMATED VEHICLE CARDS */}
        <div className="space-y-4">
          {vehicles.length > 0 ? (
            vehicles.map((v) => (
              <div
                key={v.id}
                className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(80,80,255,0.22)] hover:shadow-[0_0_35px_rgba(110,110,255,0.4)] hover:scale-[1.02] transition-all"
              >
                <div className="flex justify-between items-center">
                  
                  <div>
                    <h2 className="text-xl font-bold tracking-wide">
                      {v.registrationNumber} · {v.model}
                    </h2>

                    <p className="text-sm mt-1 opacity-80">
                      Capacity: {v.capacity} seats
                    </p>

                    <p className="text-sm mt-1 opacity-80">
                      Last Seen: {v.lastSeen || "N/A"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-xl border ${
                      v.status === "AVAILABLE"
                        ? "bg-green-400/25 text-green-300 border-green-400"
                        : v.status === "IN_USE"
                        ? "bg-blue-400/25 text-blue-300 border-blue-400"
                        : v.status === "MAINTENANCE"
                        ? "bg-yellow-400/25 text-yellow-300 border-yellow-400"
                        : "bg-gray-400/25 text-gray-300 border-gray-400"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(v)}
                    className="px-4 py-1 rounded-lg text-black font-semibold bg-yellow-400 hover:bg-yellow-300 transition-all"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleDelete(v.id)}
                    className="px-4 py-1 rounded-lg font-semibold bg-red-500 hover:bg-red-400 transition-all"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="italic opacity-70">No vehicles found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
