import React from 'react'
export default function Sidebar(){ return (
  <aside className='w-64 bg-slate-900 text-white p-6 flex flex-col gap-4'>
    <div className='flex items-center gap-3 mb-6'><div className='w-10 h-10 bg-blue-500 rounded flex items-center justify-center'>🚗</div><div className='text-xl font-bold'>NeuroFleetX</div></div>
    <nav className='flex flex-col gap-2'>
      <a href='/' className='p-2 rounded bg-slate-800'>Dashboard</a>
      <a href='/vehicles' className='p-2 rounded hover:bg-slate-800'>Vehicles</a>
      <a href='/telemetry' className='p-2 rounded hover:bg-slate-800'>Telemetry</a>
      <a href='/bookings' className='p-2 rounded hover:bg-slate-800'>Bookings</a>
      <a href='/maintenance' className='p-2 rounded hover:bg-slate-800'>Maintenance</a>
      <a href='/reports' className='p-2 rounded hover:bg-slate-800'>Reports</a>
    </nav>
  </aside>
)}