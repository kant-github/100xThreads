import Image from "next/image";

export default function () {
    return (
        <div className="relative h-full w-6/12 flex">
            <Image
                src={"/images/chat.webp"}
                alt="sv"
                fill
                className="object-cover object-left"
                priority
            />
        </div>
    )
}