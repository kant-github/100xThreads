"use client"
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import axios from 'axios'
import OrgDashboard from '@/components/organization/OrgDashboard'
import { userSessionAtom } from '@/recoil/atoms/atom'
import { ORGANIZATION } from '@/lib/apiAuthRoutes'
import ProtectedOrganizationComponent from '@/components/organization/ProtectedOrganizationComponent'
import { UserType } from 'types'
import { organizationChannelsAtom, organizationEventChannelsAtom, organizationWelcomeChannelAtom } from '@/recoil/atoms/organizationAtoms/organizationChannelAtoms'
import { organizationUsersAtom } from '@/recoil/atoms/organizationAtoms/organizationUsersAtom'

export type protectedOrganizationMetadata = {
    name: string,
    description: string,
    owner: UserType,
    tags: string[],
    access_type: string,
    passwordSalt: string,
    image: string,
    organizationColor: string,
    organization_type: string,
    created_at: string
}

export default function OrgPage({ params }: { params: { id: string } }) {
    const session = useRecoilValue(userSessionAtom)
    const setEventChannel = useSetRecoilState(organizationEventChannelsAtom)
    const setChannels = useSetRecoilState(organizationChannelsAtom)
    const setWelcomeChannel = useSetRecoilState(organizationWelcomeChannelAtom)
    const setOrganizationUsers = useSetRecoilState(organizationUsersAtom);
    const [flag, setFlag] = useState<'PROTECTED' | 'ALLOWED' | 'INIT'>('INIT')
    const [data, setData] = useState<protectedOrganizationMetadata>({} as protectedOrganizationMetadata)

    const updateChannels = useCallback((channelData: any) => {
        const { eventChannel, channels, welcomeChannel, organizationUsers } = channelData
        setEventChannel(eventChannel);
        setChannels(channels);
        setWelcomeChannel(welcomeChannel);
        setOrganizationUsers(organizationUsers)
    }, [setEventChannel, setChannels, setWelcomeChannel, setOrganizationUsers])

    const fetchOrgMetadata = useCallback(async () => {
        if (!session.user?.token || !params.id) return

        try {
            const response = await axios.get(
                `${ORGANIZATION}/join/${params.id}`,
                {
                    headers: {
                        authorization: `Bearer ${session.user.token}`,
                    },
                }
            )
            console.log("response is : ", response.data);

            if (response.data.flag === 'ALLOWED') {
                setFlag('ALLOWED')
                updateChannels(response.data.data)
            } else {
                setFlag('PROTECTED')
                setData(response.data.data)
            }
        } catch (error) {
            console.log("some error occured")
        }
    }, [session.user?.token, params.id, updateChannels])

    useEffect(() => {
        fetchOrgMetadata()
    }, [fetchOrgMetadata])

    const protectedComponent = useMemo(() => (
        <ProtectedOrganizationComponent
            setFlag={setFlag}
            organizationId={params.id}
            metaData={data}
        />
    ), [data, params.id])

    if (flag === 'INIT') return null

    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden">
            {flag === 'PROTECTED' && protectedComponent}
            {flag === 'ALLOWED' && (
                <div className="flex-1 overflow-auto">
                    <OrgDashboard />
                </div>
            )}
        </div>
    )
}