import React,{useState} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import {useAuth} from '../auth/AuthProvider'
export default function Login(){
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[err,setErr]=useState(null)
  const {login}=useAuth(); const nav=useNavigate()
  async function s(e){ e.preventDefault(); try{ await login(email,password); nav('/') }catch(err){ setErr(err?.response?.data?.message||'Login failed') } }
  return (
    <div className='flex-1 flex items-center justify-center p-12 bg-slate-50'>
      <div className='max-w-sm w-full bg-white p-8 rounded shadow'>
        <div className='text-center mb-6'><div className='text-3xl font-bold'>NeuroFleetX</div></div>
        <h2 className='text-xl font-semibold mb-4 text-center'>LOGIN</h2>
        {err&&<div className='text-red-600 mb-2'>{err}</div>}
        <form className='space-y-3' onSubmit={s}>
          <input className='w-full p-3 border rounded' placeholder='Email address' value={email} onChange={e=>setEmail(e.target.value)} />
          <input className='w-full p-3 border rounded' placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
          <button className='w-full p-3 bg-blue-600 text-white rounded'>Log in</button>
        </form>
        <div className='mt-4 text-center text-sm'>Don't have an account? <Link to='/signup' className='text-blue-600'>Sign up</Link></div>
      </div>
    </div>
  )
}
