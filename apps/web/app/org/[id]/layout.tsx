"use client"
import { Ability } from "@/rbac/ability";
import { AbilityProvider } from "@/rbac/abilityContext";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
export default function ({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { id: string };
}>) {
    const { data: session } = useSession();
    const setUserSession = useSetRecoilState(userSessionAtom);
    const setOrganizationId = useSetRecoilState(organizationIdAtom);
    const organizationUserRole = useRecoilValue(organizationUserAtom).role;


    const ability = useMemo(() => {
        return new Ability(organizationUserRole);
    }, [organizationUserRole]);

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
        <AbilityProvider ability={ability}>
            <div className="h-screen">
                {children}
            </div>
        </AbilityProvider>
    )
}