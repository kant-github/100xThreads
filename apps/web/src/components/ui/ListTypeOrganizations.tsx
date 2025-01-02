import Image from "next/image";

interface ListTypeOrganizations {
    organizations: Organization[] | [];
}

interface Organization {
    title: string;
    description: string;
    tags: string[];
    logo: string;
    totalUsers: number;
    onlineUsers: number;
    owner: string;
    createdAt: string;
}

export default function ({ organizations }: ListTypeOrganizations) {
    return (
        <div className="h-full overflow-y-auto">
            {
                organizations.map((organization, index) => (
                    <div className="w-full flex-col px-10 py-4 border-b-[0.5px] border-zinc-700" key={index}>
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row items-center gap-x-3">
                                <Image className="rounded-full" width={40} height={40} src={organization.logo} alt="logo" />
                                <div className="flex-col">
                                    <div className="text-sm dark:text-zinc-200" >{organization.title}</div>
                                    <div className="text-xs dark:text-zinc-400">{organization.description}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm dark:text-zinc-200 font-semibold">{organization.owner}</div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}
