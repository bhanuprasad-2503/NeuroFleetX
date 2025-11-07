import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../auth/AuthProvider'
export default function Signup(){
  const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[role,setRole]=useState('CUSTOMER')
  const {signup,login}=useAuth(); const nav=useNavigate()
  async function s(e){ e.preventDefault(); try{ await signup({fullName:name,email,password,role}); await login(email,password); nav('/') }catch(e){ alert('Signup failed') } }
  return (
    <div className='flex-1 flex items-center justify-center p-12 bg-slate-50'>
      <div className='max-w-sm w-full bg-white p-8 rounded shadow'>
        <div className='text-center mb-6'><div className='text-3xl font-bold'>NeuroFleetX</div></div>
        <h2 className='text-xl font-semibold mb-4 text-center'>SIGN UP</h2>
        <form className='space-y-3' onSubmit={s}>
          <input className='w-full p-3 border rounded' placeholder='Full name' value={name} onChange={e=>setName(e.target.value)} />
          <input className='w-full p-3 border rounded' placeholder='Email address' value={email} onChange={e=>setEmail(e.target.value)} />
          <input className='w-full p-3 border rounded' placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
          <select className='w-full p-3 border rounded' value={role} onChange={e=>setRole(e.target.value)}><option value='CUSTOMER'>Customer</option><option value='DISPATCHER'>Dispatcher</option><option value='ADMIN'>Admin</option></select>
          <button className='w-full p-3 bg-blue-600 text-white rounded'>Sign up</button>
        </form>
        <div className='mt-4 text-center text-sm'>Already have an account? <a href='/login' className='text-blue-600'>Log in</a></div>
      </div>
    </div>
  )
}
