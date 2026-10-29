import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-100/70">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
