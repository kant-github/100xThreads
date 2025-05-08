"use client"
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import axios from 'axios'
import OrgDashboard from '@/components/organization/OrgDashboard'
import { userSessionAtom } from '@/recoil/atoms/atom'
import { ORGANIZATION } from '@/lib/apiAuthRoutes'
import ProtectedOrganizationComponent from '@/components/organization/ProtectedOrganizationComponent'
import { UserType, WelcomeChannel } from 'types/types'
import { organizationChannelsAtom, organizationEventChannelsAtom, organizationWelcomeChannelAtom } from '@/recoil/atoms/organizationAtoms/organizationChannelAtoms'
import { organizationUsersAtom } from '@/recoil/atoms/organizationAtoms/organizationUsersAtom'
import { organizationAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom'
import { useWebSocket } from '@/hooks/useWebsocket'
import { organizationUserAtom } from '@/recoil/atoms/organizationAtoms/organizationUserAtom'

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
    created_at: string,
    WelcomeChannel: WelcomeChannel
}

export default function ({ params }: { params: { id: string } }) {
    const session = useRecoilValue(userSessionAtom)
    const setEventChannel = useSetRecoilState(organizationEventChannelsAtom)
    const setChannels = useSetRecoilState(organizationChannelsAtom)
    const setWelcomeChannel = useSetRecoilState(organizationWelcomeChannelAtom)
    const setOrganizationUsers = useSetRecoilState(organizationUsersAtom);
    const setOrganization = useSetRecoilState(organizationAtom);
    const setOrganizationUser = useSetRecoilState(organizationUserAtom);
    const [flag, setFlag] = useState<'PROTECTED' | 'ALLOWED' | 'INIT'>('INIT')
    const [data, setData] = useState<protectedOrganizationMetadata>({} as protectedOrganizationMetadata)



    const updateChannels = useCallback((channelData: any) => {
        const { organization, eventChannel, channels, welcomeChannel, organizationUsers, organizationUser } = channelData
        console.log("organiztion user ate page.stsx is : ", organizationUser);
        setOrganization(organization);
        setEventChannel(eventChannel);
        setChannels(channels);
        setWelcomeChannel(welcomeChannel);
        setOrganizationUsers(organizationUsers);
        setOrganizationUser(organizationUser);
    }, [setEventChannel, setChannels, setWelcomeChannel, setOrganizationUsers, params.id, useWebSocket])

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
            {/* <OrgNavBar /> */}
            {flag === 'PROTECTED' && protectedComponent}
            {flag === 'ALLOWED' && (<div className="flex-1 overflow-auto">
                <OrgDashboard />
            </div>
            )}
        </div>
    )
}