'use client';
import Dashboard from "@/components/dashboard/Dashboard";
import DashNav from "@/components/dashboard/DashNav";
import { USER_URL } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { userProfileAtom } from "@/recoil/atoms/users/userProfileAtom";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function DashboardPageClient() {
    const session = useRecoilValue(userSessionAtom);
    const setUserProfileData = useSetRecoilState(userProfileAtom);
    const fetchUserDetails = useCallback(async (userId: string) => {
        try {
            const { data } = await axios.get(`${USER_URL}/${userId}`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`
                }
            });
            setUserProfileData(data.data);
        } catch (err) {
            console.error("Error in fetching the user details", err);
        }
    }, [session.user?.token]);

    useEffect(() => {
        if (session.user?.id) {
            fetchUserDetails(session.user.id);
        }
    }, [session.user?.id, fetchUserDetails]);

    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden">
            <div className="min-h-[60px] sm:min-h-[70px] md:min-h-20">
                <DashNav />
            </div>
            <div className="flex-1 overflow-auto">
                <Dashboard />
            </div>
        </div>
    );
}