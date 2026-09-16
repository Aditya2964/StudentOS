import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudentOS — Centralized Academic Management Platform",
  description:
    "Everything a student needs for college, in one place: daily biometric attendance, streaks, assignments, notes, timetables, and AI assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#EAE6DE] text-[#1C1917]">
        {children}
      </body>
    </html>
  );
}


