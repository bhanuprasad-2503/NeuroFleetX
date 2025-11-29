import React, { useState } from "react";
import api from "../services/api";

export default function CreateBookingForm({ onSuccess, onCancel }) {
  const [customerName, setCustomerName] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!customerName || !pickupLocation || !dropoffLocation) {
      alert("Please fill customer, pickup and dropoff.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName,
        pickupLocation,
        dropoffLocation,
        scheduledAt: scheduledAt
          ? new Date(scheduledAt).toISOString()
          : null,
      };

      await api.post("/api/bookings", payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Create booking failed:", err);
      alert("Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm text-slate-100">
      <div>
        <label className="block mb-1 font-medium">Customer Name</label>
        <input
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Pickup Location</label>
        <input
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Dropoff Location</label>
        <input
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Scheduled Time (optional)
        </label>
        <input
          type="datetime-local"
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Creating…" : "Create Booking"}
        </button>
      </div>
    </form>
  );
}
