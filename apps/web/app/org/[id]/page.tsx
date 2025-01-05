"use client"
import OrgNavBar from '@/components/organization/OrgNavBar';
import OrgDashboard from '@/components/organization/OrgDashboard';
import { useEffect } from 'react';
import axios from 'axios';
import { ORGANIZATION } from '@/lib/apiAuthRoutes';
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';

export default function OrgPage({ params }: { params: { id: string } }) {
    const session = useRecoilValue(userSessionAtom);
    useEffect(() => {
        const fetchOrganizationMetaData = async () => {
            const { data } = await axios.get(`${ORGANIZATION}/${params.id}`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                },
            });
            console.log("data is : ", data);
        }

        fetchOrganizationMetaData();
    }, [session.user?.token])

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
