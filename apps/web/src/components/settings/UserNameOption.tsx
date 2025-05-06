import { useState, useEffect } from "react";
import DesignButton from "../buttons/DesignButton";
import InputBoxCalls from "../utility/InputBoxCalls";
import axios from "axios";
import { API_URL, USER_URL } from "@/lib/apiAuthRoutes";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { FaCopy } from "react-icons/fa";
import { userProfileAtom } from "@/recoil/atoms/users/userProfileAtom";

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
    const setUserProfileData = useSetRecoilState(userProfileAtom);
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
            setChecking(true);
            const { data } = await axios.get(`${API_URL}/check-username?username=${name}`, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                },
            });

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

    async function addUserNameHandler() {
        if (!addUserNameActive) {
            setAddUserNameActive(true);
            return;
        }
        try {
            const { data } = await axios.put(`${USER_URL}`, {
                username: newUsername
            }, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`,
                },
            })
            console.log("setting the username", data.updatedUser.username);
            if (data.updatedUser.username)
                setUserProfileData(prev => ({
                    ...prev!,
                    username: data.updatedUser.username,
                }));

            setAddUserNameActive(false);
            setNewUsername("");
        } catch (err) {
            console.error("Error in setting the username : ", err);
        }
    }

    return (
        <div className={`${className} flex`}>
            {hasUserName ? (
                <div>
                    {username &&
                        <div className="text-yellow-500 text-xs ml-1 flex items-center justify-center gap-x-2">
                            <span>@{username}</span>
                            <FaCopy className="text-yellow-500/70 cursor-pointer" onClick={() => {
                                navigator.clipboard.writeText(username)
                            }} />
                        </div>}
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
