import React, { useState } from 'react';
import Image from 'next/image';
import UtilityMiniSideBar from '../utility/UtilityMiniSideBar';

interface OptionImageProps {
    image: {
        src: string;
        alt?: string;
        width?: number;
        height?: number;
    };
    imageClassName?: string
}

const OptionImage: React.FC<OptionImageProps> = ({ image, imageClassName }) => {
    const [open, setOpen] = useState(false);

    const handleImageClick = () => {
        setOpen(prev => !prev);
    };

    return (
        <div className="relative inline-block">
            <div
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={handleImageClick}
            >
                <Image
                    src={image.src}
                    alt={image.alt || 'Option image'}
                    width={image.width || 64}
                    height={image.height || 64}
                    className={`object-cover ${imageClassName}`}
                />
            </div>

            <UtilityMiniSideBar
                open={open}
                setOpen={setOpen}
                content={""}
            />
        </div>
    );
};

export default OptionImage;