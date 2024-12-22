import { Dispatch, SetStateAction, useCallback, useState } from "react";
import InputBox from "../utility/InputBox";
import BigBlackButton from "../buttons/BigBlackButton";
import PhotoUploadIcon from "../ui/PhotoUploadIcon";
import CrossButton from "../utility/CrossButton";
import Spinner from "../loaders/Spinner";
import RemoveIconCrossButton from "../ui/RemoveIconCrossButton";
import SelectBox from "../utility/SelectBox";
import CheckBox from "../utility/CheckBox";
import { IoCheckmarkCircle } from "react-icons/io5";
import axios from "axios";
import { ORGANIZATION } from "@/lib/apiAuthRoutes";
import { CustomSession } from "app/api/auth/[...nextauth]/options";
import InputBoxCalls from "../utility/InputBoxCalls";
import { debounce } from "@/lib/debounce";
import TermsAndCondition from "../utility/TermsAndCondition";
import { FaUser } from "react-icons/fa6";
import { OrganizationType } from "./CreateChatCard";

interface SelectedGroups {
    generalChat: boolean;
    adminPage: boolean;
    projectsChannel: boolean;
    events: boolean;
    announcements: boolean;
}

interface CreateRoomProps {
    session: CustomSession | null
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    name: string | null;
    setName: Dispatch<SetStateAction<string | null>>;
    organizationName: string | null;
    setOrganizationName: Dispatch<SetStateAction<string | null>>;
    organizationType: OrganizationType;
    setOrganizationType: Dispatch<SetStateAction<OrganizationType>>;
    selectedGroups: SelectedGroups;
    setSelectedGroups: Dispatch<SetStateAction<SelectedGroups>>;
    roomPasscode: string;
    setRoomPasscode: Dispatch<SetStateAction<string>>;
    creaOrganizationHandler: () => Promise<void>;
    groupPhoto: File | null;
    setGroupPhoto: Dispatch<SetStateAction<File | null>>;
    setIcon: Dispatch<SetStateAction<string | null>>;
    icon: string | null;
    termsAndconditionChecked: boolean;
    setTermsAndConditionchecked: Dispatch<SetStateAction<boolean>>;
}

export default function CreateRoom({
    session,
    open,
    setOpen,
    name,
    setName,
    organizationName,
    setOrganizationName,
    organizationType,
    setOrganizationType,
    selectedGroups,
    setSelectedGroups,
    creaOrganizationHandler,
    groupPhoto,
    setGroupPhoto,
    setIcon,
    icon,
    termsAndconditionChecked,
    setTermsAndConditionchecked
}: CreateRoomProps) {
    const [submitting, setSubmitting] = useState(false);
    const dynamicFirstName = name?.split(" ")[0];
    const dynamicLastName = name?.split(" ")[1];
    const [firstName, setFirstName] = useState<string>(dynamicFirstName!);
    const [lastName, setLastName] = useState<string>(dynamicLastName!);
    const [isLoading, setIsLoading] = useState(false);
    const [organizationNameAvailable, setOrganizationNameAvailable] = useState<boolean | null>(null);



    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setSelectedGroups((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };


    async function handleSubmit() {
        setSubmitting(true);
        await creaOrganizationHandler();
        setSubmitting(false);
    }


    const handleOrganizationNameChangeDebounced = useCallback(
        debounce(async (organizationName: string) => {

            if (organizationName.length > 0) {
                try {
                    setIsLoading(true);
                    const data = await axios.get(`${ORGANIZATION}-by-search`, {
                        headers: {
                            authorization: `Bearer ${session?.user?.token}`,
                        },
                        params: {
                            name: organizationName
                        }
                    })
                    console.log("data is : ", data.data.exists);
                    setOrganizationNameAvailable(data.data.exists);
                } catch (err) {
                    console.error("Error checking organization name", err);
                    setOrganizationNameAvailable(false);
                } finally {
                    setIsLoading(false);
                }
            }
        }, 500), [session]
    )

    const handleOrganizationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOrganizationName = e.target.value;
        setOrganizationName(newOrganizationName);
        handleOrganizationNameChangeDebounced(newOrganizationName);
    };

    return (
        <>
            {open && (
                <div className="fixed w-screen h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <form
                        className="bg-white dark:bg-[#262629] dark:text-gray-200 px-8 py-6 rounded-[6px] shadow-lg w-5/12 relative flex flex-col gap-y-3"
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
                            <div className="p-2 dark:bg-zinc-900 dark:hover:bg-black mt-4 rounded cursor-pointer relative">
                                <FaUser size={24} className="text-gray-400" />
                            </div>
                            <InputBox input={firstName} setInput={setFirstName} label="Owner's first name" />
                            <InputBox input={lastName} setInput={setLastName} label="Owner's last name" />
                        </div>

                        <div className="relative flex items-center gap-x-2">
                            {
                                isLoading ? (
                                    <Spinner size="3" className="absolute right-2 -top-1" />
                                ) : !organizationNameAvailable ? (
                                    <IoCheckmarkCircle className="absolute text-sm right-1 -top-1 text-green-500" />
                                ) : (
                                    <p className="absolute text-[11px] font-light right-1 top-0 text-red-500">Name already taken</p>
                                )
                            }
                            <PhotoUploadIcon setIcon={setIcon} setGroupPhoto={setGroupPhoto} />
                            <InputBoxCalls input={organizationName} onChange={handleOrganizationNameChange} label="Organization's name" />
                        </div>
                        <div className="text-gray-600 text-sm ml-0.5 flex items-center justify-start gap-x-1">
                            {
                                groupPhoto ?
                                    (<span className="text-[10px] text-yellow-500 font-medium max-w-4 overflow-hidden">{groupPhoto.name.slice(0, 6)}...</span>) :
                                    (<span className="text-[10px] text-yellow-500">{icon}</span>)
                            }
                            <RemoveIconCrossButton icon={icon} setIcon={setIcon} />
                        </div>
                        <SelectBox selectedType={organizationType} onTypeChange={setOrganizationType} />
                        <div className="flex flex-col gap-y-2.5 mt-2 border-[1px] px-6 py-3 border-gray-300 dark:border-zinc-600 rounded-[4px]">
                            <p className="text-zinc-300 text-[11px] font-light italic">
                                Choose the default chat groups that best suit your organization's communication needs.
                                You can always add more later, but these will get the conversation started!
                            </p>
                            <CheckBox onChange={handleCheckBoxChange} label="General chat / Water cooler" name="generalChat" checked={selectedGroups.generalChat} />
                            <CheckBox onChange={handleCheckBoxChange} label="Admin Page" name="adminPage" checked={selectedGroups.adminPage} />
                            <CheckBox onChange={handleCheckBoxChange} label="Projects specific channel" name="projectsChannel" checked={selectedGroups.projectsChannel} />
                            <CheckBox onChange={handleCheckBoxChange} label="Events" name="events" checked={selectedGroups.events} />
                            <CheckBox onChange={handleCheckBoxChange} label="Announcements" name="announcements" checked={selectedGroups.announcements} />
                        </div>
                        <TermsAndCondition termsAndconditionChecked={termsAndconditionChecked} setTermsAndConditionchecked={setTermsAndConditionchecked} />

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

