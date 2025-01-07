"use client"

import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import axios from 'axios'
import OrgDashboard from '@/components/organization/OrgDashboard'
import { userSessionAtom } from '@/recoil/atoms/atom'
import { organizationChannels, organizationEventChannels, organizationWelcomeChannel } from '@/recoil/atoms/organizationMetaDataAtom'
import { ORGANIZATION } from '@/lib/apiAuthRoutes'
import ProtectedOrganizationComponent from '@/components/organization/ProtectedOrganizationComponent'
import { UserType } from 'types'

export type protectedOrganizationMetadata = {
    name: string,
    description: string,
    owner: UserType,
    tags: string[],
    access_type: string,
    image: string,
    organizationColor: string,
    organization_type: string,
    created_at: string
}

export default function OrgPage({ params }: { params: { id: string } }) {
    const session = useRecoilValue(userSessionAtom)
    const setEventChannel = useSetRecoilState(organizationEventChannels)
    const setChannels = useSetRecoilState(organizationChannels)
    const setWelcomeChannel = useSetRecoilState(organizationWelcomeChannel)
    const [flag, setFlag] = useState<'PROTECTED' | 'ALLOWED' | 'INIT'>('INIT')
    const [data, setData] = useState<protectedOrganizationMetadata>({} as protectedOrganizationMetadata);
    console.log("state is : ", flag);

    const fetchOrgMetadata = async (password?: string) => {
        if (!session.user?.token || !params.id) return

        try {
            const response = await axios.get(
                `${ORGANIZATION}/join/${params.id}`,
                {
                    headers: {
                        authorization: `Bearer ${session.user.token}`,
                    },
                    params: password ? { password } : undefined
                }
            )

            if (response.data.flag === 'ALLOWED') {
                setFlag('ALLOWED');
                const { eventChannel, channels, welcomeChannel } = response.data.data
                setEventChannel(eventChannel)
                setChannels(channels)
                setWelcomeChannel(welcomeChannel)
            } else {
                setFlag('PROTECTED')
                setData(response.data.data);
            }
        } catch (error) {
            console.log("some error occured");
        }
    }

    useEffect(() => {
        fetchOrgMetadata()
    }, [session.user?.token, params.id])

    return (
        <>
            {
                flag !== 'INIT' && (
                    <div className="h-[100dvh] w-full flex flex-col overflow-hidden">
                        {flag === 'PROTECTED' && (
                            <ProtectedOrganizationComponent metaData={data} />
                        )}
                        {flag === 'ALLOWED' && (
                            <div className="flex-1 overflow-auto">
                                <OrgDashboard />
                            </div>
                        )}
                    </div>
                )
            }
        </>
    )
}