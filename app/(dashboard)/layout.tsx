"use client";

import React from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopnav } from "@/components/layout/DashboardTopnav";

export default function AuthenticatedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Fixed Left Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area offset by sidebar width */}
      <div className="flex flex-col lg:pl-64 min-h-screen">
        <DashboardTopnav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
