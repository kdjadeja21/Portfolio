import Header from "@/components/header";
import "./globals.css";
import { Syne, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import SmoothScroll from "@/components/smooth-scroll";
import CustomCursor from "@/components/custom-cursor";
import ScrollProgress from "@/components/scroll-progress";
import { Toaster } from "react-hot-toast";
import { siteUrl } from "@/lib/site";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:
    "Krushnasinh Jadeja | Senior Software Engineer · Cursor Ambassador · AI Consultant",
  description:
    "Senior software engineer, Cursor Ambassador, and AI consultant in Gujarat, India. I help organisations ship software and build automation.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Krushnasinh Jadeja — Senior Software Engineer · Cursor Ambassador",
    description:
      "I build production software, consult on AI-assisted engineering, and help organisations automate the work around shipping.",
    url: siteUrl,
    siteName: "Krushnasinh Jadeja",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${syne.variable} ${grotesk.variable} ${plexMono.variable} bg-ink font-sans text-paper antialiased`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <ActiveSectionContextProvider>
          <SmoothScroll />
          <ScrollProgress />
          <Header />
          {children}
          <Footer />
          <CustomCursor />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#17171d",
                color: "#f0efe9",
                border: "1px solid rgb(240 239 233 / 0.12)",
              },
            }}
          />
        </ActiveSectionContextProvider>

        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
