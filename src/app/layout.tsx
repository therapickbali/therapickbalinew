import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { SpaProvider } from "@/context/SpaContext";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://elexoir-spa.com'),
  title: {
    default: "Elexoir Home Spa | Luxury Mobile Spa & Massage in Ubud, Bali",
    template: "%s | Elexoir Home Spa Bali"
  },
  description: "Experience the ultimate luxury mobile spa in Ubud, Bali. Elexoir Home Spa delivers premium massages, holistic rituals, and wellness treatments directly to your private villa or hotel. Book your sanctuary today.",
  keywords: ["Ubud Spa", "Bali Massage", "Mobile Spa Ubud", "Home Spa Bali", "Luxury Massage Ubud", "In-Villa Spa Bali", "Best Spa in Ubud", "Wellness Retreat Bali", "Elexoir Spa"],
  authors: [{ name: "Elexoir Spa" }],
  creator: "Elexoir Spa",
  publisher: "Elexoir Spa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Elexoir Home Spa | Premium Mobile Spa in Ubud",
    description: "The most exclusive in-villa spa experience in Ubud, Bali. Elevate your relaxation with our signature massages and organic treatments.",
    url: 'https://elexoir-spa.com',
    siteName: 'Elexoir Home Spa',
    images: [
      {
        url: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg',
        width: 1200,
        height: 630,
        alt: 'Elexoir Luxury Home Spa Bali',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Elexoir Home Spa | Luxury Mobile Spa in Ubud",
    description: "Experience the ultimate luxury mobile spa in Ubud, Bali. Premium in-villa massages and wellness rituals.",
    images: ['https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  name: 'Elexoir Home Spa',
  image: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg',
  '@id': 'https://elexoir-spa.com',
  url: 'https://elexoir-spa.com',
  telephone: '+6281234567890', // Replace with real number
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ubud',
    addressLocality: 'Gianyar',
    addressRegion: 'Bali',
    postalCode: '80571',
    addressCountry: 'ID'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -8.5069,
    longitude: 115.2625
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    opens: '09:00',
    closes: '22:00'
  },
  sameAs: [
    'https://instagram.com/elexoirspa'
  ],
  description: 'Luxury mobile spa and massage services in Ubud, Bali. Delivering premium wellness rituals directly to your villa.'
};

export const viewport: Viewport = {
  themeColor: "#D2F34C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming to feel like a native app
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${jakarta.variable} ${newsreader.variable} font-sans bg-transparent text-text min-h-screen selection:bg-primary selection:text-white pb-20`}
      >
        <SpaProvider>
          <TopNav />
          <main className="w-full relative min-h-[100dvh] bg-background overflow-x-hidden">
              {children}
          </main>
        </SpaProvider>
      </body>
    </html>
  );
}
