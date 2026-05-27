import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";
import { RippleProvider, ScrollRevealProvider } from "~/components/cascade-providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Formzzz - Dynamic Forms & Submissions",
  description: "Design premium waterfall forms and analyze responder results in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="waterfall">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GlobalProviders>
          <RippleProvider />
          <ScrollRevealProvider />
          {children}
        </GlobalProviders>
      </body>
    </html>
  );
}
