import React, { Dispatch, SetStateAction, useState } from 'react';
import ShowPassword from './ShowPassword';

interface TextInputProps {
    label?: string;
    input?: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    value?: string;
    placeholder?: string;
}

export default function ({ label, input, onChange, type, value, placeholder }: TextInputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="flex flex-col space-y-[4px] w-full">
            <label htmlFor="input" className="text-xs font-light tracking-wider text-gray-700 dark:text-gray-200">
                {label}
            </label>
            <div className="relative">
                <input
                    value={input!}
                    onChange={onChange}
                    placeholder={placeholder}
                    id="input"
                    type={type ? showPassword ? 'text' : 'password' : "text"}
                    className="px-4 py-[9px] text-xs font-thin border border-gray-300 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[4px] w-full pr-10 placeholder:text-black dark:bg-zinc-800 dark:text-gray-200 dark:placeholder:text-gray-200"
                />{
                    type === "password" && (
                        <ShowPassword showPassword={showPassword} setShowPassword={setShowPassword} type={type} />
                    )
                }

            </div>
        </div>
    );
}
