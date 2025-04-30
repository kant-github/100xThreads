"use client"
import SessionProvider from "providers/SessionProvider";
import localFont from "next/font/local";
import { Toaster } from 'sonner';
import "./globals.css";
import { RecoilRoot } from "recoil";
import { NotificationProvider } from "providers/NotificationProvider";

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
        <body className={`${geistSans.variable} ${geistMono.variable} dark:bg-neutral-900 bg-[#f2f2f2]`}>
          <RecoilRoot>
            <NotificationProvider>
              {children}
              <Toaster position="bottom-center" closeButton duration={2300} />
            </NotificationProvider>
          </RecoilRoot>
        </body>
      </SessionProvider>
    </html>
  );
}
