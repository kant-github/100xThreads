"use client"
import { RecoilRoot } from "recoil";
export default function ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen">
            <RecoilRoot>
                {children}
            </RecoilRoot>
        </div>
    )
}