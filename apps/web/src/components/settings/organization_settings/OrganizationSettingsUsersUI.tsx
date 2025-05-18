import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";


export default function OrganizationSettingsUsersUI() {
    const [organizationUsers, setOrganizationUsers] = useRecoilState(organizationUsersAtom);
    const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<string | null>(null);
    const [tagFilter, setTagFilter] = useState<string | null>(null);
    const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
    const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);


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
                if (!orgUser.Tags || !orgUser.Tags.some(tag => tag.id === tagFilter)) return false;
            }
            return true;

        })
    }

    const filteredUsers = getFilteredUsers();

    return (
        <div className="w-full flex flex-col h-full">
            <div className="text-neutral-100 text-xs">{selectedMembers.size} of {filteredUsers.length} selected</div>
        </div>
    );
}
