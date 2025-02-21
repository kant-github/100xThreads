"use client"
import { userSessionAtom } from "@/recoil/atoms/atom";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
export default function ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, status } = useSession();
    const setUserSession = useSetRecoilState(userSessionAtom);
    const sessionToken = useMemo(() => session, [session]);

    useEffect(() => {
        if (sessionToken) {
            setUserSession(sessionToken);
        }
    }, [sessionToken, setUserSession]);

    return (
        <div className="h-screen">
            {children}
        </div>
    )
}