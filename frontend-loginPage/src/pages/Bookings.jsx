import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  Route,
  Users,
  CalendarDays,
  Sparkles,
  CheckCircle,
  Search,
  Filter,
  SortDesc,
} from "lucide-react";
import AssignVehicleModal from "../components/AssignVehicleModal";
import CreateBookingForm from "../components/CreateBookingForm";
import { useAuth } from "../auth/AuthProvider";

const STATUS_BADGE = {
  PENDING: "bg-yellow-100 text-yellow-900",
  ASSIGNED: "bg-blue-100 text-blue-900",
  COMPLETED: "bg-emerald-100 text-emerald-900",
  IN_PROGRESS: "bg-purple-100 text-purple-900",
  CANCELLED: "bg-rose-100 text-rose-900",
};

export default function Bookings() {
  const { role } = useAuth(); // ← GET ROLE HERE

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pref, setPref] = useState({ passengers: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("scheduled_desc");

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    try {
      const r = await api.get("/api/bookings");
      setBookings(r.data || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  }

  const visibleBookings = useMemo(() => {
    let list = [...bookings];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          (b.customerName || "").toLowerCase().includes(q) ||
          (b.pickupLocation || "").toLowerCase().includes(q) ||
          (b.dropoffLocation || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      list = list.filter(
        (b) => (b.status || "PENDING").toUpperCase() === statusFilter
      );
    }

    list.sort((a, b) => {
      const sa = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
      const sb = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;
      const ca = (a.customerName || "").toLowerCase();
      const cb = (b.customerName || "").toLowerCase();

      switch (sortBy) {
        case "scheduled_asc":
          return sa - sb;
        case "scheduled_desc":
          return sb - sa;
        case "customer_asc":
          return ca.localeCompare(cb);
        case "customer_desc":
          return cb.localeCompare(ca);
        default:
          return sb - sa;
      }
    });

    return list;
  }, [bookings, search, statusFilter, sortBy]);

  async function recommend() {
    try {
      const r = await api.post("/api/bookings/recommend", {
        passengers: pref.passengers,
      });
      alert("🚗 Recommended Vehicle:\n" + JSON.stringify(r.data, null, 2));
    } catch (err) {
      console.error("Recommendation error:", err);
      alert("Failed to get recommendation");
    }
  }

  function openAssignModal(booking) {
    setSelectedBooking(booking);
    setShowAssignModal(true);
  }

  async function handleAssigned() {
    setShowAssignModal(false);
    setSelectedBooking(null);
    await loadBookings();
  }

  async function markCompleted(b) {
    try {
      await api.put(`/api/bookings/${b.id}`, {
        ...b,
        status: "COMPLETED",
      });
      await loadBookings();
    } catch (err) {
      console.error("Mark completed failed:", err);
      alert("Failed to update booking");
    }
  }

  async function handleCreateSuccess() {
    setShowCreateModal(false);
    await loadBookings();
  }

  return (
    <div className="flex-1 p-10 min-h-screen bg-gradient-to-br from-[#0D1224] to-[#101A33] text-white">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <Route size={30} className="text-indigo-400" />
          Fleet Bookings Console
        </h1>

        {/* CUSTOMER can create booking */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500"
        >
          + New Booking
        </button>
      </div>

      {/* SMART RECOMMENDATION → HIDE FOR CUSTOMER */}
      {role !== "CUSTOMER" && (
        <div className="p-6 rounded-2xl bg-white/10 border border-white/20 mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
            <Sparkles className="text-yellow-300" /> Smart Vehicle Recommendation
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80">Passengers</span>
              <input
                type="number"
                min={1}
                className="p-3 w-24 bg-white/10 border border-white/30 rounded-xl text-center font-bold"
                value={pref.passengers}
                onChange={(e) =>
                  setPref({
                    passengers: Math.max(1, parseInt(e.target.value || "1")),
                  })
                }
              />
            </div>

            <button
              onClick={recommend}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2"
            >
              <Sparkles size={18} /> Recommend
            </button>
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="p-4 mb-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-4">

        {/* SEARCH */}
        <div className="flex items-center gap-2 flex-1">
          <Search size={18} className="text-indigo-300" />
          <input
            type="text"
            placeholder="Search customer / pickup / dropoff..."
            className="flex-1 bg-transparent border border-white/20 rounded-lg px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATUS FILTER */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-indigo-300" />
          <select
            className="bg-slate-900/70 border border-white/20 rounded-lg px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* SORT */}
        <div className="flex items-center gap-2">
          <SortDesc size={18} className="text-indigo-300" />
          <select
            className="bg-slate-900/70 border border-white/20 rounded-lg px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="scheduled_desc">Time · Newest</option>
            <option value="scheduled_asc">Time · Oldest</option>
            <option value="customer_asc">Customer A→Z</option>
            <option value="customer_desc">Customer Z→A</option>
          </select>
        </div>
      </div>

      {/* BOOKING CARDS */}
      {loading ? (
        <p className="text-center mt-16 opacity-70">Loading...</p>
      ) : visibleBookings.length ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleBookings.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-white/10 border border-white/20 hover:scale-[1.02]"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Users className="text-indigo-300" size={18} />
                  {b.customerName}
                </h2>
                <span
                  className={`text-[11px] px-3 py-1 rounded-full font-semibold ${
                    STATUS_BADGE[b.status] || ""
                  }`}
                >
                  {(b.status || "PENDING").replace("_", " ")}
                </span>
              </div>

              <p className="mt-2 text-sm opacity-90">
                🟩 Pickup: <span className="font-semibold">{b.pickupLocation}</span>
                <br />
                🟥 Dropoff:{" "}
                <span className="font-semibold">{b.dropoffLocation}</span>
              </p>

              <p className="mt-3 text-sm">
                🚗 Vehicle:{" "}
                <span className="font-semibold text-indigo-300">
                  {b.vehicleRegistration && b.vehicleRegistration !== "TBD"
                    ? `${b.vehicleRegistration} (${b.vehicleModel})`
                    : "Not Assigned"}
                </span>
              </p>

              <p className="mt-2 text-xs opacity-70 flex items-center gap-1">
                <CalendarDays size={14} />{" "}
                {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : "Not scheduled"}
              </p>

              {/* ACTION BUTTONS → Hide for CUSTOMER */}
              {role !== "CUSTOMER" && (
                <div className="flex gap-3 mt-4">
                  <button
                    className="flex-1 px-3 py-2 rounded-lg bg-indigo-600"
                    onClick={() => openAssignModal(b)}
                  >
                    Assign Vehicle
                  </button>

                  <button
                    className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 disabled:opacity-40"
                    disabled={b.status === "COMPLETED"}
                    onClick={() => markCompleted(b)}
                  >
                    Mark Completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="opacity-60 italic text-center mt-20 text-lg">
          No bookings found.
        </p>
      )}

      {/* ASSIGN MODAL */}
      {showAssignModal && selectedBooking && (
        <AssignVehicleModal
          booking={selectedBooking}
          onClose={() => setShowAssignModal(false)}
          onAssigned={handleAssigned}
        />
      )}

      {/* CREATE BOOKING MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-lg p-6">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Create New Booking</h3>
              <button onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <CreateBookingForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
