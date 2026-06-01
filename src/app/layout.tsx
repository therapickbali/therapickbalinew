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
    default: "Elexoir Home Spa | Luxury Mobile Spa & Massage in Bali",
    template: "%s | Elexoir Home Spa Bali"
  },
  description: "Experience the ultimate luxury mobile spa in Bali. Elexoir Home Spa delivers premium professional massages, holistic rituals, and wellness treatments directly to your private villa or hotel in Ubud, Canggu, Seminyak, and Uluwatu. Book your 5-star sanctuary today.",
  keywords: [
    "Home Spa Bali", "Mobile Spa Bali", "Luxury Home Spa Bali", "In Villa Massage Bali", 
    "Massage Bali", "Balinese Massage Bali", "Deep Tissue Massage Bali", "Couples Massage Bali", 
    "Wellness Bali", "Spa Treatment Bali", "Massage Service Bali", "Ubud Home Spa", 
    "Canggu Home Spa", "Seminyak Home Spa", "Uluwatu Home Spa", "Sanur Home Spa", "Nusa Dua Home Spa",
    "Private Massage Ubud", "Luxury Spa Delivery", "Professional Massage Bali"
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
    title: "Elexoir Home Spa | Premium Mobile Spa & In-Villa Massage Bali",
    description: "The most exclusive in-villa spa experience in Bali. Elevate your relaxation with our signature professional massages, couples treatments, and organic holistic rituals delivered to your door.",
    url: 'https://www.elexoirhomespaubud.com',
    siteName: 'Elexoir Home Spa Bali',
    images: [
      {
        url: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg',
        width: 1200,
        height: 630,
        alt: 'Elexoir Home Spa - Luxury Mobile Spa & Massage in Bali',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elexoir Home Spa | Luxury Mobile Spa & Massage in Bali',
    description: 'Experience premium mobile spa services directly to your villa in Ubud, Canggu, Seminyak, and Uluwatu. Book professional massages today.',
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
  '@type': ['HealthAndBeautyBusiness', 'DaySpa'],
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
    { '@type': 'City', name: 'Ubud' },
    { '@type': 'City', name: 'Canggu' },
    { '@type': 'City', name: 'Seminyak' },
    { '@type': 'City', name: 'Uluwatu' },
    { '@type': 'City', name: 'Sanur' },
    { '@type': 'City', name: 'Nusa Dua' },
    { '@type': 'City', name: 'Jimbaran' },
    { '@type': 'City', name: 'Kuta' }
  ],
  priceRange: "$$$",
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ],
    opens: '09:00',
    closes: '22:00'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '154',
    bestRating: '5',
    worstRating: '1'
  },
  sameAs: [
    'https://instagram.com/elexoirspa'
  ],
  description: 'Bali\'s premier mobile spa. 5-star professional massage treatments, deep tissue, and couples massages brought directly to your private villa or hotel in Ubud, Canggu, Seminyak, and beyond.'
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Luxury Mobile Massage and Home Spa Service',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Elexoir Home Spa',
    image: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg'
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: '-8.5069',
      longitude: '115.2625'
    },
    geoRadius: '50000'
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'IDR',
    lowPrice: '250000',
    highPrice: '1500000',
    offerCount: '20'
  }
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best home spa in Bali?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Elexoir Home Spa is highly rated as one of the best luxury mobile spas in Bali, offering 5-star professional treatments directly to your villa or hotel.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you provide massage in villas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we specialize in in-villa massages and home spa services across Bali, including Ubud, Canggu, Seminyak, and Uluwatu.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you offer couples massage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Our couples massage packages are perfect for honeymooners and partners wanting to relax together in the comfort of their own accommodation.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can therapists come to hotels?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, our certified professional therapists can provide mobile massage services directly to your hotel room or private villa.'
      }
    }
  ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
