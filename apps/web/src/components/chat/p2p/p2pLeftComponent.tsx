import Image from "next/image";

export default function ChatImage() {
    return (
        <div className="relative w-6/12 h-full">
            <Image
                src="/images/chat.webp"
                alt="Chat illustration"
                fill
                className="object-cover object-left"
                priority
            />
        </div>
    );
}
