import React from 'react'
import api from '../services/api'
export default function Reports(){ async function exportCSV(){ const r=await api.get('/api/analytics/export', { responseType: 'blob' }); const url=window.URL.createObjectURL(r.data); const a=document.createElement('a'); a.href=url; a.download='report.csv'; a.click(); } return (<div className='flex-1 p-8'><h1 className='text-2xl font-bold mb-4'>Reports & Export</h1><div className='p-4 bg-white rounded shadow'><button className='p-2 bg-indigo-600 text-white rounded' onClick={exportCSV}>Export CSV</button></div></div>) }
