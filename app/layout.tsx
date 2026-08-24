import type { Metadata, Viewport } from "next";
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

const title = "PlayThruu | Your games. Your story.";
const description =
  "A home for your gaming life. Log the journey, find your next obsession, and share the moments worth remembering.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: title,
    template: "%s | PlayThruu",
  },
  description,
  keywords: ["game tracker", "gaming backlog", "game log", "gaming journal", "PlayThruu"],
  openGraph: {
    title,
    description,
    siteName: "PlayThruu",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0f",
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
          " antialiased"
        }
      >
        {children}
      </body>
    </html>
  );
}
