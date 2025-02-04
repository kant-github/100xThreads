import React, { Dispatch, SetStateAction, useState } from 'react';
import ShowPassword from './ShowPassword';
import ErrorMessage from './ErrorMessage';

interface TextInputProps {
    label?: string;

    onChange: Dispatch<SetStateAction<string>>;
    error?: string;
    type?: string;
    value?: string;
    placeholder?: string;
    disable?: boolean;
    className?: string
}

export default function ({ label, onChange, type, value, placeholder, error, disable, className }: TextInputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className={`flex flex-col space-y-[4px] w-full relative ${className}`}>
            <label htmlFor="input" className="text-[12px] ml-1 font-light tracking-wider text-gray-700 dark:text-gray-200">
                {label}
            </label>
            <ErrorMessage error={error} />

            <div className="relative">
                <input
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(e.target.value);
                    }}
                    disabled={disable}
                    placeholder={placeholder}
                    id="input"
                    type={type ? showPassword ? 'text' : 'password' : "text"}
                    className="px-4 py-[12px] text-xs font-medium border-[1px] border-zinc-400 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[4px] w-full pr-10 dark:bg-neutral-900 dark:text-gray-200 placeholder:text-[12px] placeholder:text-neutral-400"
                />{
                    type === "password" && (
                        <ShowPassword showPassword={showPassword} setShowPassword={setShowPassword} type={type} />
                    )
                }

            </div>
        </div>
    );
}
