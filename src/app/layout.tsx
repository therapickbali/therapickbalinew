import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { SpaProvider } from "@/context/SpaContext";
import PwaInit from "@/components/PwaInit";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://therapickbali.vercel.app'),
  title: {
    default: "Therapick Bali | Choose Available Therapists in Your Area",
    template: "%s | Therapick Bali"
  },
  description: "Find and book available professional massage therapists in your area on-demand. Browse therapist profiles, check availability, and book your premium home spa experience in Bali today.",
  keywords: [
    "Therapick Bali", "Choose Massage Therapist Bali", "Book Available Therapist Bali", 
    "On-Demand Massage Bali", "Mobile Spa Bali", "In Villa Massage Bali", 
    "Bali Therapist Booking", "Professional Massage Bali", "Ubud Massage Therapist", 
    "Canggu Massage Therapist", "Seminyak Massage Therapist", "Massage near me Bali"
  ],
  authors: [{ name: "Therapick Bali" }],
  creator: "Therapick Bali",
  publisher: "Therapick Bali",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Therapick Bali | Choose Available Therapists in Your Area",
    description: "Find and book available professional massage therapists in your area on-demand. Browse therapist profiles, check availability, and book your premium home spa experience in Bali.",
    url: 'https://therapickbali.vercel.app',
    siteName: 'Therapick Bali',
    images: [
      {
        url: 'https://therapickbali.vercel.app/logo.png',
        width: 1200,
        height: 630,
        alt: 'Therapick Bali - Find Massage Therapists',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Therapick Bali | Choose Available Therapists in Your Area',
    description: 'Find and book available professional massage therapists in your area on-demand. Browse therapist profiles and check availability.',
    images: ['https://therapickbali.vercel.app/logo.png'],
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

export const viewport: Viewport = {
  themeColor: "#D2F34C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const name = "Therapick Bali";
  const url = "https://therapickbali.vercel.app";
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['HealthAndBeautyBusiness', 'DaySpa'],
    name: name,
    image: 'https://therapickbali.vercel.app/logo.png',
    '@id': url,
    url: url,
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
      { '@type': 'City', name: 'Kuta' },
      { '@type': 'City', name: 'Legian' }
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
      'https://instagram.com/therapickbali'
    ],
    description: 'Find and book available professional massage therapists in your area on-demand. Browse therapist profiles, check availability, and book your premium home spa experience in Bali.'
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Luxury Mobile Massage and In-Villa Spa Service',
    provider: {
      '@type': 'LocalBusiness',
      name: name,
      image: 'https://therapickbali.vercel.app/logo.png'
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
          text: `${name} is highly rated as one of the best luxury mobile spas in Bali, offering 5-star professional treatments directly to your villa or hotel.`
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide massage in villas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we specialize in in-villa massages and home spa services across Bali, allowing you to choose available therapists in your specific area.'
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
          text: 'Yes, our certified professional therapists can provide mobile massage services directly to your hotel room or private villa with instant confirmation.'
        }
      }
    ]
  };

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
        data-domain="therapick"
        className={`${jakarta.variable} ${newsreader.variable} font-sans bg-transparent text-white/90 min-h-screen selection:bg-white selection:text-white pb-20`}
      >
        <PwaInit />
        <SpaProvider>
          <TopNav />
          <main className="w-full relative min-h-[100dvh] bg-black overflow-x-hidden">
              {children}
          </main>
        </SpaProvider>
      </body>
    </html>
  );
}
