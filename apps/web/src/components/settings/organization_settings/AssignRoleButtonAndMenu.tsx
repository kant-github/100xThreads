import { Button } from "@/components/ui/button";
import { ChevronDown, Shield, Tag } from "lucide-react";
import { motion } from 'framer-motion'
import { Dispatch, RefObject, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { UserRole, UserRoleArray } from "types/types";
import OrganizationRolesTickerRenderer from "@/components/utility/tickers/organization_roles_tickers/OrganizationRolesTickerRenderer";

interface AssignRoleButtonAndMenuProps {
    setIsRoleMenuOpen: Dispatch<SetStateAction<boolean>>;
    setIsTagMenuOpen: Dispatch<SetStateAction<boolean>>;
    isRoleMenuOpen: boolean;
    selectedMembers: Set<number>;
    roleMenuRef: RefObject<HTMLDivElement>;
    injectNewRolesHandler: (role: UserRole) => Promise<void>;
}

export default function AssignRoleButtonAndMenu({ setIsRoleMenuOpen,
    setIsTagMenuOpen,
    isRoleMenuOpen,
    selectedMembers,
    roleMenuRef,
    injectNewRolesHandler }: AssignRoleButtonAndMenuProps) {
    return (
        <div className="relative">
            <Button
                className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                onClick={() => {
                    setIsRoleMenuOpen(prev => !prev);
                    setIsTagMenuOpen(false);
                }}
                disabled={selectedMembers.size === 0}
                variant={"outline"}
            >
                <Shield className="h-4 w-4 mr-2" />
                Assign Role
                <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            {
                isRoleMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        ref={roleMenuRef} className="absolute z-10 top-full left-0 mt-1 w-48 max-h-[10rem] overflow-y-auto px-4 flex flex-col gap-y-1 pt-2 pb-1 dark:bg-neutral-900 dark:border-neutral-600 border-[1px] rounded-[8px] scrollbar-hide">
                        {UserRoleArray.map((role, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    injectNewRolesHandler(role);
                                }}
                                className={cn(
                                    "text-xs w-full pb-1 cursor-pointer",
                                    "flex items-center justify-start gap-x-2",
                                    index !== UserRoleArray.length - 1 && "border-b border-neutral-700"
                                )}>
                                <OrganizationRolesTickerRenderer tickerText={role} />
                            </div>
                        ))}
                    </motion.div>
                )
            }
        </div>
    )
}