import { protectedOrganizationMetadata } from "app/org/[id]/page";
import { useState } from "react"

interface props {
    metaData: protectedOrganizationMetadata
}

export default function ({ metaData }: props) {
    const [password, setPassword] = useState('')
    console.log("meta data is ", metaData);
    return (
        <div>
            <form className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter organization password"
                    className="px-4 py-2 border rounded"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" >
                    Join Organization
                </button>
            </form>
        </div>
    )
}