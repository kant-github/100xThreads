import { Button } from "@/components/ui/button";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { OrganizationTagType } from "types/types";

interface TagContentProps {
    tags: OrganizationTagType[];
    handleEditTag: (tag: OrganizationTagType) => void;
    handleDeleteTag: (id: string) => void;
}

export default function TagContent({ tags, handleDeleteTag, handleEditTag }: TagContentProps) {
    return (
        <div className="bg-neutral-800 rounded-[10px] border border-neutral-700 mt-4 h-full overflow-y-auto scrollbar-hide">
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
                            className="px-6 py-3 text-left text-xs font-medium text-neutral-200 uppercase tracking-wider"
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
                    {tags.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-neutral-400">
                                No tags have been created yet. Add your first tag to start organizing users.
                            </td>
                        </tr>
                    ) : (
                        tags.map((tag) => (
                            <tr key={tag.id} className="hover:bg-neutral-750">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div
                                            className="w-4 h-4 rounded-full mr-3"
                                            style={{ backgroundColor: tag.color || "#6366F1" }}
                                        ></div>
                                        <div className="text-sm font-medium dark:text-neutral-200"># {tag.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-neutral-300">
                                        {tag.description || "No description"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex justify-end gap-3">
                                        <Button variant="link" onClick={() => handleEditTag(tag)} className="text-neutral-300 hover:text-neutral-400 transition-colors" >
                                            <FiEdit2 size={16} />
                                        </Button>
                                        <Button variant="link" onClick={() => handleDeleteTag(tag.id)} className="text-red-400 hover:text-red-300 transition-colors">
                                            <FiTrash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}