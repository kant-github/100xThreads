"use client"
import OrgNavBar from "@/components/organization/OrgNavBar";

interface OrgPageProps {
    params: {
        id: string
    }
}

export default function ({ params }: OrgPageProps) {

    return (
        <div>
            <OrgNavBar />
            {params.id}
        </div>
    )
}