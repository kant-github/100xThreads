'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import P2pLeftComponent from '@/components/chat/p2p/p2pLeftComponent';
import P2pNavBar from '@/components/chat/p2p/p2pNavBar';
import P2pRightComponent from '@/components/chat/p2p/p2pRightComponent';
import axios from 'axios';
import { P2P_URL } from '@/lib/apiAuthRoutes';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { settingsOptionAtom, settingsOptionEnum } from '@/recoil/atoms/SettingsOptionAtom';
import { dashboardOptionsAtom, RendererOption } from '@/recoil/atoms/DashboardOptionsAtom';
import UtilityCard from '@/components/utility/UtilityCard';
import { WhiteBtn } from '@/components/buttons/WhiteBtn';
import DashboardComponentHeading from '@/components/dashboard/DashboardComponentHeading';
import { p2pChatAtom } from '@/recoil/atoms/p2p/p2pChatAtom';
import { p2pUser1Atom } from '@/recoil/atoms/p2p/p2pUser1Atom';
import { p2pUser2Atom } from '@/recoil/atoms/p2p/p2pUser2Atom';

type ChatValidationStatus = 'loading' | 'redirect' | 'allowed' | 'user2_invalid';

export default function Page({ params }: { params: { username: string } }) {
    const router = useRouter();
    const [status, setStatus] = useState<ChatValidationStatus>('loading');
    const session = useRecoilValue(userSessionAtom);
    const setSettingsAtom = useSetRecoilState(settingsOptionAtom);
    const setDashboardAtom = useSetRecoilState(dashboardOptionsAtom);
    const setP2pChats = useSetRecoilState(p2pChatAtom);
    const setP2pUser1 = useSetRecoilState(p2pUser1Atom);
    const setP2pUser2 = useSetRecoilState(p2pUser2Atom);

    function redirectHandler() {
        router.replace('/dashboard');
        setDashboardAtom(RendererOption.Settings);
        setSettingsAtom(settingsOptionEnum.Profile);
    };

    async function fetchP2pChats() {

        try {
            console.log("started chat fetching");
            const { data } = await axios.get(
                `${P2P_URL}/${params.username}`,
                {
                    headers: {
                        authorization: `Bearer ${session.user?.token}`,
                    },
                }
            );
            console.log("chats are : ", data.data);
            setP2pChats(data.data);
            setP2pUser1(data.user1);
            setP2pUser2(data.user2);
        } catch (error) {
            console.error('Failed to validate chat:', error);
            setStatus('user2_invalid');
        }
    }

    useEffect(() => {
        if (!session?.user?.id || !session?.user?.token || !params.username) {
            console.log("returning");
            return
        };
        console.log("making backend call");

        async function checkChatEligibility() {
            try {
                console.log("done backend ca;;");
                const { data } = await axios.get(
                    `${P2P_URL}/case-join?user_2_username=${params.username}`,
                    {
                        headers: {
                            authorization: `Bearer ${session.user?.token}`,
                        },
                    }
                );

                console.log("data.status : ", data.status);

                if (data.status === 'redirect_to_dashboard') {
                    setStatus('redirect');
                } else if (data.status === 'chat_allowed') {
                    setStatus('allowed');
                    fetchP2pChats();
                } else if (data.status === 'user2_has_no_username') {
                    setStatus('user2_invalid');
                }
            } catch (error) {
                console.error('Failed to validate chat:', error);
                setStatus('user2_invalid');
            }
        }

        checkChatEligibility();
    }, [session?.user?.id, session?.user?.token, params.username]);


    const isLoading = status === 'loading';
    const isAllowed = status === 'allowed';
    const showRedirectCard = status === 'redirect';
    const showUser2Invalid = status === 'user2_invalid';


    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden">
            <div className="min-h-[60px] sm:min-h-[70px] md:min-h-20">
                <P2pNavBar />
            </div>

            <div className="flex flex-row flex-1">
                <P2pLeftComponent />

                {isLoading && (
                    <div className="flex justify-center items-center h-screen">Loading...</div>
                )}
                {showUser2Invalid && (
                    <div className="flex justify-center items-center h-screen w-full">
                        User is not available for chat.
                    </div>
                )}

                {showRedirectCard && (
                    <UtilityCard className="dark:bg-neutral-800 dark:border-neutral-600 border-[1px] max-w-lg p-6 relative h-40">
                        <DashboardComponentHeading description="Please set your username to start chatting with your friends">
                            Username not found
                        </DashboardComponentHeading>
                        <WhiteBtn className="mt-4" onClick={redirectHandler}>
                            Set username
                        </WhiteBtn>
                    </UtilityCard>
                )}

                {isAllowed && <P2pRightComponent />}
            </div>
        </div>
    );
}
