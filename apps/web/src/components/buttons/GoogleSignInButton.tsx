"use client"
import Image from "next/image"
export default function ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) {
    return (
        <>
            <button className="bg-black w-full hover:bg-gray-800 text-white px-3 py-3 text-xs rounded-[7px] font-thin" onClick={onClick}>
                <div className="flex flex-row items-center justify-center gap-x-4">
                    <Image src="/images/google.png" unoptimized width={20} height={20} alt="google-logo" /> <span>{children}</span>
                </div>
            </button>
        </>
    )
}