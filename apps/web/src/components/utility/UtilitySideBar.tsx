import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import AppLogo from "../heading/AppLogo";

interface UtilitySideBarProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    content: React.ReactNode;
    width: string;
    bottomLogo?: boolean;
    blob?: boolean;
}

export default function ({ open, setOpen, content, width, bottomLogo, blob }: UtilitySideBarProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [open, setOpen]);
    
    return (
        <>
            <div ref={ref} className={`fixed top-0 right-0 h-screen w-${width} bg-[#f2f2f2] border-l-[1px] dark:border-zinc-800 dark:bg-neutral-900 dark:text-neutral-200 shadow-xl z-50 rounded-xl transform transition-transform ease-in-out duration-300 ${open ? "translate-x-0" : "translate-x-full"} overflow-hidden`}>
                {blob && (
                    <div className="absolute right-0 pointer-events-none w-full h-full">
                        <div className="gooey-blob"></div>
                    </div>
                )}
                
                {content}
                
                {bottomLogo && (
                    <div className="mt-2 bottom-4 absolute mx-4 z-10">
                        <AppLogo />
                        <p className="text-[11px] font-thin mx-3 my-2 mb-4 italic">
                            100xThreads is the go-to solution for managing group chats and rooms. Customize, organize, and stay connected with ease.
                        </p>
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                .gooey-blob {
                    height: 18rem;
                    width: 18rem;
                    position: absolute;
                    border-radius: 50%;
                    background: #eab508;
                    opacity: 0.2;
                    bottom: 30%;
                    right: 10%;
                    filter: blur(20px);
                    animation-name: gooey;
                    animation-duration: 6s;
                    animation-iteration-count: infinite;
                    animation-direction: alternate;
                    animation-timing-function: ease-in-out;
                }
                
                @keyframes gooey {
                    from {
                        filter: blur(20px);
                        transform: translate(10%, -10%) skew(0);
                    }
                    to {
                        filter: blur(30px);
                        transform: translate(-10%, 10%) skew(-12deg);
                    }
                }
            `}</style>
        </>
    );
}