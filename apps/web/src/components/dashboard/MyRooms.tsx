import { RxCross2 } from "react-icons/rx";
import { ChatGroupType } from "types";
import { OptionsMenu } from "../ui/OptionsMenu";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import DeleteDialogBox from "../utility/DeleteDialogBox";
import EditDialogBox from "../utility/EditDialogBox";
import AppLogo from "../heading/AppLogo";
import { useRouter } from "next/navigation";

interface Props {
    myRoomDropdown: boolean;
    setMyRoomDropDown: Dispatch<SetStateAction<boolean>>;
    groups: ChatGroupType[];
}

export default function MyRoomDropdown({ myRoomDropdown, setMyRoomDropDown, groups = [] }: Props) {
    const [deleteDialogBox, setDeleteDialogBox] = useState<boolean>(false);
    const [editDialogBox, setEditDialogBox] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ChatGroupType | null>(null);
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setMyRoomDropDown(false);
            }
        }

        if (myRoomDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }

    }, [myRoomDropdown, setMyRoomDropDown]);

    const router = useRouter();

    return (
        <>
            <div ref={ref}
                className={`fixed top-0 right-0 h-screen w-[350px] bg-[#f2f2f2] border-l-[1px] dark:border-zinc-800 dark:bg-[#1c1c1c] dark:text-gray-200 shadow-xl z-50 rounded-xl transform transition-transform ease-in-out duration-300 ${myRoomDropdown ? "translate-x-0" : "translate-x-full"}`}
            >
                <div>
                    <div className="flex items-center justify-start gap-x-3 ml-4 mt-4 p-4 cursor-pointer">
                        <h1 className="text-2xl font-bold tracking-wide">All rooms</h1>
                    </div>
                    <p className="mx-8 text-xs text-gray-500">
                        Browse through the complete collection of rooms you've created, and take control of their customization and management.
                    </p>
                </div>
                <div
                    className="flex mt-4 flex-col justify-start mx-4 h-[500px] overflow-y-auto" // Use column-reverse to keep adding at the top
                >
                    {groups.length > 0 ? (
                        groups.map((group) => (
                            <div
                                onDoubleClick={() => router.push(`/chat/${group.id}`)}
                                key={group.id} // Use a unique key
                                className="flex items-center justify-between py-[12px] pl-4 ml-2 hover:bg-gray-200 dark:hover:bg-[#262629] rounded-[4px] cursor-pointer select-none hide-scrollbar"
                            >
                                <div className="text-[12px] font-extralight">{group.title}</div>
                                <div className="mr-4">
                                    <OptionsMenu item={group} setSelectedItem={setSelectedItem} setEditDialogBox={setEditDialogBox} setDeleteDialogBox={setDeleteDialogBox} color={"black"} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 text-xs">No rooms available</p>
                    )}
                </div>
                <div className="mt-2  mx-4">
                    <AppLogo />
                    <p className="text-[11px] font-thin mx-3 my-2 mb-4 italic">
                        Banter is the go-to solution for managing group chats and rooms. Customize, organize, and stay connected with ease.
                    </p>
                </div>
            </div>
            {deleteDialogBox && selectedItem && (
                <DeleteDialogBox
                    item={selectedItem}
                    deleteDialogBox={deleteDialogBox}
                    setDeleteDialogBox={setDeleteDialogBox}
                />
            )}
            {editDialogBox && selectedItem && (
                <EditDialogBox
                    item={selectedItem}
                    editDialogBox={editDialogBox}
                    setEditDialogBox={setEditDialogBox}
                />
            )}
        </>
    );
}
