"use client"
import { RecoilRoot } from "recoil";
export default function ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div>
        <div>
            <RecoilRoot>
                {children}
            </RecoilRoot>


        </div>
    </div>
}