import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import CrossButton from "./CrossButton";
import { fetchUser, updateUser } from "fetch/fetchUser";
import { FaEdit } from "react-icons/fa";
import { CustomSession } from "app/api/auth/[...nextauth]/options";
import { format } from "date-fns";
import { UserType } from "types/types";
import AppLogo from "../heading/AppLogo";
import Spinner from "../loaders/Spinner";
import AccountInfoButtonGroup from "../ui/AccountInfoButtonGroup";
import { useSession } from "next-auth/react";

interface Props {
    session: CustomSession;
    setAccountInfoDropDown: Dispatch<SetStateAction<boolean>>;
}

export default function AccountInfoModal({ session, setAccountInfoDropDown }: Props) {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { update } = useSession();

    async function get() {
        if (!session?.user?.id || !session?.user?.token) {
            setError("Invalid session. Please log in again.");
            return;
        }
        setLoading(true);
        try {
            const data = await fetchUser(session.user.id, session.user.token);
            setUserData(data);
            setFormData(data); // Initialize formData with fetched data
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setError("Unable to load account details. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        get();
    }, [session]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }) as UserType);
    };


    const saveChanges = async () => {
        if (!formData || !session?.user?.token) return;

        if (!formData.email.includes("@")) {
            setError("Invalid email format");
            return;
        }

        try {
            await updateUser(formData, session.user.token); // Save changes to the backend

            setUserData(formData);
            setEditMode(false);
            setError(null);

            await update({
                ...session,
                user: {
                    ...session.user,
                    name: formData.name,
                    email: formData.email,
                },
            });
        } catch (error) {
            console.error("Failed to save changes:", error);
            setError("Failed to save changes. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-zinc-300 dark:bg-zinc-900 dark:text-gray-300 p-6 rounded-lg shadow-lg w-6/12 relative">
                <div className="flex flex-row justify-between relative">
                    <p className="text-lg font-semibold">Account Information</p>
                    <AccountInfoButtonGroup editMode={editMode} setEditMode={setEditMode} saveChanges={saveChanges} />
                    <CrossButton className="absolute top-2 right-3" setOpen={setAccountInfoDropDown} />
                </div>
                <p className="text-sm font-light">See all your account details below</p>

                {error && <div className="text-red-500 text-xs mb-2">{error}</div>}

                {loading ? (
                    <div className="dark:bg-zinc-800 bg-zinc-200 rounded-[4px] mt-4 h-[320px] flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <div className="dark:bg-zinc-800 bg-zinc-200 rounded-[4px] p-2 pl-8 mt-4">
                        <div className="mt-6 flex w-full">
                            <Image
                                className="rounded-full mr-4"
                                src={userData?.image || "/default-profile.png"}
                                width={80}
                                height={80}
                                alt="User Profile Image"
                            />
                            {editMode ? (
                                <textarea
                                    name="bio"
                                    value={formData?.bio || ""}
                                    onChange={handleInputChange}
                                    aria-label="bio"
                                    className="w-4/5 dark:bg-zinc-700 bg-gray-100 font-thin text-[12px] px-4 py-2 relative rounded-[2px] outline-none resize-none"
                                    rows={4}
                                />
                            ) : (
                                <div className="w-4/5 dark:bg-zinc-700 bg-gray-100 dark:text-zinc-400 font-light text-[12px] px-4 py-2 relative rounded-[2px]">
                                    {userData?.bio || <span className="text-zinc-400 text-xs font-medium">Add your first bio...</span>}
                                    <FaEdit
                                        onClick={() => setEditMode(true)}
                                        className="absolute bottom-2 right-2 cursor-pointer"
                                        size={16}
                                    />
                                </div>
                            )}


                        </div>

                        <div className="flex flex-col gap-y-2 my-3 pl-2">
                            <div className="my-1">
                                <div className="text-md font-medium">Name</div>
                                {editMode ? (
                                    <input
                                        name="name"
                                        value={formData?.name || ""}
                                        onChange={handleInputChange}
                                        className="font-thin text-sm dark:bg-zinc-800 bg-zinc-200 outline-none w-full"
                                        aria-label="Name"
                                    />
                                ) : (
                                    <div className="font-thin text-sm dark:bg-zinc-800">
                                        {userData?.name || session.user?.name || "No Name Available"}
                                    </div>
                                )}
                            </div>
                            <div className="my-1">
                                <div className="text-md font-medium">Email</div>
                                {editMode ? (
                                    <input
                                        name="email"
                                        value={formData?.email || ""}
                                        onChange={handleInputChange}
                                        className="font-thin text-sm dark:bg-zinc-800 bg-zinc-200 outline-none w-full"
                                        aria-label="Email"
                                    />
                                ) : (
                                    <div className="font-thin text-sm">
                                        {userData?.email || session.user?.email || "No Email Available"}
                                    </div>
                                )}
                            </div>
                            <div className="my-1">
                                <div className="text-md font-medium">Joined At</div>
                                <div className="font-thin text-sm">
                                    {userData?.created_at
                                        ? `Joined at: ${format(new Date(userData.created_at), "MMMM dd, yyyy")}`
                                        : "No Date Available"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <AppLogo className="mt-4" />
            </div>
        </div>
    );
}
