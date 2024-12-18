import { Dispatch, SetStateAction, useState } from "react";
import InputBox from "../utility/InputBox";
import BigBlackButton from "../buttons/BigBlackButton";
import PhotoUploadIcon from "../ui/PhotoUploadIcon";
import CrossButton from "../utility/CrossButton";
import Spinner from "../loaders/Spinner";
import RemoveIconCrossButton from "../ui/RemoveIconCrossButton";
import SelectBox from "../utility/SelectBox";
import CheckBox from "../utility/CheckBox";
import { IoCheckmarkCircle } from "react-icons/io5";




interface CreateRoomProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    name: string | null;
    setName: Dispatch<SetStateAction<string | null>>;
    organizationName: string;
    setOrganizationName: Dispatch<SetStateAction<string>>;
    roomPasscode: string;
    setRoomPasscode: Dispatch<SetStateAction<string>>;
    createChatHandler: () => Promise<void>;
    groupPhoto: File | null;
    setGroupPhoto: Dispatch<SetStateAction<File | null>>;
    setIcon: Dispatch<SetStateAction<string | null>>;
    icon: string | null;
}

export default function CreateRoom({
    open,
    setOpen,
    name,
    setName,
    organizationName,
    setOrganizationName,
    createChatHandler,
    groupPhoto,
    setGroupPhoto,
    setIcon,
    icon
}: CreateRoomProps) {
    const [submitting, setSubmitting] = useState(false);
    const dynamicFirstName = name?.split(" ")[0];
    const dynamicLastName = name?.split(" ")[1];
    const [firstName, setFirstName] = useState<string>(dynamicFirstName!);
    const [lastName, setLastName] = useState<string>(dynamicLastName!);
    const [organizationType, setOrganizationType] = useState<string | null>(null);
    const [selectedGroups, setSelectedGroups] = useState({
        generalChat: true,
        adminPage: true,
        projectsChannel: true,
        events: true,
        announcements: true,
    });

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setSelectedGroups((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };


    async function handleSubmit() {
        setSubmitting(true);
        await createChatHandler();
        setSubmitting(false);
    }


    return (
        <>
            {open && (
                <div className="fixed w-screen h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <form
                        className="bg-white dark:bg-[#262629] dark:text-gray-200 p-6 rounded-[6px] shadow-lg w-5/12 relative flex flex-col gap-y-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}>
                        <div className="flex flex-row justify-between">
                            <p className="text-sm font-bold text-gray-300">
                                Create Organization
                            </p>
                            <CrossButton setOpen={setOpen} /></div>
                        <div className="mt-4 flex flex-row items-center gap-x-3 w-full">
                            <PhotoUploadIcon setIcon={setIcon} setGroupPhoto={setGroupPhoto} />
                            <InputBox input={firstName} setInput={setFirstName} label="Owner's first name" />
                            <InputBox input={lastName} setInput={setLastName} label="Owner's last name" />
                        </div>
                        <div className="text-gray-600 text-sm ml-0.5 flex items-center justify-start gap-x-1">
                            {
                                groupPhoto ?
                                    (<span className="text-[10px] text-yellow-500 font-medium max-w-4 overflow-hidden">{groupPhoto.name.slice(0, 6)}...</span>) :
                                    (<span className="text-[10px] text-yellow-500">{icon}</span>)
                            }
                            <RemoveIconCrossButton icon={icon} setIcon={setIcon} />
                        </div>
                        <div className="relative">
                            <IoCheckmarkCircle className="absolute text-sm right-1 -top-1 text-green-500" />

                            <InputBox input={organizationName} setInput={setOrganizationName} label="Organization's name" />
                        </div>
                        <SelectBox selectedType={organizationType!} onTypeChange={setOrganizationType} />
                        <div className="flex flex-col gap-y-2 mt-2">
                            <p className="text-zinc-300 text-[11px] font-thin italic">
                                Choose the default chat groups that best suit your organization's communication needs.
                                You can always add more later, but these will get the conversation started!
                            </p>
                            <CheckBox onChange={handleCheckBoxChange} label="General chat / Water cooler" name="generalChat" checked={selectedGroups.generalChat} />
                            <CheckBox onChange={handleCheckBoxChange} label="Admin Page" name="adminPage" checked={selectedGroups.adminPage} />
                            <CheckBox onChange={handleCheckBoxChange} label="Projects specific channel" name="projectsChannel" checked={selectedGroups.projectsChannel} />
                            <CheckBox onChange={handleCheckBoxChange} label="Events" name="events" checked={selectedGroups.events} />
                            <CheckBox onChange={handleCheckBoxChange} label="Announcements" name="announcements" checked={selectedGroups.announcements} />
                        </div>

                        <div className="flex justify-end mt-6">
                            <BigBlackButton disabled={submitting}>
                                {submitting ? <Spinner /> : "Create Organization"}
                            </BigBlackButton>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

