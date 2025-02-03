"use client"
import SkeletonDashboard from "@/components/skeletons/DashboardSkeleton";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import {  useSetRecoilState } from "recoil";
export default function ({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { id: string };
}>) {
    const { data: session, status } = useSession();
    const setUserSession = useSetRecoilState(userSessionAtom);
    const setOrganizationId = useSetRecoilState(organizationIdAtom);

    const sessionToken = useMemo(() => session, [session]);

    useEffect(() => {
        if (sessionToken) {
            setUserSession(sessionToken);
        }
    }, [sessionToken, setUserSession]);

    useEffect(() => {
        if (params?.id) {
            setOrganizationId(params.id);
        }
    }, [params?.id, setOrganizationId]);

    
    return (
        <div className="h-screen">
            {children}
        </div>
    )
}