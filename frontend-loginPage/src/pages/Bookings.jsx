import React,{useEffect,useState} from 'react'
import api from '../services/api'
export default function Bookings(){
  const [bookings,setBookings]=useState([]),[pref,setPref]=useState({passengers:1})
  useEffect(()=>{ api.get('/api/bookings').then(r=>setBookings(r.data)).catch(()=>{}) },[])
  async function recommend(){ const r=await api.post('/api/bookings/recommend',{passengers:pref.passengers}); alert('Recommendation: '+JSON.stringify(r.data)) }
  return (<div className='flex-1 p-8'><h1 className='text-2xl font-bold mb-4'>Bookings</h1><div className='mb-4 p-4 bg-white rounded shadow'><h3 className='font-semibold'>Smart recommendation</h3><input type='number' className='p-2 border rounded mr-2' value={pref.passengers} onChange={e=>setPref({passengers:parseInt(e.target.value)})}/><button className='p-2 bg-indigo-600 text-white rounded' onClick={recommend}>Recommend Vehicle</button></div>{bookings.map(b=>(<div key={b.id} className='p-3 bg-white rounded shadow mb-2'><div className='font-semibold'>{b.customerName} → {b.pickupLocation} → {b.dropLocation}</div><div className='text-sm'>Vehicle: {b.vehicleId||'TBD'} | Time: {b.scheduledAt}</div></div>))}</div>)
}
