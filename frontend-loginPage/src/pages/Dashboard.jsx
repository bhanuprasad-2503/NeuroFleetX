import React from 'react'
import Sidebar from '../components/Sidebar'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
export default function Dashboard(){
  const data=[{name:'Mon',uv:4},{name:'Tue',uv:3},{name:'Wed',uv:5}]
  return (
    <div className='flex w-full h-screen'>
      <Sidebar/>
      <main className='flex-1 p-8 bg-white'>
        <div className='grid grid-cols-3 gap-4 mb-6'>
          <div className='p-4 bg-white rounded shadow'>Fleet Utilization<div className='text-2xl font-bold'>85%</div></div>
          <div className='p-4 bg-white rounded shadow'>Active Bookings<div className='text-2xl font-bold'>120</div></div>
          <div className='p-4 bg-white rounded shadow'>Maintenance Alerts<div className='text-2xl font-bold'>5</div></div>
        </div>

        <div className='p-4 bg-white rounded shadow mb-6'>
          <h3 className='mb-4'>Fleet Utilization</h3>
          <div style={{width:'100%',height:200}}>
            <ResponsiveContainer width='100%' height={200}>
              <BarChart data={data}><XAxis dataKey='name'/><YAxis/><Tooltip/><Bar dataKey='uv' fill='#2563eb' /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='p-4 bg-white rounded shadow'>
          <h3 className='mb-4'>Recent Bookings</h3>
          <table className='w-full text-left'><thead><tr><th>Customer</th><th>Vehicle</th><th>Status</th></tr></thead><tbody><tr><td>Alice</td><td>Truck A</td><td>Completed</td></tr><tr><td>Bob</td><td>Van B</td><td>In Progress</td></tr></tbody></table>
        </div>
      </main>
    </div>
  )
}
