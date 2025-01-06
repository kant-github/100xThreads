"use client"
import OrgNavBar from '@/components/organization/OrgNavBar';
import OrgDashboard from '@/components/organization/OrgDashboard';
import { useEffect } from 'react';
import axios from 'axios';
import { ORGANIZATION } from '@/lib/apiAuthRoutes';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { organizationChannels, organizationEventChannels } from '@/recoil/atoms/organizationMetaDataAtom';

export default function OrgPage({ params }: { params: { id: string } }) {
    const session = useRecoilValue(userSessionAtom);
    const setEventChannels = useSetRecoilState(organizationEventChannels);
    const setChannels = useSetRecoilState(organizationChannels);

    useEffect(() => {
        const fetchOrganizationMetaData = async () => {
            try {
                const response = await axios.get(`${ORGANIZATION}/${params.id}`, {
                    headers: {
                        authorization: `Bearer ${session.user?.token}`,
                    },
                });

                if (response.status === 200) {
                    setEventChannels(response.data.data.eventRooms);
                    setChannels(response.data.data.rooms);
                }
            } catch (error) {
                console.error('Error fetching organization metadata:', error);
            }
        };
        if (session.user?.token && params.id) {
            fetchOrganizationMetaData();
        }
    }, [session.user?.token, params.id, setEventChannels]);

    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden">
            {/* <div className="min-h-[60px] sm:min-h-[70px] md:min-h-20">
                <OrgNavBar />
            </div> */}
            <div className="flex-1 overflow-auto">
                <OrgDashboard />
            </div>
        </div>
    );
}
