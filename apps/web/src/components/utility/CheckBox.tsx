import React from 'react';

interface CheckboxProps {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    name?: string;
    className?: string | null;
}

export default function Checkbox({ checked, onChange, label, name, className }: CheckboxProps) {
    return (
        <div className={`flex items-center gap-x-2 ${className}`}>
            <input
                type="checkbox"
                id={name}
                name={name}
                checked={checked}
                onChange={onChange}
                className="appearance-none h-4 w-4 rounded-md bg-gray-200 border border-gray-300 checked:bg-yellow-500 checked:border-yellow-500
                           checked:before:content-['✔'] checked:before:text-white checked:before:text-[10px] checked:before:font-bold checked:before:flex checked:before:justify-center checked:before:items-center"
            />
            {label && (
                <label
                    htmlFor={name}
                    className="text-[12px] font-light tracking-wider text-gray-700 dark:text-gray-200"
                >
                    {label}
                </label>
            )}
        </div>
    );
}
