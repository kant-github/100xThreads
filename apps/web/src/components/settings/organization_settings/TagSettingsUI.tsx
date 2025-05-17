import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import TagContent from "./TagContent";
import { OrganizationTagType } from "types/types";
import TagSettingsUpdateForm from "./TagSettingsUpdateForm";

export type NewTagType = {
    name: string;
    color: string;
    description: string;
};

const mockTags: OrganizationTagType[] = [
    {
        id: "1",
        name: "Developer",
        color: "#FF5733",
        description: "Technical team members",
        organization_id: "org-1",
        created_at: new Date().toISOString(),
        UserTags: []
    },
    {
        id: "2",
        name: "Design",
        color: "#33FF57",
        description: "UI/UX designers",
        organization_id: "org-1",
        created_at: new Date().toISOString(),
        UserTags: []
    },
    {
        id: "3",
        name: "Management",
        color: "#3357FF",
        description: "Team leaders and managers",
        organization_id: "org-1",
        created_at: new Date().toISOString(),
        UserTags: []
    },
    {
        id: "1",
        name: "Developer",
        color: "#FF5733",
        description: "Technical team members",
        organization_id: "org-1",
        created_at: new Date().toISOString(),
        UserTags: []
    },
    {
        id: "2",
        name: "Design",
        color: "#33FF57",
        description: "UI/UX designers",
        organization_id: "org-1",
        created_at: new Date().toISOString(),
        UserTags: []
    },
    {
        id: "3",
        name: "Management",
        color: "#3357FF",
        description: "Team leaders and managers",
        organization_id: "org-1",
        created_at: new Date().toISOString(),
        UserTags: []
    },
    {
        id: "1",
        name: "Developer",
        color: "#FF5733",
        description: "Technical team members",
        organization_id: "org-1",
        created_at: new Date().toISOString(),
        UserTags: []
    },
    {
        id: "2",
        name: "Design",
        color: "#33FF57",
        description: "UI/UX designers",
        organization_id: "org-1",
        created_at: new Date().toISOString(),
        UserTags: []
    },
    {
        id: "3",
        name: "Management",
        color: "#3357FF",
        description: "Team leaders and managers",
        organization_id: "org-1",
        created_at: new Date().toISOString(),
        UserTags: []
    },
];

export default function TagSettingsUI() {
    const [isAddingTag, setIsAddingTag] = useState<boolean>(false);
    const [isEditingTag, setIsEditingTag] = useState<string | null>(null);
    const [tags, setTags] = useState<OrganizationTagType[]>(mockTags);
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
        setIsEditingTag(tag.id);
        setNewTag({
            name: tag.name,
            color: tag.color || "#6366F1",
            description: tag.description || "",
        });
    }

    function handleDeleteTag(id: string) {
        // In production, send to API
        // await fetch(`/api/organizations/${organization.id}/tags/${id}`, {
        //   method: "DELETE",
        // });

        setTags((prev) => prev.filter((tag) => tag.id !== id));
    }

    async function handleAddTag() {
        // Validation
        if (!newTag.name.trim()) {
            setError("Tag name is required");
            return;
        }

        // In production, send to API
        // const response = await fetch(`/api/organizations/${organization.id}/tags`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(newTag),
        // });
        // const data = await response.json();

        // Mock API response
        const mockResponse: OrganizationTagType = {
            ...newTag,
            id: Date.now().toString(),
            organization_id: "org-1", // In production, this would come from context or props
            created_at: new Date().toISOString(),
            UserTags: [],
        };

        setTags((prev) => [...prev, mockResponse]);
        setNewTag({ name: "", color: "#6366F1", description: "" });
        setIsAddingTag(false);
        setError("");
    }

    async function handleUpdateTag() {
        // Validation
        if (!newTag.name.trim()) {
            setError("Tag name is required");
            return;
        }

        if (!isEditingTag) return;

        // In production, send to API
        // const response = await fetch(`/api/organizations/${organization.id}/tags/${isEditingTag}`, {
        //   method: "PUT",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(newTag),
        // });
        // const data = await response.json();

        setTags((prev) =>
            prev.map((tag) => {
                if (tag.id === isEditingTag) {
                    return {
                        ...tag,
                        name: newTag.name,
                        color: newTag.color,
                        description: newTag.description,
                    };
                }
                return tag;
            })
        );

        setIsEditingTag(null);
        setNewTag({ name: "", color: "#6366F1", description: "" });
        setError("");
    };

    return (
        <div className="w-full flex flex-col h-full">
            <div className="px-8 pt-6 pb-2 relative flex-shrink-0">
                <DashboardComponentHeading description="Tags help you categorize users and control content visibility within your organization.">Tags</DashboardComponentHeading>
                <div className="absolute top-6 right-6 mb-4">
                    {!isAddingTag && !isEditingTag && (
                        <Button variant={"default"} onClick={() => setIsAddingTag(true)} className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm transition-colors text-neutral-900">
                            <IoMdAdd size={16} />
                            Add Tag
                        </Button>
                    )}
                </div>
            </div>

            <div className="px-8 pb-6 flex-grow overflow-hidden">
                {
                    (!!isEditingTag || isAddingTag) && (
                        <TagSettingsUpdateForm newTag={newTag} handleAddTag={handleAddTag} handleTagChange={handleTagChange} handleUpdateTag={handleUpdateTag} cancelTagOperation={cancelTagOperation} error={error} isEditingTag={isEditingTag} />
                    )
                }
                <TagContent
                    tags={tags}
                    handleDeleteTag={handleDeleteTag}
                    handleEditTag={handleEditTag}
                />
            </div>
        </div>
    );
}



