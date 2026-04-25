import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Le Chat à 3 Têtes — Troupe de comédie musicale",
    template: "%s · Le Chat à 3 Têtes",
  },
  description:
    "Le Chat à 3 Têtes, troupe de comédie musicale. Découvrez notre premier spectacle : Les Sœurs en Répèt'.",
  icons: {
    icon: "/assets/logo.jpg",
    apple: "/assets/logo.jpg",
  },
  openGraph: {
    title: "Le Chat à 3 Têtes",
    description:
      "Troupe de comédie musicale. Premier spectacle : Les Sœurs en Répèt'.",
    images: ["/assets/logo.jpg"],
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
