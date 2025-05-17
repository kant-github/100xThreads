import { Button } from "@/components/ui/button";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { OrganizationTagType } from "types/types";
import { motion } from "framer-motion";
import OrganizationTagTicker from "@/components/utility/tickers/OrganizationTagTicker";
import { Dispatch, SetStateAction, useState } from "react";
import OpacityBackground from "@/components/ui/OpacityBackground";
import UtilityCard from "@/components/utility/UtilityCard";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import BigWhiteBtn from "@/components/buttons/BigWhiteBtn";
import { RedBtn } from "@/components/buttons/RedBtn";

interface TagContentProps {
    tags: OrganizationTagType[];
    handleEditTag: (tag: OrganizationTagType) => void;
    handleDeleteTag: (id: string) => void;
    deleteTagModal: boolean;
    setDeleteTagModal: Dispatch<SetStateAction<boolean>>;
}

export default function TagContent({ tags, handleDeleteTag, handleEditTag, deleteTagModal, setDeleteTagModal }: TagContentProps) {

    const [deleteTagId, setDeleteTagId] = useState("");
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-neutral-800 rounded-[10px] border border-neutral-700 mt-4 h-full overflow-y-auto scrollbar-hide"
        >
            {tags.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center">
                    <p className="text-xs text-neutral-200 px-6 py-8">
                        No tags have been created yet. Add your first tag to start organizing users.
                    </p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-neutral-700">
                    <thead className="sticky top-0 bg-neutral-900 z-10">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-200 uppercase tracking-wider"
                            >
                                Tag Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-200 uppercase tracking-wider flex items-center justify-center"
                            >
                                Description
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-neutral-200 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700">
                        {tags.map((tag) => (
                            <tr key={tag.id} className="hover:bg-neutral-750">
                                <td className="px-6 py-2 whitespace-nowrap">
                                    <OrganizationTagTicker tag={tag} />
                                </td>
                                <td className="px-6 py-2 flex items-center justify-center">
                                    <div className="text-xs text-neutral-200">
                                        {tag.description || "No description"}
                                    </div>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap text-right text-sm">
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="link"
                                            onClick={() => handleEditTag(tag)}
                                            className="text-neutral-300 hover:text-neutral-400 transition-colors"
                                        >
                                            <FiEdit2 size={16} />
                                        </Button>
                                        <Button
                                            variant="link"
                                            onClick={() => {
                                                setDeleteTagModal(true)
                                                setDeleteTagId(tag.id)
                                            }}
                                            className="text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            <FiTrash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {
                deleteTagModal && (
                    <OpacityBackground onBackgroundClick={() => setDeleteTagModal(false)}>
                        <UtilityCard className="w-4/12 px-8 py-4 relative dark:bg-neutral-900 dark:border-neutral-600 border-[1px] flex flex-col gap-y-4" open={deleteTagModal} setOpen={setDeleteTagModal}>
                            <DashboardComponentHeading description="This action is irreversible and will remove this tag from all users. Please proceed with caution.">
                                ⚠️ Danger Zone
                            </DashboardComponentHeading>
                            <div className="bg-red-950/40 text-red-400 text-xs px-4 py-3 rounded-[8px] border border-red-600">
                                Deleting this tag will permanently remove it from all users. This action cannot be undone.
                            </div>
                            <div className="w-full grid grid-cols-2 gap-x-4 max-w-sm mx-auto pt-2">
                                <BigWhiteBtn className="bg-neutral-800" onClick={() => setDeleteTagModal(false)}>Cancel</BigWhiteBtn>
                                <RedBtn onClick={() => handleDeleteTag(deleteTagId)}>Delete Tag</RedBtn>
                            </div>
                        </UtilityCard>
                    </OpacityBackground>
                )
            }

        </motion.div>
    );
}