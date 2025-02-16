import Image from "next/image";

export default function ({ className }: { className?: string }) {
    return (
        <div className={`flex flex-col items-center justify-center gap-2 px-4 text-center max-w-[90%] mx-auto ${className}`}>
            <div className="bg-yellow-600/70 rounded-[12px]">
                <Image src="/images/empty.png" width={100} height={40} alt="empty" className="p-3" />
            </div>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-semibold tracking-wide text-zinc-400">No chats yet</h1>
                <p className="text-xs font-normal tracking-wide text-zinc-400">Start a conversation by sending a friendly greeting!</p>
            </div>
        </div>
    );
};
