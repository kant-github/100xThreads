import { Lexend_Deca } from 'next/font/google';

// Importing the Lexend Deca font
const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['300'], // Using the light weight for elegance
});

// Interface for the button props
interface OrganizationButtonProps {
  onClick: () => void; // Click handler
  children: React.ReactNode; // Content inside the button
}

// Functional component for the organization button
export default function OrganizationButton({
  onClick,
  children,
}: OrganizationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center tracking-wider shadow-sm shadow-zinc-800 justify-center gap-x-4 w-full px-6 py-3 rounded-[8px] bg-black text-zinc-100 text-sm font-light transition-all duration-200 hover:bg-zinc-800 focus:outline-none${lexendDeca.className}`}
    >
      {children}
    </button>
  );
}
