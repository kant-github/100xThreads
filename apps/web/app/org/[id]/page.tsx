"use client"
import OrgDashboard from '@/components/organization/OrgDashboard';
import { useEffect } from 'react';
import axios from 'axios';
import { ORGANIZATION } from '@/lib/apiAuthRoutes';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { organizationChannels, organizationEventChannels, organizationWelcomeChannel } from '@/recoil/atoms/organizationMetaDataAtom';
import OrgNavBar from '@/components/organization/OrgNavBar';

export default function OrgPage({ params }: { params: { id: string } }) {
    const session = useRecoilValue(userSessionAtom);
    const setEventChannel = useSetRecoilState(organizationEventChannels);
    const setChannels = useSetRecoilState(organizationChannels);
    const setWelcomeChannel = useSetRecoilState(organizationWelcomeChannel)
    useEffect(() => {
        const fetchOrganizationMetaData = async () => {
            try {
                const response = await axios.get(`${ORGANIZATION}/join/${params.id}`, {
                    headers: {
                        authorization: `Bearer ${session.user?.token}`,
                    },
                });

                console.log("data is : ",response.data);


                if (response.status === 200) {
                    setEventChannel(response.data.data.eventChannel);
                    setChannels(response.data.data.channels);
                    setWelcomeChannel(response.data.data.welcomeChannel)
                }
            } catch (error) {
                console.error('Error fetching organization metadata:', error);
            }
        };
        if (session.user?.token && params.id) {
            fetchOrganizationMetaData();
        }
    }, [session.user?.token, params.id, setEventChannel]);

    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden">
            <div className="min-h-[60px] sm:min-h-[70px] md:min-h-20">
                <OrgNavBar />
            </div>
            <div className="flex-1 overflow-auto">
                {/* <OrgDashboard /> */}
                hi
            </div>
        </div>
    );
}
