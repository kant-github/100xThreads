import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom"
import { useRecoilValue } from "recoil"

export const useGoogleAuthStatus = () => {
    const organizationUser = useRecoilValue(organizationUserAtom);
    const { token_expires_at, access_token } = organizationUser.user;

    if (!token_expires_at || !access_token) return false;

    return new Date(token_expires_at) > new Date();
};
