import { useRef, useState, useEffect } from "react";
import { GiAbstract006, GiAbstract018, GiAbstract042, GiAbstract045, GiAmericanFootballHelmet, GiBarbute, GiBiceps, GiBoar, GiBookmarklet, GiBuffaloHead, GiCyberEye, GiDinosaurRex, GiDread, GiEagleHead } from "react-icons/gi";
import { MdAddAPhoto, MdFavorite, MdThumbUp } from "react-icons/md";

interface PhotoUploadIconProps {
    setGroupPhoto: (value: File) => void;
    setIcon: (icon: JSX.Element) => void;
}

export default function PhotoUploadIcon({ setGroupPhoto, setIcon }: PhotoUploadIconProps) {
    const [showOptionMenu, setShowOptionMenu] = useState(false);
    const [showIconsMenu, setShowIconsMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setGroupPhoto(file);
            setShowOptionMenu(false);
        }
    }

    function handleIconClick() {
        fileInputRef.current?.click();
    }

    return (
        <div className="p-2 dark:bg-zinc-900 dark:hover:bg-black mt-4 rounded cursor-pointer relative">
            <MdAddAPhoto
                className="text-gray-400"
                size={30}
                onClick={() => setShowOptionMenu(!showOptionMenu)}
            />

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                aria-label="browse"
                onChange={handleFileChange}
            />

            {showOptionMenu && (
                <GroupIconOptionMenu
                    onSelect={() => {
                        handleIconClick();
                        setShowOptionMenu(false);
                    }}
                    onIconSelect={() => {
                        setShowIconsMenu(true);
                        setShowOptionMenu(false);
                    }}
                    onClose={() => setShowOptionMenu(false)}
                />
            )}

            {showIconsMenu && (
                <IconsMenu
                    onSelect={(icon) => {
                        setIcon(icon);
                        setShowIconsMenu(false);
                    }}
                    onClose={() => setShowIconsMenu(false)}
                />
            )}
        </div>
    );
}

interface GroupIconOptionMenuProps {
    onSelect: () => void;
    onIconSelect: () => void;
    onClose: () => void;
}

function GroupIconOptionMenu({ onSelect, onIconSelect, onClose }: GroupIconOptionMenuProps) {
    const optionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (optionRef.current && !optionRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div ref={optionRef} className="absolute top-full mt-2 bg-white dark:bg-zinc-600 rounded shadow z-50 text-xs flex flex-col w-40">
            <div
                onClick={onIconSelect}
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800 w-full px-4 py-2"
            >
                Select Icon
            </div>
            <div
                onClick={onSelect}
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800 w-full px-4 py-2"
            >
                Choose from gallery
            </div>
        </div>
    );
}

interface IconsMenuProps {
    onSelect: (icon: JSX.Element) => void;
    onClose: () => void;
}

function IconsMenu({ onSelect, onClose }: IconsMenuProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const icons = [
        { icon: <MdFavorite /> },
        { icon: <MdThumbUp /> },
        { icon: <GiAbstract006 /> },
        { icon: <GiAbstract018 /> },
        { icon: <GiAbstract045 /> },
        { icon: <GiAbstract042 /> },
        { icon: <GiAmericanFootballHelmet /> },
        { icon: <GiBarbute /> },
        { icon: <GiBiceps /> },
        { icon: <GiBoar /> },
        { icon: <GiBookmarklet /> },
        { icon: <GiBuffaloHead /> },
        { icon: <GiCyberEye /> },
        { icon: <GiDinosaurRex /> },
        { icon: <GiDread /> },
        { icon: <GiEagleHead /> }
    ];
    return (
        <div ref={menuRef} className="absolute top-full left-full ml-2 mt-2 bg-white dark:bg-zinc-600 rounded shadow z-50 text-xs flex flex-wrap w-32 p-2">
            {icons.map(({ icon }, index) => (
                <div
                    key={index}
                    onClick={() => onSelect(icon)}
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800 px-2 py-2 flex items-center gap-2"
                >
                    {icon}
                </div>
            ))}
        </div>
    );
}