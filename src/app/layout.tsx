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
  metadataBase: new URL('https://www.elexoirhomespaubud.com'),
  title: {
    default: "Elexoir Home Spa | Luxury Mobile Spa & Massage in Ubud, Bali",
    template: "%s | Elexoir Home Spa Bali"
  },
  description: "Experience the ultimate luxury mobile spa in Ubud, Bali. Elexoir Home Spa delivers premium professional massages, holistic rituals, and wellness treatments directly to your private villa or hotel. Book your sanctuary today.",
  keywords: [
    "Home massage service in Ubud", "Ubud Spa", "Bali Massage", "Mobile Spa Ubud", "Home Spa Bali", 
    "Luxury Massage Ubud", "In-Villa Spa Bali", "Best Spa in Ubud", "Wellness Retreat Bali", "Elexoir Spa",
    "Professional Massage Bali", "Mobile massage Canggu", "Bali tourist places massage", "Mobile Spa Seminyak", 
    "Premium spa delivery Bali", "Private massage Ubud", "Couples massage home Ubud"
  ],
  authors: [{ name: "Elexoir Spa" }],
  creator: "Elexoir Spa",
  publisher: "Elexoir Spa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: "Elexoir Home Spa | Premium Mobile Spa in Ubud & Bali",
    description: "The most exclusive in-villa spa experience in Ubud, Bali. Elevate your relaxation with our signature professional massages and organic treatments.",
    url: 'https://www.elexoirhomespaubud.com',
    siteName: 'Elexoir Home Spa',
    images: [
      {
        url: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg',
        width: 1200,
        height: 630,
        alt: 'Elexoir Home Spa - Luxury Mobile Spa & Massage in Ubud, Bali',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elexoir Home Spa | Luxury Mobile Spa & Massage in Ubud',
    description: 'Experience premium mobile spa services directly to your villa in Ubud, Bali.',
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
  other: {
    'geo.region': 'ID-BA',
    'geo.placename': 'Bali',
    'geo.position': '-8.4095;115.1889',
    'ICBM': '-8.4095, 115.1889',
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  name: 'Elexoir Home Spa',
  image: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg',
  '@id': 'https://www.elexoirhomespaubud.com',
  url: 'https://www.elexoirhomespaubud.com',
  telephone: '+6285174119423',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Sri Wedari, Ubud',
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
  areaServed: [
    "Ubud",
    "Canggu",
    "Seminyak",
    "Kuta",
    "Jimbaran",
    "Uluwatu"
  ],
  priceRange: "$$$",
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '154',
    bestRating: '5',
    worstRating: '1'
  },
  sameAs: [
    'https://instagram.com/elexoirspa'
  ],
  description: 'Bali\'s premier mobile spa. 5-star professional massage treatments brought directly to your private villa or hotel in Ubud, Canggu, Seminyak, Kuta, Jimbaran & Uluwatu.'
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Mobile Massage Service',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Elexoir Home Spa'
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: '-8.5069',
      longitude: '115.2625'
    },
    geoRadius: '25000'
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'IDR',
    price: '350000',
    availability: 'https://schema.org/InStock'
  }
};

export const viewport: Viewport = {
  themeColor: "#D2F34C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
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
