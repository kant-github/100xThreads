'use client';
import Dashboard from "@/components/dashboard/Dashboard";
import DashNav from "@/components/dashboard/DashNav";
import GoogleCalendarConnectionDialog from "@/components/utility/GoogleCalendarConnectionDialog";
import { USER_URL } from "@/lib/apiAuthRoutes";
import isExpiredtoken from "@/lib/isExpiredToken";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { myEventsAtom } from "@/recoil/atoms/events/myEventsAtom";
import { userProfileAtom } from "@/recoil/atoms/users/userProfileAtom";
import axios from "axios";
import { fetchMyEvents } from "fetch/fetchMyEvents";
import { useEffect, useCallback, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export default function DashboardPageClient() {
    const session = useRecoilValue(userSessionAtom);
    const [userProfileData, setUserProfileData] = useRecoilState(userProfileAtom);
    const [show, setShow] = useState<boolean>(false);
    const setEvents = useSetRecoilState(myEventsAtom);



    const fetchUserDetails = useCallback(async (userId: string) => {
        try {
            const { data } = await axios.get(`${USER_URL}/${userId}`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`
                }
            });
            setUserProfileData(data.data);
            const fetchedEvents = await fetchMyEvents(session.user?.token!);
            setEvents(fetchedEvents);
        } catch (err) {
            console.error("Error in fetching the user details", err);
        }
    }, [session.user?.token]);

    useEffect(() => {
        if (session.user?.id) {
            fetchUserDetails(session.user.id);
        }
    }, [session.user?.id, fetchUserDetails]);

    useEffect(() => {
        const shouldShowDialog = !userProfileData.token_expires_at ||
            isExpiredtoken(userProfileData.token_expires_at);

        if (shouldShowDialog) {
            console.log("Token expired or doesn't exist");
            setShow(true);
        } else {
            setShow(false);
        }
    }, [userProfileData.token_expires_at]);


    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden relative">
            {show && <GoogleCalendarConnectionDialog setOpen={setShow} />}
            <div className="min-h-[60px] sm:min-h-[70px] md:min-h-20">
                <DashNav />
            </div>
            <div className="flex-1 overflow-auto">
                <Dashboard />
            </div>
        </div>
    );
}