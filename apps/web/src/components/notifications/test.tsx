import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { IoMdAdd } from "react-icons/io";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

// Mock for demonstration - replace with your actual API calls
const mockTags = [
    { id: "1", name: "Developer", color: "#FF5733", description: "Technical team members" },
    { id: "2", name: "Design", color: "#33FF57", description: "UI/UX designers" },
    { id: "3", name: "Management", color: "#3357FF", description: "Team leaders and managers" },
];

export default function OrganizationTagsSettings() {
    const organization = useRecoilValue(organizationAtom);
    const [tags, setTags] = useState([]);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [isEditingTag, setIsEditingTag] = useState(null);
    const [newTag, setNewTag] = useState({
        name: "",
        color: "#6366F1", // Default color
        description: "",
    });
    const [error, setError] = useState("");

    // Mock API fetch - replace with actual API call
    useEffect(() => {
        // In production, fetch from API
        // const fetchTags = async () => {
        //   const response = await fetch(`/api/organizations/${organization.id}/tags`);
        //   const data = await response.json();
        //   setTags(data);
        // };
        // fetchTags();

        // Using mock data for now
        setTags(mockTags);
    }, [organization?.id]);

    const handleTagChange = (e) => {
        const { name, value } = e.target;
        setNewTag((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddTag = async () => {
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
        const mockResponse = {
            ...newTag,
            id: Date.now().toString(),
        };

        setTags((prev) => [...prev, mockResponse]);
        setNewTag({ name: "", color: "#6366F1", description: "" });
        setIsAddingTag(false);
        setError("");
    };

    const handleEditTag = (tag) => {
        setIsEditingTag(tag.id);
        setNewTag(tag);
    };

    const handleUpdateTag = async () => {
        // Validation
        if (!newTag.name.trim()) {
            setError("Tag name is required");
            return;
        }

        // In production, send to API
        // const response = await fetch(`/api/organizations/${organization.id}/tags/${isEditingTag}`, {
        //   method: "PUT",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(newTag),
        // });
        // const data = await response.json();

        setTags((prev) =>
            prev.map((tag) => (tag.id === isEditingTag ? newTag : tag))
        );

        setIsEditingTag(null);
        setNewTag({ name: "", color: "#6366F1", description: "" });
        setError("");
    };

    const handleDeleteTag = async (id) => {
        // In production, send to API
        // await fetch(`/api/organizations/${organization.id}/tags/${id}`, {
        //   method: "DELETE",
        // });

        setTags((prev) => prev.filter((tag) => tag.id !== id));
    };

    const cancelTagOperation = () => {
        setIsAddingTag(false);
        setIsEditingTag(null);
        setNewTag({ name: "", color: "#6366F1", description: "" });
        setError("");
    };

    return (
        <div className="w-full py-6 px-8 text-zinc-100">
            <DashboardComponentHeading description="Control tags over your organization">
                Tags
            </DashboardComponentHeading>

            <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-zinc-300">
                        Tags help you categorize users and control content visibility within your organization.
                    </p>
                    {!isAddingTag && !isEditingTag && (
                        <button
                            onClick={() => setIsAddingTag(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm transition-colors"
                        >
                            <IoMdAdd size={16} />
                            Add Tag
                        </button>
                    )}
                </div>

                {(isAddingTag || isEditingTag) && (
                    <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">
                                {isEditingTag ? "Edit Tag" : "Add New Tag"}
                            </h3>
                            <button
                                onClick={cancelTagOperation}
                                className="text-zinc-400 hover:text-zinc-200"
                            >
                                <IoClose size={20} />
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mb-4">{error}</div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">
                                    Tag Name*
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newTag.name}
                                    onChange={handleTagChange}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Developer, Designer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">
                                    Color
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        name="color"
                                        value={newTag.color}
                                        onChange={handleTagChange}
                                        className="h-9 w-9 bg-transparent border-0 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        name="color"
                                        value={newTag.color}
                                        onChange={handleTagChange}
                                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="#FFFFFF"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-zinc-400 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={newTag.description}
                                    onChange={handleTagChange}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="What is this tag for?"
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4 gap-3">
                            <button
                                onClick={cancelTagOperation}
                                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={isEditingTag ? handleUpdateTag : handleAddTag}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm transition-colors"
                            >
                                {isEditingTag ? "Update Tag" : "Add Tag"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Tag List */}
                <div className="overflow-hidden bg-zinc-800 rounded-lg border border-zinc-700">
                    <table className="min-w-full divide-y divide-zinc-700">
                        <thead className="bg-zinc-900">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                                >
                                    Tag Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                                >
                                    Description
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-700">
                            {tags.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-400">
                                        No tags have been created yet. Add your first tag to start organizing users.
                                    </td>
                                </tr>
                            ) : (
                                tags.map((tag) => (
                                    <tr key={tag.id} className="hover:bg-zinc-750">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div
                                                    className="w-4 h-4 rounded-full mr-3"
                                                    style={{ backgroundColor: tag.color }}
                                                ></div>
                                                <div className="text-sm font-medium">{tag.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-zinc-300">
                                                {tag.description || "No description"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleEditTag(tag)}
                                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTag(tag.id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}