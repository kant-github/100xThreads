import { userSessionAtom } from "@/recoil/atoms/atom"
import { useRecoilValue } from "recoil"

export default function () {
    const session = useRecoilValue(userSessionAtom);

    return (
        <div>
            
            {session.user?.token}
        </div>
    )
}