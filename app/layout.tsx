import type { Metadata } from "next";
import { Inter, Anton, Homemade_Apple } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const signatureFont = Homemade_Apple({
  weight: "400",
  variable: "--font-signature",
  subsets: ["latin"],
});

import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: "Prince Lucky | Mobile Videography & Cinematography in Gokak, Belagavi",
    template: `%s | Prince Lucky 42`,
  },
  description: "Prince Lucky - Expert mobile videographer & cinematographer based in Gokak, Belagavi, Karnataka. Specializing in Kannada reels, pre-wedding shoots, promotional videos, and creative mobile photography.",
  keywords: [
    "mobile videography", 
    "cinematography", 
    "pre wedding shoot", 
    "promotional video", 
    "Kannada reels", 
    "instagram reels editor",
    "Gokak", 
    "Belagavi", 
    "Belgum",
    "Karnataka", 
    "Prince Lucky 42",
    "princelucky42",
    "princelucky.co.in",
    "mobile photography",
    "video graphy",
    "wedding videographer Belagavi"
  ],
  authors: [
    {
      name: "Prince Lucky",
      url: "https://princelucky.co.in",
    },
  ],
  creator: "Prince Lucky",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://princelucky.co.in",
    title: "Prince Lucky | Mobile Videography & Cinematography in Gokak, Belagavi",
    description: "Expert mobile videographer & cinematographer based in Gokak, Belagavi. Specializing in Kannada reels, pre-wedding shoots, and promotional videos.",
    siteName: "Prince Lucky",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prince Lucky | Mobile Videography",
    description: "Expert mobile videographer & cinematographer based in Gokak, Belagavi, Karnataka.",
    creator: "@prince_lucky",
  },
};

import AntiInspect from "@/components/AntiInspect";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} ${signatureFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#c0c0c0] text-black select-none pointer-events-auto">
        <AntiInspect />
        {children}
      </body>
    </html>
  );
}
