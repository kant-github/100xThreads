"use client"
import OrgNavBar from '@/components/organization/OrgNavBar';
import OrgDashboard from '@/components/organization/OrgDashboard';

export default function OrgPage({ params }: { params: { id: string } }) {

    

    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden">
            <div className="min-h-[60px] sm:min-h-[70px] md:min-h-20">
                <OrgNavBar />
            </div>
            <div className="flex-1 overflow-auto">
                <OrgDashboard />
            </div>
        </div>
    );
}
