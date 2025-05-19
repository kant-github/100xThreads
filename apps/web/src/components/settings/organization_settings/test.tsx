import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { ChevronDown, Filter, Settings, CheckCircle, Circle, Tag, UserPlus, Shield, Clock } from 'lucide-react';
import { organizationUsersAtom } from '@/recoil/atoms/organizationAtoms/organizationUsersAtom';

// Type definitions
type UserRole = 'ADMIN' | 'MEMBER' | 'MODERATOR';

interface Tag {
    id: string;
    name: string;
    color: string;
    description: string;
}

interface UserTag {
    id: string;
    organization_user_id: number;
    tag_id: string;
    assigned_at: string;
    tag?: Tag;
}

interface User {
    name?: string;
    email?: string;
}

interface OrganizationUser {
    id: number;
    user?: User;
    role: UserRole;
    joined_at?: Date;
    Tags?: UserTag[];
}

interface Role {
    id: string;
    name: string;
}

// Sample tags for demo purposes
const sampleTags: Tag[] = [
    { id: '1', name: 'super_30', color: '#FF5733', description: 'Super 30 members' },
    { id: '2', name: 'college_student', color: '#33A2FF', description: 'College students' },
    { id: '3', name: 'new_member', color: '#33FF57', description: 'New members' }
];

// Sample roles for demo purposes
const sampleRoles: Role[] = [
    { id: 'ADMIN', name: 'Administrator' },
    { id: 'MEMBER', name: 'Member' },
    { id: 'MODERATOR', name: 'Moderator' }
];

