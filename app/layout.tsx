import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PlayThruu",
  description: "Discover games. Track what you play. Share your story.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          spaceGrotesk.variable +
          " " +
          inter.variable +
          " " +
          jetbrainsMono.variable +
          " font-body bg-[#0B0B12] text-white antialiased"
        }
      >
        {children}
      </body>
    </html>
  );
}
