import { Button } from "@/components/ui/button";
import InputBoxCalls from "@/components/utility/InputBoxCalls";
import UtilityCard from "@/components/utility/UtilityCard";
import { IoClose } from "react-icons/io5";
import { NewTagType } from "./TagSettingsUI";

interface TagSettingsUpdateFormProps {
    isEditingTag: string | null;
    cancelTagOperation: () => void;
    handleTagChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    newTag: NewTagType;
    error: string;
    handleUpdateTag: () => void
    handleAddTag: () => void
}

export default function ({ isEditingTag, cancelTagOperation, handleTagChange, newTag, error, handleUpdateTag, handleAddTag }: TagSettingsUpdateFormProps) {
    console.log("new tag came is : ", newTag);
    return (
        <UtilityCard className="bg-neutral-900 px-8 py-4 mb-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">
                    {isEditingTag ? "Edit Tag" : "Add New Tag"}
                </h3>
                <Button className="text-neutral-200" variant="link" onClick={cancelTagOperation}>
                    <IoClose size={20} />
                </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <InputBoxCalls
                    name="name"
                    onChange={handleTagChange}
                    label="Tag Name"
                    placeholder="e.g., Developer, Designer"
                    value={newTag.name}
                />
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                        Color
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            aria-label="colors"
                            id="color"
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
                            className="px-4 py-[11px] text-xs font-medium border-[1px] border-zinc-400 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[8px] w-full pr-10 dark:bg-neutral-900 dark:text-gray-200 placeholder:text-[12px] placeholder:text-neutral-400"
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
                        className="px-4 py-2 text-xs font-medium border-[1px] border-zinc-400 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[8px] w-full pr-10 dark:bg-neutral-900 dark:text-gray-200 placeholder:text-[12px] placeholder:text-neutral-400"
                        placeholder="What is this tag for?"
                        rows={2}
                    />
                </div>
            </div>
            {error && (
                <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}
            <div className="flex justify-end mt-4 gap-3">
                <Button
                    onClick={cancelTagOperation}
                    className="px-4 py-2 bg-neutral-700 hover:bg-neutral-500 rounded-[8px] text-sm transition-colors"
                >
                    Cancel
                </Button>
                <Button
                    variant={"default"}
                    onClick={isEditingTag ? handleUpdateTag : handleAddTag}
                    className="px-4 py-2 rounded-[8px] text-sm text-neutral-900"
                >
                    {isEditingTag ? "Update Tag" : "Add Tag"}
                </Button>
            </div>
        </UtilityCard>
    )
}