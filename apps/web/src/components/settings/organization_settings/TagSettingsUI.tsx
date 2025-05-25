import { Button } from "@/components/ui/button";
import { useState } from "react";
import TagContent from "./TagContent";
import { OrganizationTagType } from "types/types";
import TagSettingsUpdateForm from "./TagSettingsUpdateForm";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { useRecoilState, useRecoilValue } from "recoil";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationTagsAtom } from "@/recoil/atoms/tags/organizationTagsAtom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export type NewTagType = {
    name: string;
    color: string;
    description: string;
};

export default function TagSettingsUI() {
    const organizationId = useRecoilValue(organizationIdAtom);
    const session = useRecoilValue(userSessionAtom);
    const [isAddingTag, setIsAddingTag] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEditingTag, setIsEditingTag] = useState<string | null>(null);
    const [tags, setTags] = useRecoilState(organizationTagsAtom);
    const [deleteTagModal, setDeleteTagModal] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [newTag, setNewTag] = useState<NewTagType>({
        name: "",
        color: "#6366F1",
        description: "",
    });

    function cancelTagOperation() {
        setIsAddingTag(false);
        setIsEditingTag(null);
        setNewTag({ name: "", color: "#6366F1", description: "" });
        setError("");
    }

    function handleTagChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setNewTag((prev) => ({ ...prev, [name]: value }));
    }

    function handleEditTag(tag: OrganizationTagType) {
        console.log("editing tag is : ", tag);
        setIsEditingTag(tag.id);
        setNewTag({
            name: tag.name,
            color: tag.color || "#6366F1",
            description: tag.description || "",
        });
    }

    async function handleDeleteTag(id: string) {
        setLoading(true);
        try {
            await axios.delete(`${API_URL}/organization/tags/${organizationId}/${id}`,
                {
                    headers: {
                        authorization: `Bearer ${session.user?.token}`
                    }
                }
            )
            await new Promise(t => setTimeout(t, 5000));
            setDeleteTagModal(false);
        } catch (err) {
            console.error("Error in deleting tags");
        } finally {
            setLoading(false);
        }

        setTags((prev) => prev.filter((tag) => tag.id !== id));
    }

    async function handleAddTag() {
        if (!session.user?.token) return;
        if (!newTag.name.trim()) {
            setError("Tag name is required");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/organization/tags/${organizationId}`,
                { ...newTag },
                {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                }
            );

            setTags(prev => [data.data, ...prev]);
            setNewTag({ name: "", color: "#6366F1", description: "" });
            setIsAddingTag(false);
            setError("");
        } catch (err) {
            console.error('Error in adding new tag ', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateTag() {
        if (!session.user?.token || !organizationId || !isEditingTag) return;

        if (!newTag.name.trim()) {
            setError("Tag name is required");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.put(`${API_URL}/organization/tags/${organizationId}/${isEditingTag}`,
                { ...newTag },
                {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                }
            );

            setTags((prev) =>
                prev.map((tag) => {
                    if (tag.id === isEditingTag) {
                        return data.data;
                    }
                    return tag;
                })
            );

            setIsEditingTag(null);
            setNewTag({ name: "", color: "#6366F1", description: "" });
            setError("");
        } catch (error) {
            console.error("Error updating tag:", error);
            setError("Failed to update tag. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full flex flex-col gap-y-2 h-full">
            <div className='flex justify-end w-full'>
                <div className='flex items-center justify-center gap-x-4'>
                    <Button
                        className="flex items-center justify-center gap-x-2 border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                        onClick={() => setIsAddingTag(true)}
                        variant={"outline"}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Tag
                    </Button>
                    <div className="relative w-full max-w-xs">
                        <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            className={cn(
                                `pl-8 pr-2 py-1 text-xs font-light text-neutral-100 placeholder:text-neutral-100 placeholder:text-xs`,
                                `outline-none border border-neutral-700 rounded-[8px]`,
                                `w-full`
                            )}
                            placeholder="Search location"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-hidden">
                {
                    (!!isEditingTag || isAddingTag) && (
                        <TagSettingsUpdateForm loading={loading} newTag={newTag} handleAddTag={handleAddTag} handleTagChange={handleTagChange} handleUpdateTag={handleUpdateTag} cancelTagOperation={cancelTagOperation} error={error} isEditingTag={isEditingTag} />
                    )
                }
                <TagContent
                    loading={loading}
                    tags={tags}
                    handleDeleteTag={handleDeleteTag}
                    handleEditTag={handleEditTag}
                    setDeleteTagModal={setDeleteTagModal}
                    deleteTagModal={deleteTagModal}
                />
            </div>
        </div>
    );
}



