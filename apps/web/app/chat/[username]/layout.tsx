'use client'

import { userSessionAtom } from "@/recoil/atoms/atom";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";

interface LayoutProps {
    children: React.ReactNode;
}

export default function ({ children }: LayoutProps) {
    const { data: session } = useSession();
    const setUserSession = useSetRecoilState(userSessionAtom);
    const sessionToken = useMemo(() => session, [session]);
    useEffect(() => {
        if (sessionToken) {
            setUserSession(sessionToken);
        }
    }, [sessionToken, setUserSession]);
    return (
        <div>
            {children}
        </div>
    )
}