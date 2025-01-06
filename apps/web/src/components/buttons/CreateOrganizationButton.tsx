import { Lexend_Deca } from 'next/font/google';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['300'],
});


interface OrganizationButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function OrganizationButton({
  onClick,
  children,
  className
}: OrganizationButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`flex items-center tracking-wider justify-center gap-x-4 w-full px-6 py-3 rounded-[8px] bg-black text-zinc-100 text-sm font-light transition-all duration-200 hover:bg-zinc-800 focus:outline-none ${lexendDeca.className} ${className}`}>
      {children}
    </button>
  );
}
