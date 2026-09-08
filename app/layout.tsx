import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
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
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "rDo2eI8mHiuFXBXqoUGEkH1APiBfx0l0F8ELNNOc2LA",
  },
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
  themeColor: "#14100b",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PlayThruu",
  url: "https://playthruu.com",
  description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={
          fraunces.variable +
          " " +
          plexSans.variable +
          " " +
          plexMono.variable +
          " antialiased"
        }
      >
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
