"use client";
import BigBlackButton from "../buttons/BigBlackButton";
import InputBox from "../utility/InputBox";
import { FaRegCopyright } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="bg-[#1f282e] dark:bg-[#1c1c1c] pt-10 pb-4 px-10 text-gray-300 font-thin text-xs border-t border-gray-500">
            <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="flex flex-col gap-4 w-full md:w-1/4">
                    <h4 className="text-lg font-semibold mb-3">About Us</h4>
                    <p className="text-xs italic">
                        Bringing people together for real-time chats, easy communication, and seamless collaboration.
                    </p>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4 mt-4 md:mt-0">
                    <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
                    <div className="cursor-pointer hover:text-gray-400 transition duration-200">FAQ</div>
                    <div className="cursor-pointer hover:text-gray-400 transition duration-200">Terms of Service</div>
                    <div className="cursor-pointer hover:text-gray-400 transition duration-200">Privacy Policy</div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4 mt-4 md:mt-0">
                    <h4 className="text-lg font-semibold mb-3">Newsletter</h4>
                    <p className="text-sm">Stay updated with our latest features</p>
                    <div className="flex items-center gap-x-4">
                        <InputBox placeholder="Your e-mail" />
                        <div className="mt-1">
                            <BigBlackButton>Subscribe</BigBlackButton>
                        </div>
                    </div>

                </div>
            </div>
            <div className="mt-8 text-center text-sm text-gray-400 pt-4 border-t border-gray-700">
                <p className="flex items-center justify-center space-x-2">
                    <FaRegCopyright className="text-md" />
                    <span>2024 Banter. All rights reserved.</span>
                </p>
            </div>
        </div>
    );
}
