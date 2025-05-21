import { Button } from "@/components/ui/button";
import Checkbox from "@/components/utility/CheckBox";
import OrganizationTagTicker from "@/components/utility/tickers/OrganizationTagTicker";
import { ChevronDown, Tag } from "lucide-react";
import { motion } from 'framer-motion'
import { Dispatch, RefObject, SetStateAction } from "react";
import { OrganizationTagType } from "types/types";
import { cn } from "@/lib/utils";

interface AssignTagButtonAndMenuProps {
    setIsTagMenuOpen: Dispatch<SetStateAction<boolean>>;
    selectedMembers: Set<number>;
    isTagMenuOpen: boolean;
    tagMenuRef: RefObject<HTMLDivElement>;
    organizationTags: OrganizationTagType[];
    assignedTags: Set<string>;
    assignTagHandler: (tag: OrganizationTagType) => void;
}

export default function AssignTagButtonAndMenu({ setIsTagMenuOpen, selectedMembers, isTagMenuOpen, tagMenuRef, organizationTags, assignTagHandler, assignedTags }: AssignTagButtonAndMenuProps) {
    return (
        <div className="relative">
            <Button
                className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                onClick={() => {
                    setIsTagMenuOpen(prev => !prev);
                }}
                disabled={selectedMembers.size === 0}
                variant={"outline"}
            >
                <Tag className="h-4 w-4 mr-2" />
                Assign Tag
                <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            {
                isTagMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        ref={tagMenuRef}
                        className="absolute z-10 top-full left-0 mt-1 w-48 max-h-[14rem] overflow-y-auto px-4 flex flex-col gap-y-2 pt-2 pb-2 dark:bg-neutral-900 dark:border-neutral-600 border-[1px] rounded-[8px] scrollbar-hide"
                    >
                        {organizationTags.map((tag, index) => (
                            <div
                                key={tag.id}
                                className={cn(
                                    "text-xs w-full pb-1 cursor-pointer",
                                    "flex items-center justify-start gap-x-2",
                                    index !== organizationTags.length - 1 && "border-b border-neutral-700"
                                )}
                            >
                                <Checkbox
                                    checked={assignedTags.has(tag.id)}
                                    onChange={() => assignTagHandler(tag)}
                                />
                                <OrganizationTagTicker tag={tag} />
                            </div>
                        ))}
                    </motion.div>
                )
            }

        </div>
    )
}