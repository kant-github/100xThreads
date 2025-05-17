import React, { useState } from 'react';
import ShowPassword from './ShowPassword';

interface TextInputProps {
    label?: string;
    input?: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    name?: string
    value?: string;
    placeholder?: string;
}

export default function ({ label, input, onChange, type, value, name, placeholder }: TextInputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="flex flex-col space-y-[4px] w-full">
            <label htmlFor="input" className="text-xs font-light tracking-wider text-gray-700 dark:text-gray-200">
                {label}
            </label>
            <div className="relative">
                <input
                    name={name}
                    value={input!}
                    onChange={onChange}
                    placeholder={placeholder}
                    id="input"
                    type={type ? showPassword ? 'text' : 'password' : "text"}
                    className="px-4 py-[11px] text-xs font-medium border-[1px] border-zinc-400 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[8px] w-full pr-10 dark:bg-neutral-900 dark:text-gray-200 placeholder:text-[12px] placeholder:text-neutral-400"
                />{
                    type === "password" && (
                        <ShowPassword showPassword={showPassword} setShowPassword={setShowPassword} type={type} />
                    )
                }

            </div>
        </div>
    );
}
