import { Poppins } from "next/font/google"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"], // You can customize the font weight
  });

export default function ({children}: {children: React.ReactNode}) {
    return (
        <div className={`${poppins.className} text-5xl w-full`}>{children}</div>
    )
}