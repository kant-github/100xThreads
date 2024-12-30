import React from 'react';

interface CustomSwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function({ checked, onCheckedChange, disabled }: CustomSwitchProps) {
    return (
        <div 
            onClick={() => !disabled && onCheckedChange(!checked)}
            className={`
                relative w-11 h-6 rounded-full cursor-pointer transition-all duration-200
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                ${checked ? 'bg-[#f5a331]' : 'bg-gray-300 dark:bg-gray-600'}
            `}
        >
            <div 
                className={`
                    absolute top-1 left-1 w-4 h-4 bg-white rounded-full 
                    transition-transform duration-200 ease-in-out
                    ${checked ? 'translate-x-5' : 'translate-x-0'}
                `}
            />
        </div>
    );
};
