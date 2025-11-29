import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Car,
  Activity,
  CalendarCheck2,
  Wrench,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

export default function Sidebar() {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  // ROLE-BASED MENU
  const menuByRole = {
    ADMIN: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/vehicles", label: "Vehicles", icon: Car },
      { to: "/telemetry", label: "Telemetry", icon: Activity },
      { to: "/bookings", label: "Bookings", icon: CalendarCheck2 },
      { to: "/maintenance", label: "Maintenance", icon: Wrench },
      { to: "/reports", label: "Reports", icon: FileText },
    ],
    DISPATCHER: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/vehicles", label: "Vehicles", icon: Car },
      { to: "/bookings", label: "Bookings", icon: CalendarCheck2 },
      { to: "/maintenance", label: "Maintenance", icon: Wrench },
    ],
    CUSTOMER: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/bookings", label: "Bookings", icon: CalendarCheck2 },
    ],
  };

  const navItems = menuByRole[role] || menuByRole.CUSTOMER;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-100 flex flex-col justify-between min-h-screen py-6 px-4 shadow-[4px_0_18px_rgba(0,0,0,0.25)]">

      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 px-3 mb-7 select-none">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-md">🚗</div>
          <h1 className="text-xl font-extrabold tracking-tight">NeuroFleetX</h1>
        </div>

        {/* Role-Based Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium 
                transition-all duration-300
                ${isActive ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 hover:pl-5"}
              `
              }
            >
              <Icon size={19} className="group-hover:scale-110 transition" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl mt-6 font-semibold bg-red-600 hover:bg-red-700 transition-all hover:pl-6"
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}
