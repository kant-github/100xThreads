"use client"
import SessionProvider from "providers/SessionProvider";
import localFont from "next/font/local";
import { Toaster } from 'sonner';
import "./globals.css";
import { RecoilRoot } from "recoil";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

// export const metadata: Metadata = {
//   title: "Banter",
//   description: "Send chats fast and foremost",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const darkMode = localStorage.getItem('theme') === 'dark' ||
                    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (darkMode) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                })();
              `,
            }}
          />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} dark:bg-[#171717] bg-[#f2f2f2]`}>
          <RecoilRoot>
            {children}
          </RecoilRoot>
          <Toaster position="bottom-right" closeButton duration={2300} />
        </body>
      </SessionProvider>
    </html>
  );
}
