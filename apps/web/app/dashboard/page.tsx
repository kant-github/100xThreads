'use client';


import Dashboard from "@/components/dashboard/Dashboard";
import DashNav from "@/components/dashboard/DashNav";
import { useState } from "react";

export default function DashboardPageClient() {

    const [groups, setGroups] = useState<any[]>([]);

    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden">
            <div className="min-h-[60px] sm:min-h-[70px] md:min-h-20">
                <DashNav groups={groups} />
            </div>
            <div className="flex-1 overflow-auto">
                <Dashboard />
            </div>
        </div>
    );
}