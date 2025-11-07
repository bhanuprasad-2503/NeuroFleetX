import React,{createContext,useContext,useState} from 'react'
import api from '../services/api'
const AuthContext=createContext()
export function useAuth(){return useContext(AuthContext)}
export function AuthProvider({children}){
  const [token,setToken]=useState(localStorage.getItem('nf_token')||null)
  const [role,setRole]=useState(localStorage.getItem('nf_role')||null)
  const login=async(email,password)=>{ const r=await api.post('/api/auth/login',{email,password}); localStorage.setItem('nf_token',r.data.token); localStorage.setItem('nf_role',r.data.role); setToken(r.data.token); setRole(r.data.role); return r }
  const signup=async(payload)=>{ return api.post('/api/auth/register',payload) }
  const logout=()=>{ localStorage.removeItem('nf_token'); localStorage.removeItem('nf_role'); setToken(null); setRole(null) }
  return <AuthContext.Provider value={{token,role,login,signup,logout}}>{children}</AuthContext.Provider>
}
