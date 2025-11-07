import React,{useEffect,useState} from 'react'
import api from '../services/api'
export default function Telemetry(){
  const [tele,setTele]=useState([])
  useEffect(()=>{ api.get('/api/telemetry').then(r=>setTele(r.data)).catch(()=>{}) },[])
  return (<div className='flex-1 p-8'><h1 className='text-2xl font-bold mb-4'>Telemetry</h1><div className='space-y-2'>{tele.map(t=>(<div key={t.id} className='p-3 bg-white rounded shadow'><div className='font-semibold'>{t.vehicleRegistration} · {t.timestamp}</div><div className='text-sm'>Fuel: {t.fuelLevel}% | EngineHealth: {t.engineHealth}% | Mileage: {t.mileage} km</div></div>))}</div></div>)
}
