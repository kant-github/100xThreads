import { useState, useEffect } from "react";
import DesignButton from "../buttons/DesignButton";
import InputBoxCalls from "../utility/InputBoxCalls";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { useRecoilValue } from "recoil";
import { userSessionAtom } from "@/recoil/atoms/atom";
import UnclickableTicker from "../ui/UnclickableTicker";

interface UserNameOptionProps {
    hasUserName: boolean;
    className?: string;
    username?: string
}

export default function UserNameOption({ hasUserName, className, username }: UserNameOptionProps) {
    const [addUserNameActive, setAddUserNameActive] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [checking, setChecking] = useState(false);
    const [isTaken, setIsTaken] = useState<boolean | null>(null);
    const session = useRecoilValue(userSessionAtom);

    useEffect(() => {
        if (!newUsername) {
            setIsTaken(null);
            return;
        }

        const timeout = setTimeout(() => {
            checkUsername(newUsername);
        }, 1000); // debounce delay

        return () => clearTimeout(timeout);
    }, [newUsername]);

    const checkUsername = async (name: string) => {
        try {
            console.log("checking for username : ", name);
            setChecking(true);
            const { data } = await axios.get(`${API_URL}/check-username?username=${name}`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                },
            });
            console.log("data is : ", data);
            console.log(data.isTaken);
            setIsTaken(data.isTaken);
        } catch (err) {
            console.error("Error checking username", err);
        } finally {
            setChecking(false);
        }
    };

    function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setNewUsername(e.target.value);
    }

    function addUserNameHandler() {
        setAddUserNameActive(true);
    }

    return (
        <div className={`${className} flex`}>
            {hasUserName ? (
                <div>
                    {username &&
                        <UnclickableTicker className="text-yellow-500">
                            {username}
                        </UnclickableTicker>}
                </div>
            ) : (
                <div className="flex items-center justify-center gap-x-3">
                    {addUserNameActive && (
                        <div className="flex flex-col gap-y-1 relative">
                            <InputBoxCalls
                                value={newUsername}
                                onChange={onChangeHandler}
                                placeholder="choose username"
                            />
                            <span className="absolute -bottom-6 left-2">
                                {checking ? (
                                    <span className="text-xs text-gray-400">Checking...</span>
                                ) : isTaken === false ? (
                                    <span className="text-xs text-green-500">Username available</span>
                                ) : isTaken === true ? (
                                    <span className="text-xs text-red-500">Username is taken</span>
                                ) : null}
                            </span>
                        </div>
                    )}
                    <DesignButton onClick={addUserNameHandler}>
                        {addUserNameActive ? "Confirm" : "Add username"}
                    </DesignButton>
                </div>
            )}
        </div>
    );
}
