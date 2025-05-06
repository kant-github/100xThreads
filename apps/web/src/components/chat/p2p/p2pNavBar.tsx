import Version from "@/components/buttons/Version";
import ProfileDropDown from "@/components/dashboard/ProfileDropDown";
import AppLogo from "@/components/heading/AppLogo";
import Greetings from "@/components/utility/Greetings";
import SearchInput from "@/components/utility/SearchInput";

export default function () {
    return (
        <div className="flex bg-light dark:bg-dark flex-row justify-between items-center w-full h-full px-8 border-b border-neutral-300 dark:border-zinc-700 dark:shadow-[40px]">
            <div className="flex items-center gap-x-2">
                <AppLogo />
                <Version />
            </div>
            <div className="flex flex-row justify-center items-center gap-x-6">
                <Greetings />
                <div className="w-[340px]">
                    <SearchInput
                        // setSearchResultDialogBox={setSearchResultDialogBox}
                        // input={searchInput}
                        // setInput={setSearchInput}
                    />
                </div>
                <ProfileDropDown />
            </div>
        </div>
    )
}