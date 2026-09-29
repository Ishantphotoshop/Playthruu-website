import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// The app's two faces: Unbounded for the PlayThruu wordmark and display
// headlines, Manrope for everything else. Nothing else, on purpose.
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-brand",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const title = "PlayThruu — every game you ever played";
const description =
  "One diary for every game you play. Log it, rate it, review it, and see what your friends are playing. Opens 20 October.";

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
  themeColor: "#14181c",
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
    <html lang="en" className={unbounded.variable + " " + manrope.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
