import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AssignVehicleModal({ booking, onClose, onAssigned }) {
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicleId, setSelectedVehicleId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAvailable()
  }, [])

  async function loadAvailable() {
    try {
      const res = await api.get('/api/bookings/available-vehicles')
      setVehicles(res.data)
      if (res.data.length) setSelectedVehicleId(res.data[0].id)
    } catch (err) {
      console.error(err)
      setVehicles([])
    }
  }

  async function assign() {
    if (!selectedVehicleId) return alert('Select a vehicle')
    setLoading(true)
    try {
      const res = await api.post(`/api/bookings/${booking.id}/assign`, {
        vehicleId: selectedVehicleId,
      })
      if (res.data.success) {
        await onAssigned()
      } else {
        alert(res.data.message || 'Assign failed')
      }
    } catch (err) {
      console.error(err)
      alert('Assign failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      {/* Dark modal card with max height so no giant white scroll */}
      <div className="w-full max-w-md bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 max-h-[80vh] overflow-y-auto">
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Assign Vehicle</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          {/* Booking info */}
          <div className="mb-4 text-sm text-slate-300">
            <div>
              Booking:{' '}
              <span className="font-semibold text-white">
                {booking.customerName}
              </span>
            </div>
            <div>
              Route:{' '}
              <span className="font-semibold">
                {booking.pickupLocation} → {booking.dropoffLocation}
              </span>
            </div>
          </div>

          {/* Vehicle select */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-slate-200">
              Available Vehicles
            </label>
            <select
              className="w-full p-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedVehicleId || ''}
              onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
            >
              {vehicles.length === 0 && (
                <option value="">No available vehicles</option>
              )}
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} — {v.model} (cap {v.capacity})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              Scroll inside this list if there are many vehicles.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold disabled:opacity-60"
              onClick={assign}
              disabled={loading}
            >
              {loading ? 'Assigning…' : 'Assign Vehicle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