export default function Tester() {
    const [organizationUsers, setOrganizationUsers] = useRecoilState<OrganizationUser[]>(organizationUsersAtom);
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<string | null>(null);
    const [tagFilter, setTagFilter] = useState<string | null>(null);

    // React state for dropdown menus instead of DOM manipulation
    const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
    const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
    const [isRoleFilterMenuOpen, setIsRoleFilterMenuOpen] = useState(false);
    const [isDateFilterMenuOpen, setIsDateFilterMenuOpen] = useState(false);
    const [isTagFilterMenuOpen, setIsTagFilterMenuOpen] = useState(false);

    useEffect(() => {
        // This would be replaced with actual backend call
        console.log("Component mounted, would fetch organization users here");
    }, []);

    useEffect(() => {
        if (selectAll) {
            const allUserIds = organizationUsers.map(user => user.id);
            setSelectedUsers(new Set(allUserIds));
        } else if (selectedUsers.size === organizationUsers.length) {
            setSelectedUsers(new Set());
        }
    }, [selectAll, organizationUsers]);

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
    };

    const toggleSelectUser = (userId: number) => {
        const newSelectedUsers = new Set(selectedUsers);
        if (newSelectedUsers.has(userId)) {
            newSelectedUsers.delete(userId);
        } else {
            newSelectedUsers.add(userId);
        }
        setSelectedUsers(newSelectedUsers);

        // Update selectAll state if all users are selected or not
        const filteredUsers = getFilteredUsers();
        setSelectAll(newSelectedUsers.size === filteredUsers.length && filteredUsers.length > 0);
    };

    const assignTagToSelected = async (tagId: string) => {
        if (selectedUsers.size === 0) return;

        try {
            // Here you would make a backend API call
            console.log(`Assigning tag ${tagId} to users:`, Array.from(selectedUsers));

            // Simulate the update locally
            const updatedUsers = organizationUsers.map(user => {
                if (selectedUsers.has(user.id)) {
                    // Check if user already has this tag
                    const hasTag = user.Tags && user.Tags.some(tag => tag.tag_id === tagId);

                    if (!hasTag) {
                        const newTag: UserTag = {
                            id: Math.random().toString(36).substr(2, 9),
                            organization_user_id: user.id,
                            tag_id: tagId,
                            assigned_at: new Date().toISOString(),
                            tag: sampleTags.find(tag => tag.id === tagId)
                        };

                        return {
                            ...user,
                            Tags: user.Tags ? [...user.Tags, newTag] : [newTag]
                        };
                    }
                }
                return user;
            });

            setOrganizationUsers(updatedUsers);
            // Close tag menu after assignment
            setIsTagMenuOpen(false);
        } catch (error) {
            console.error("Error assigning tag:", error);
        }
    };

    const assignRoleToSelected = async (role: string) => {
        if (selectedUsers.size === 0) return;

        try {
            // Here you would make a backend API call
            console.log(`Assigning role ${role} to users:`, Array.from(selectedUsers));

            // Simulate the update locally
            const updatedUsers = organizationUsers.map(user => {
                if (selectedUsers.has(user.id)) {
                    return {
                        ...user,
                        role: role as UserRole
                    };
                }
                return user;
            });

            setOrganizationUsers(updatedUsers);
            // Close role menu after assignment
            setIsRoleMenuOpen(false);
        } catch (error) {
            console.error("Error assigning role:", error);
        }
    };

    const getFilteredUsers = () => {
        return organizationUsers.filter(user => {
            // Role filter
            if (roleFilter && user.role !== roleFilter) {
                return false;
            }

            // Date filter
            if (dateFilter) {
                const joinedDate = user.joined_at ? new Date(user.joined_at) : null;
                const now = new Date();

                if (!joinedDate) return false;

                if (dateFilter === 'last7days') {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(now.getDate() - 7);
                    if (joinedDate < sevenDaysAgo) return false;
                } else if (dateFilter === 'last30days') {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(now.getDate() - 30);
                    if (joinedDate < thirtyDaysAgo) return false;
                } else if (dateFilter === 'last90days') {
                    const ninetyDaysAgo = new Date();
                    ninetyDaysAgo.setDate(now.getDate() - 90);
                    if (joinedDate < ninetyDaysAgo) return false;
                }
            }

            // Tag filter
            if (tagFilter) {
                if (!user.Tags || !user.Tags.some(tag => tag.tag_id === tagFilter)) {
                    return false;
                }
            }

            return true;
        });
    };

    const clearFilters = () => {
        setRoleFilter(null);
        setDateFilter(null);
        setTagFilter(null);
    };

    const formatDate = (dateString?: Date) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const filteredUsers = getFilteredUsers();

    // Click outside handler for dropdowns
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isTagMenuOpen || isRoleMenuOpen || isRoleFilterMenuOpen || isDateFilterMenuOpen || isTagFilterMenuOpen) {
                // Close all dropdowns when clicking outside
                setIsTagMenuOpen(false);
                setIsRoleMenuOpen(false);
                setIsRoleFilterMenuOpen(false);
                setIsDateFilterMenuOpen(false);
                setIsTagFilterMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isTagMenuOpen, isRoleMenuOpen, isRoleFilterMenuOpen, isDateFilterMenuOpen, isTagFilterMenuOpen]);

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center py-5">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold">Organization Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage users, assign tags and roles
                    </p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-2 mb-4 items-center">
                {/* Selection counter */}
                <div className="flex items-center mr-4">
                    <span className="text-sm font-medium text-gray-700">
                        {selectedUsers.size} of {filteredUsers.length} selected
                    </span>
                </div>

                {/* Tag Action */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsTagMenuOpen(!isTagMenuOpen);
                            setIsRoleMenuOpen(false);
                            setIsRoleFilterMenuOpen(false);
                            setIsDateFilterMenuOpen(false);
                            setIsTagFilterMenuOpen(false);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={selectedUsers.size === 0}
                    >
                        <Tag className="h-4 w-4 mr-2" />
                        Assign Tag
                        <ChevronDown className="h-4 w-4 ml-1" />
                    </button>

                    {isTagMenuOpen && (
                        <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                {sampleTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => assignTagToSelected(tag.id)}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        <span
                                            className="inline-block w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: tag.color }}
                                        ></span>
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Role Action */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsRoleMenuOpen(!isRoleMenuOpen);
                            setIsTagMenuOpen(false);
                            setIsRoleFilterMenuOpen(false);
                            setIsDateFilterMenuOpen(false);
                            setIsTagFilterMenuOpen(false);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={selectedUsers.size === 0}
                    >
                        <Shield className="h-4 w-4 mr-2" />
                        Assign Role
                        <ChevronDown className="h-4 w-4 ml-1" />
                    </button>

                    {isRoleMenuOpen && (
                        <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                {sampleRoles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => assignRoleToSelected(role.id)}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        {role.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-grow"></div>

                {/* Filters */}
                <div className="flex space-x-2">
                    {/* Role Filter */}
                    <div className="relative inline-block text-left">
                        <button
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsRoleFilterMenuOpen(!isRoleFilterMenuOpen);
                                setIsTagMenuOpen(false);
                                setIsRoleMenuOpen(false);
                                setIsDateFilterMenuOpen(false);
                                setIsTagFilterMenuOpen(false);
                            }}
                        >
                            <Filter className="h-4 w-4 mr-1" />
                            Role
                        </button>
                        {isRoleFilterMenuOpen && (
                            <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="py-1">
                                    {[
                                        { id: null, name: 'All Roles' },
                                        ...sampleRoles
                                    ].map((role) => (
                                        <button
                                            key={role.id || 'all'}
                                            className={`block w-full text-left px-4 py-2 text-sm ${roleFilter === role.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                                            onClick={() => {
                                                setRoleFilter(role.id);
                                                setIsRoleFilterMenuOpen(false);
                                            }}
                                        >
                                            {role.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Date Filter */}
                    <div className="relative inline-block text-left">
                        <button
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDateFilterMenuOpen(!isDateFilterMenuOpen);
                                setIsTagMenuOpen(false);
                                setIsRoleMenuOpen(false);
                                setIsRoleFilterMenuOpen(false);
                                setIsTagFilterMenuOpen(false);
                            }}
                        >
                            <Clock className="h-4 w-4 mr-1" />
                            Join Date
                        </button>
                        {isDateFilterMenuOpen && (
                            <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="py-1">
                                    {[
                                        { id: null, name: 'All Time' },
                                        { id: 'last7days', name: 'Last 7 Days' },
                                        { id: 'last30days', name: 'Last 30 Days' },
                                        { id: 'last90days', name: 'Last 90 Days' }
                                    ].map((option) => (
                                        <button
                                            key={option.id || 'all'}
                                            className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === option.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                                            onClick={() => {
                                                setDateFilter(option.id);
                                                setIsDateFilterMenuOpen(false);
                                            }}
                                        >
                                            {option.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tag Filter */}
                    <div className="relative inline-block text-left">
                        <button
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsTagFilterMenuOpen(!isTagFilterMenuOpen);
                                setIsTagMenuOpen(false);
                                setIsRoleMenuOpen(false);
                                setIsRoleFilterMenuOpen(false);
                                setIsDateFilterMenuOpen(false);
                            }}
                        >
                            <Tag className="h-4 w-4 mr-1" />
                            Tags
                        </button>
                        {isTagFilterMenuOpen && (
                            <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="py-1">
                                    <button
                                        className={`block w-full text-left px-4 py-2 text-sm ${tagFilter === null ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                                        onClick={() => {
                                            setTagFilter(null);
                                            setIsTagFilterMenuOpen(false);
                                        }}
                                    >
                                        All Tags
                                    </button>
                                    {sampleTags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            className={`flex items-center w-full text-left px-4 py-2 text-sm ${tagFilter === tag.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                                            onClick={() => {
                                                setTagFilter(tag.id);
                                                setIsTagFilterMenuOpen(false);
                                            }}
                                        >
                                            <span
                                                className="inline-block w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: tag.color }}
                                            ></span>
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Clear Filters Button */}
                    {(roleFilter || dateFilter || tagFilter) && (
                        <button
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="mt-4 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                                            <input
                                                type="checkbox"
                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={selectAll && filteredUsers.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            User
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Role
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Joined At
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Tags
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((orgUser) => (
                                            <tr key={orgUser.id} className={selectedUsers.has(orgUser.id) ? 'bg-gray-50' : undefined}>
                                                <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" style={{ visibility: selectedUsers.has(orgUser.id) ? 'visible' : 'hidden' }}></div>
                                                    <input
                                                        type="checkbox"
                                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        checked={selectedUsers.has(orgUser.id)}
                                                        onChange={() => toggleSelectUser(orgUser.id)}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <span className="font-medium text-gray-500">
                                                                    {orgUser.user?.name?.charAt(0) || 'U'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900">{orgUser.user?.name || 'Unknown'}</div>
                                                            <div className="text-gray-500">{orgUser.user?.email || 'No email'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {orgUser.role}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {formatDate(orgUser.joined_at)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex flex-wrap gap-1">
                                                        {orgUser.Tags && orgUser.Tags.length > 0 ? (
                                                            orgUser.Tags.map((userTag) => (
                                                                <span
                                                                    key={userTag.id}
                                                                    className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                                                                    style={{
                                                                        backgroundColor: `${userTag.tag?.color}20` || '#F3F4F6',
                                                                        color: userTag.tag?.color || '#374151',
                                                                        borderColor: `${userTag.tag?.color}40` || '#E5E7EB'
                                                                    }}
                                                                >
                                                                    {userTag.tag?.name || 'Unknown Tag'}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-400">No tags</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4 text-sm text-gray-500">
                                                {organizationUsers.length === 0 ? (
                                                    <div className="flex flex-col items-center py-6">
                                                        <UserPlus className="h-12 w-12 text-gray-400" />
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
                                                        <p className="mt-1 text-sm text-gray-500">Get started by adding users to your organization.</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center py-6">
                                                        <Filter className="h-12 w-12 text-gray-400" />
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users match the current filters</h3>
                                                        <button
                                                            onClick={clearFilters}
                                                            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
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
                    </div>
                </div>
            </div>
        </div>
    );
}