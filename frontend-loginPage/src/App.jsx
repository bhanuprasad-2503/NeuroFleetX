import React from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import {AuthProvider, useAuth} from './auth/AuthProvider'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Bookings from './pages/Bookings'
import Telemetry from './pages/Telemetry'
import Maintenance from './pages/Maintenance'
import Reports from './pages/Reports'

function PrivateRoute({children}){ const {token}=useAuth(); return token?children:<Navigate to='/login'/> }

export default function App(){
  return (
    <AuthProvider>
      <div className='h-full flex'>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/' element={<PrivateRoute><Dashboard/></PrivateRoute>} />
          <Route path='/vehicles' element={<PrivateRoute><Vehicles/></PrivateRoute>} />
          <Route path='/bookings' element={<PrivateRoute><Bookings/></PrivateRoute>} />
          <Route path='/telemetry' element={<PrivateRoute><Telemetry/></PrivateRoute>} />
          <Route path='/maintenance' element={<PrivateRoute><Maintenance/></PrivateRoute>} />
          <Route path='/reports' element={<PrivateRoute><Reports/></PrivateRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
