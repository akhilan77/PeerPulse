import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchModalWrapper from "@/components/search/SearchModalWrapper";

export const metadata: Metadata = {
  title: "PeerPulse AI | District Blood-Banking Intelligence",
  description: "Evidence-based, peer-relative district blood-bank service assessment for India based on ASAR / NACO data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col antialiased text-slate-100 bg-[#090d16]">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
        <SearchModalWrapper />
      </body>
    </html>
  );
}
