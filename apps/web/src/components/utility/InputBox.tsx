import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ShowPassword from './ShowPassword';

interface TextInputProps {
    label?: string;
    input?: string;
    setInput?: (value: string) => void;
    type?: string;
    value?: string;
    placeholder?: string;
}

export default function ({ label, input, setInput, type, value, placeholder }: TextInputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (setInput) {
            setInput(e.target.value);
        }
    };
    return (
        <div className="flex flex-col space-y-[4px]">
            <label htmlFor="input" className="text-xs font-mono text-gray-700 dark:text-gray-200">
                {label}
            </label>
            <div className="relative">
                <input
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    id="input"
                    type={type ? showPassword ? 'text' : 'password' : "text"}
                    className="px-4 py-[9px] text-xs font-thin border border-gray-300 text-black shadow-sm focus:outline-none rounded-[4px] w-full pr-10 placeholder:text-black dark:bg-zinc-800 dark:text-gray-200 dark:placeholder:text-gray-200"
                />{
                    type === "password" && (
                        <ShowPassword showPassword={showPassword} setShowPassword={setShowPassword} type={type} />
                    )
                }

            </div>
        </div>
    );
}
