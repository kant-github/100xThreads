"use client";

import { useSession } from "next-auth/react";
import { RedBtn } from "../buttons/RedBtn";
import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { clearCache } from "actions/common";
import { toast } from "sonner";
import BigWhiteBtn from "../buttons/BigWhiteBtn";
import {  ORGANIZATION } from "@/lib/apiAuthRoutes";
import {  OrganizationType } from "types";
import CrossButton from "./CrossButton";
import { useRecoilState } from "recoil";
import { userCreatedOrganizationAtom } from "@/recoil/atoms/organizationsAtom";

interface Props {
    orgs: OrganizationType;
    deleteDialogBox: boolean;
    setDeleteDialogBox: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteDialogBox({
    orgs,
    deleteDialogBox,
    setDeleteDialogBox,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [ownedOrganization, setOwnedOrganization] = useRecoilState(userCreatedOrganizationAtom);
    const { data: session } = useSession();

    async function deleteRoomHandler() {
        if (!session?.user?.token) {
            toast.error("User is not authenticated.");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.delete(`${ORGANIZATION}/${orgs.id}`, {
                headers: {
                    authorization: `Bearer ${session.user.token}`,
                },
            });
            clearCache("dashboard");
            toast.success(data.message);

            setDeleteDialogBox(false);
        } catch (err) {
            console.error("Failed to delete the room:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${!deleteDialogBox ? 'hidden' : ''}`}>
            <div className="bg-white dark:bg-[#262629] dark:text-gray-200 p-6 rounded-lg shadow-lg max-w-lg relative">
                <div className="w-[400px]">

                    <div className="flex justify-between">
                        <p className="text-sm font-bold mb-4">
                            Delete {" " + orgs.name} ??
                        </p>
                        <CrossButton setOpen={setDeleteDialogBox} />
                    </div>
                    <p className="text-xs font-light mb-4">
                        Are you sure you want to delete this room? Remember this action can't be undone, and you will lose all your data including chats...
                    </p>
                    <div className="flex items-center justify-end gap-4 pt-4 pr-2 w-full">
                        <BigWhiteBtn onClick={() => setDeleteDialogBox(false)}>Cancel</BigWhiteBtn>
                        <RedBtn onClick={deleteRoomHandler}>
                            {loading ? "Deleting..." : "Delete"}
                        </RedBtn>
                    </div>
                </div>
            </div>
        </div>
    );
}
