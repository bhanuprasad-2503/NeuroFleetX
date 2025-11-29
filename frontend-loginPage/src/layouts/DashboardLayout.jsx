import React from "react";
import Sidebar from "../components/Sidebar"; 
import "../App.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
