import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LetsTrip | Where Wanderlust Meets Experience",
  description:
    "Curated luxury travel experiences to Thailand, Dubai, Singapore, Bali and beyond. Your personal AI travel concierge for unforgettable adventures.",
  keywords:
    "travel agency, luxury travel, Thailand packages, Dubai tours, Bali holidays, Singapore trips, travel concierge",
  openGraph: {
    title: "LetsTrip | Where Wanderlust Meets Experience",
    description:
      "Curated luxury travel experiences designed to make every moment extraordinary.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-screen">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
