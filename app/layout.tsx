import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const title = "PlayThruu — your gaming diary";
const description =
  "Log, rate, and review the games you play. Follow friends and see what they're playing.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: title,
    template: "%s | PlayThruu",
  },
  description,
  keywords: [
    "game diary",
    "gaming backlog",
    "game log",
    "game reviews",
    "PlayThruu",
  ],
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
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* Switzer: the app's wordmark font (Fontshare, free for commercial
            use) — matches the actual PlayThruu app, which uses it for the
            same reason: closest open equivalent to Gilroy without buying a
            licence. Only the wordmark references --font-brand. */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=switzer@800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={
          plusJakartaSans.variable + " " + ibmPlexMono.variable + " antialiased"
        }
      >
        {children}
      </body>
    </html>
  );
}
