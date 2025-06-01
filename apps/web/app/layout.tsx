"use client"
import SessionProvider from "providers/SessionProvider";
import localFont from "next/font/local";
import "./globals.css";
import { RecoilRoot } from "recoil";
import { NotificationProvider } from "providers/NotificationProvider";
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

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
                  const storedTheme = localStorage.getItem('theme');
                  
                  if (storedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (storedTheme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    // Default to system preference
                    const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (isDarkSystem) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.add('light');
                    }
                  }
                })();
              `,
            }}
          />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} dark:bg-neutral-900 bg-[#f2f2f2] transition-colors duration-200`}>
          <RecoilRoot>
            <NotificationProvider>
              {children}
              <Toaster />
            </NotificationProvider>
          </RecoilRoot>
        </body>
      </SessionProvider>
    </html>
  );
}