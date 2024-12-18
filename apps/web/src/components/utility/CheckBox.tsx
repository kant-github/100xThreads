// components/Checkbox.tsx

import React from 'react';

interface CheckboxProps {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    name?: string;
    className?: string | null;
}

export default function({ checked, onChange, label, name, className }: CheckboxProps) {
    return (
        <div className={`flex items-center gap-x-2 ${className}`}>
            <input
                type="checkbox"
                id={name}
                name={name}
                checked={checked}
                onChange={onChange}
                className="form-checkbox text-blue-500"
            />
            {label && (
                <label htmlFor={name} className="text-[12px] font-light tracking-wider text-gray-700 dark:text-gray-200">
                    {label}
                </label>
            )}
        </div>
    );
};

