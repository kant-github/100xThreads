import OrganizationTagTicker from "@/components/utility/tickers/OrganizationTagTicker";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils";
import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom";
import { organizationTagsAtom } from "@/recoil/atoms/tags/organizationTagsAtom";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { OrganizationTagType, UserRole, UserRoleArray } from "types/types";
import OrganizationRolesTickerRenderer from "@/components/utility/tickers/organization_roles_tickers/OrganizationRolesTickerRenderer";
import { ChevronDown, Clock, Filter, Shield, Tag, UserPlus } from "lucide-react";
import { RxCross1 } from "react-icons/rx";
import { Input } from "@/components/ui/input";
import OptionImage from "@/components/ui/OptionImage";
import Image from "next/image";
import Checkbox from "@/components/utility/CheckBox";
import axios from "axios";
import { ORGANIZATION_SETTINGS } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { toast } from "sonner";
import Spinner from "@/components/loaders/Spinner";


export default function OrganizationSettingsUsersUI() {
    const session = useRecoilValue(userSessionAtom);
    const [organizationUsers, setOrganizationUsers] = useRecoilState(organizationUsersAtom);
    console.log("organization user tags", organizationUsers[0]?.tags);
    const organizationTags = useRecoilValue(organizationTagsAtom);
    const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [assignedTags, setAssignedTags] = useState<Set<string>>(new Set());
    const [previousTagMenuState, setPreviousTagMenuState] = useState<boolean>(false);


    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<string | null>(null);
    const [tagFilter, setTagFilter] = useState<string | null>(null);

    const [isTagMenuOpen, setIsTagMenuOpen] = useState<boolean>(false);
    const [isRoleMenuOpen, setIsRoleMenuOpen] = useState<boolean>(false);
    const [isRoleFilterMenuOpen, setIsRoleFilterMenuOpen] = useState<boolean>(false);
    const [isDateFilterMenuOpen, setIsDateFilterMenuOpen] = useState<boolean>(false);
    const [isTagFilterMenuOpen, setIsTagFilterMenuOpen] = useState<boolean>(false);

    const tagMenuRef = useRef<HTMLDivElement>(null);
    const roleMenuRef = useRef<HTMLDivElement>(null);
    const roleFilterMenuRef = useRef<HTMLDivElement>(null);
    const dateFilterMenuRef = useRef<HTMLDivElement>(null);
    const tagFilterMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (tagMenuRef.current && !tagMenuRef.current.contains(e.target as Node)) {
                setIsTagMenuOpen(false);
            }
            if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
                setIsRoleMenuOpen(false);
            }
            if (roleFilterMenuRef.current && !roleFilterMenuRef.current.contains(e.target as Node)) {
                setIsRoleFilterMenuOpen(false);
            }
            if (dateFilterMenuRef.current && !dateFilterMenuRef.current.contains(e.target as Node)) {
                setIsDateFilterMenuOpen(false);
            }
            if (tagFilterMenuRef.current && !tagFilterMenuRef.current.contains(e.target as Node)) {
                setIsTagFilterMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isTagMenuOpen, isRoleMenuOpen, roleFilterMenuRef, dateFilterMenuRef, tagFilterMenuRef])


    useEffect(() => {
        if (previousTagMenuState && !isTagMenuOpen && assignedTags.size > 0 && selectedMembers.size > 0) {
            injectNewTagsHandler();
        }
        setPreviousTagMenuState(isTagMenuOpen);
    }, [isTagMenuOpen, assignedTags, selectedMembers]);

    useEffect(() => {
        if (selectAll) {
            const allUserIds = organizationUsers.map(orgUser => orgUser.id);
            setSelectedMembers(new Set(allUserIds));
        } else if (selectedMembers.size === organizationUsers.length) {
            setSelectedMembers(new Set());
        }
    }, [selectAll, organizationUsers])


    function getFilteredUsers() {
        return organizationUsers.filter(orgUser => {

            if (roleFilter && orgUser.role !== roleFilter) {
                return false;
            }

            if (dateFilter) {
                const joinedDate = orgUser.joined_at;
                const now = new Date();

                if (!joinedDate) return false;

                if (dateFilter === 'last7days') {
                    const sevenDayAgo = new Date(now.setDate(now.getDate() - 7));
                    if (joinedDate < sevenDayAgo) return false;
                } else if (dateFilter === 'last30days') {
                    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
                    if (joinedDate < thirtyDaysAgo) return false;
                } else if (dateFilter === 'last90days') {
                    const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
                    if (joinedDate < ninetyDaysAgo) return false;
                }
            }

            if (tagFilter) {
                if (!orgUser.tags || !orgUser.tags.some(tag => tag.id === tagFilter)) return false;
            }
            return true;

        })
    }

    const filteredUsers = getFilteredUsers();

    function formatDate(dateString?: Date) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    function clearFilters() {
        setRoleFilter(null);
        setDateFilter(null);
        setTagFilter(null);
    };

    function toggleSelectAll() {
        setSelectAll(!selectAll);
    };

    function toggleSelectUser(userId: number) {
        const newSelectedUsers = new Set(selectedMembers);
        if (newSelectedUsers.has(userId)) {
            newSelectedUsers.delete(userId);
        } else {
            newSelectedUsers.add(userId);
        }
        setSelectedMembers(newSelectedUsers);

        // Update selectAll state if all users are selected or not
        const filteredUsers = getFilteredUsers();
        setSelectAll(newSelectedUsers.size === filteredUsers.length && filteredUsers.length > 0);
    };

    async function injectNewTagsHandler() {

        try {
            const { data } = await axios.post(`${ORGANIZATION_SETTINGS}/users/assign-tags`, {
                selectedUsers: Array.from(selectedMembers),
                assignedTags: Array.from(assignedTags)
            }, {
                headers: {
                    Authorization: `Bearer ${session.user?.token}`
                }
            })

            if (data.flag === 'SUCCESS') {
                toast.success("successfully assigned tags");
            }
        } catch (err) {
            console.error("Error in assigning tags");
        } finally {
            setAssignedTags(new Set());
        }
    }



    function assignTagHandler(tag: OrganizationTagType) {
        const newAssigneeTags = new Set(assignedTags);
        if (newAssigneeTags.has(tag.id)) {
            newAssigneeTags.delete(tag.id)
        } else {
            newAssigneeTags.add(tag.id)
        }
        setAssignedTags(newAssigneeTags);
    }

    async function injectNewRolesHandler(role: UserRole) {
        setLoading(true);
        try {
            const { data } = await axios.post(`${ORGANIZATION_SETTINGS}/users/assign-roles`, {
                selectedUsers: Array.from(selectedMembers),
                role
            }, {
                headers: {
                    Authorization: `Bearer ${session.user?.token}`
                }
            })

            if (data.flag === 'SUCCESS') {
                toast.success("successfully assigned tags");
            }

            setOrganizationUsers(prev => prev.map((orgUser) => {
                if (selectedMembers.has(orgUser.id)) {
                    return {
                        ...orgUser,
                        role: role
                    };
                }
                return orgUser;
            }));

        } catch (err) {
            console.error("Error in assigning tags");
        }
        finally {
            setIsRoleMenuOpen(false);
            setLoading(false);
        }
    }

    return (
        <div className="w-full flex flex-col gap-y-2 h-full">

            <div className="flex flex-row w-full items-center justify-between">
                <div className="flex gap-2">
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
                </div>

                {/* FILTERS */}
                <div className="flex items-center justify-center gap-x-3">

                    {/* ROLE FILTER */}
                    <div className="relative">
                        <Button
                            className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                            onClick={() => {
                                setIsRoleFilterMenuOpen(prev => !prev);
                            }}
                            variant={"outline"}
                        >
                            All Role
                        </Button>
                        {
                            isRoleFilterMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    ref={roleFilterMenuRef} className="absolute z-10 top-full right-0 mt-1 w-48 max-h-[10rem] overflow-y-auto px-4 flex flex-col gap-y-1 pt-2 pb-1 dark:bg-neutral-900 dark:border-neutral-600 border-[1px] rounded-[8px] scrollbar-hide">
                                    {UserRoleArray.map((role, index) => (
                                        <div
                                            onClick={() => {
                                                setIsRoleFilterMenuOpen(false)
                                                setRoleFilter(role)
                                            }}
                                            key={index}
                                            className={cn(
                                                "text-xs w-full pb-1.5 cursor-pointer hover:bg-neutral-800",
                                                index !== UserRoleArray.length - 1 && "border-b border-neutral-700"
                                            )}>
                                            <OrganizationRolesTickerRenderer tickerText={role} />
                                        </div>
                                    ))}
                                </motion.div>
                            )
                        }
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <Button
                            className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                            onClick={() => {
                                setIsDateFilterMenuOpen(prev => !prev);
                            }}
                            variant={"outline"}
                        >
                            <Clock className="h-4 w-4 mr-1" />
                            Join Date
                        </Button>
                        {
                            isDateFilterMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    ref={dateFilterMenuRef} className="absolute z-10 top-full right-0 mt-1 w-48 max-h-[9rem] overflow-y-auto px-4 flex flex-col gap-y-1 pt-2 pb-1 dark:bg-neutral-900 dark:border-neutral-600 border-[1px] rounded-[8px] scrollbar-hide">
                                    {[
                                        { id: null, name: 'All Time' },
                                        { id: 'last7days', name: 'Last 7 Days' },
                                        { id: 'last30days', name: 'Last 30 Days' },
                                        { id: 'last90days', name: 'Last 90 Days' }
                                    ].map((date, index) => (
                                        <div
                                            onClick={() => {
                                                setIsDateFilterMenuOpen(false);
                                                setDateFilter(date.id)
                                            }
                                            }
                                            key={index}
                                            className={cn(
                                                "text-xs dark:text-neutral-100 w-full pb-1 cursor-pointer ",
                                                index !== 4 - 1 && "border-b border-neutral-700"
                                            )}>
                                            <div className="hover:bg-secDark w-full py-1 px-2 rounded-[6px]">
                                                {date.name}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )
                        }
                    </div>

                    {/* TAG FILTER */}
                    <div className="relative">
                        <Button
                            className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                            onClick={() => {
                                setIsTagFilterMenuOpen(prev => !prev);
                            }}
                            variant={"outline"}
                        >
                            <Tag className="h-4 w-4 mr-1" />
                            Tags
                        </Button>
                        {
                            isTagFilterMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    ref={tagFilterMenuRef} className="absolute z-10 top-full right-0 mt-1 w-48 max-h-[10rem] overflow-y-auto px-4 flex flex-col gap-y-1 pt-2 pb-1 dark:bg-neutral-900 dark:border-neutral-600 border-[1px] rounded-[8px] scrollbar-hide"
                                >
                                    {organizationTags.map((tag, index) => (
                                        <div key={tag.id} onClick={() => {
                                            setIsTagFilterMenuOpen(false)
                                            setTagFilter(tag.id)
                                        }
                                        } className={cn(
                                            "text-xs w-full pb-1 cursor-pointer",
                                            index !== organizationTags.length - 1 && "border-b border-neutral-700"
                                        )}>
                                            <OrganizationTagTicker tag={tag} />
                                        </div>
                                    ))}
                                </motion.div>
                            )
                        }
                    </div>
                    {(roleFilter || dateFilter || tagFilter) && (
                        <Button
                            className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                            onClick={clearFilters}
                            variant={"outline"}
                        >
                            <RxCross1 className="h-4 w-4 mr-1" />
                            clear filters
                        </Button>
                    )}

                </div>

            </div>
            <div className="flex items-center justify-between">
                <div className="text-neutral-100 text-xs ml-1">{selectedMembers.size} of {filteredUsers.length} selected</div>
                <Input className={cn(
                    `text-xs font-light text-neutral-100 placeholder:text-xs placeholder:text-neutral-100`,
                    `outline-none border-neutral-700 rounded-[8px] placeholder:px-2`,
                    `w-fit`
                )} placeholder="search users" />
            </div>

            <div className="mt-4 flex flex-col bg-secDark rounded-[10px] border-[1px] dark:border-neutral-700 overflow-hidden">

                <table className="min-w-full divide-y divide-neutral-700">
                    <thead>
                        <tr className="dark:bg-neutral-900">
                            <th scope="col" className="relative py-4 px-4 sm:w-16 sm:px-8">
                                <span className="sr-only">Select</span>
                                <Checkbox
                                    aria-label="checkbox"
                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={selectAll && filteredUsers.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th scope="col" className="px-4 py-4 text-left text-[12px] dark:text-neutral-100 text-neutral-900 font-normal">User</th>
                            <th scope="col" className="px-4 py-4 text-left text-[12px] dark:text-neutral-100 text-neutral-900 font-normal">Role</th>
                            <th scope="col" className="px-4 py-4 text-left text-[12px] dark:text-neutral-100 text-neutral-900 font-normal">Joined at</th>
                            <th scope="col" className="px-4 py-4 text-left text-[12px] dark:text-neutral-100 text-neutral-900 font-normal">Tags</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((orgUser) => (
                                <tr key={orgUser.id} className={`${selectedMembers.has(orgUser.id) ? 'bg-primary/10' : undefined}`}>
                                    <td className="relative px-4 sm:w-16 sm:px-8">
                                        <div className="absolute inset-y-0 left-0 w-0.5" style={{ visibility: selectedMembers.has(orgUser.id) ? 'visible' : 'hidden' }}></div>
                                        <Checkbox
                                            aria-label="checkbox"
                                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-neutral-900 bg-neutral-900 "
                                            checked={selectedMembers.has(orgUser.id)}
                                            onChange={() => toggleSelectUser(orgUser.id)}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2.5 text-sm">
                                        <div className="flex items-center justify-start gap-x-2">
                                            <div className="h-4 w-10 flex-shrink-0 flex items-center justify-start">
                                                <OptionImage
                                                    userId={orgUser.user_id}
                                                    organizationId={orgUser.organization_id}
                                                    content={
                                                        <Image
                                                            src={orgUser.user.image}
                                                            width={28}
                                                            height={28}
                                                            alt="user-image"
                                                            className="rounded-full"
                                                        />
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-neutral-400">{orgUser.user?.name || 'Unknown'}</div>
                                                <div className="text-neutral-200 text-xs font-normal">{orgUser.user?.email || 'No email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 text-sm text-neutral-500">
                                        {
                                            loading && selectedMembers.has(orgUser.id) ? (
                                                <Spinner />
                                            ) : (
                                                <OrganizationRolesTickerRenderer tickerText={orgUser.role} />
                                            )
                                        }
                                    </td>
                                    <td className="whitespace-nowrap px-3 text-xs text-neutral-300">
                                        {formatDate(orgUser.joined_at)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 text-sm text-neutral-500">
                                        <div className="flex flex-wrap gap-1">
                                            {orgUser.tags && orgUser.tags.length > 0 ? (
                                                <>
                                                    {orgUser.tags.slice(0, 2).map((userTag, index) => (
                                                        <span key={userTag.tag?.id || index}>
                                                            <OrganizationTagTicker tag={userTag.tag!} />
                                                        </span>
                                                    ))}

                                                    {orgUser.tags.length > 2 && (
                                                        <span className="text-[11px] text-primary font-light">
                                                            +{orgUser.tags.length - 2} more
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-neutral-500 text-[11px] italic">No tags</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center text-sm text-neutral-500">
                                    {organizationUsers.length === 0 ? (
                                        <div className="flex flex-col items-center py-6">
                                            <UserPlus className="h-12 w-12 text-neutral-400" />
                                            <h3 className="mt-2 text-sm font-medium text-neutral-900">No users</h3>
                                            <p className="mt-1 text-sm text-neutral-500">Get started by adding users to your organization.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-6">
                                            <Filter className="h-12 w-12 text-neutral-400" />
                                            <h3 className="mt-2 text-neutral-900 dark:text-neutral-300 text-xs font-normal">No users match the current filters</h3>
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="mt-2 text-xs font-light text-yellow-500 hover:text-yellow-500/70 transition-colors ease-in"
                                            >
                                                Clear filters
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}