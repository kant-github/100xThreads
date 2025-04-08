import Image from "next/image";

export default function () {
    return (
        <div className="h-screen flex">
            <div className="relative h-full w-6/12">  {/* Adjust width as needed */}
                <Image
                    src={"/images/chat.webp"}
                    alt="sv"
                    fill
                    className="object-cover object-left"
                    priority
                />
            </div>
        </div>
    )
}