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
  metadataBase: new URL('https://therapickdubai.vercel.app'),
  applicationName: 'Book Therapick',
  appleWebApp: {
    title: 'Book Therapick',
  },
  title: {
    default: "Therapick Dubai | Choose Available Therapists in Your Area",
    template: "%s | Therapick Dubai"
  },
  description: "Find and book available professional massage therapists in your area on-demand. Browse therapist profiles, check availability, and book your premium home spa experience in Dubai today.",
  keywords: [
    "Therapick Dubai", "Home Massage Dubai", "Home Spa Dubai", "Dubai Home Massage", 
    "Dubai Home Spa", "Mobile Massage Dubai", "Mobile Spa Dubai", "In-Villa Massage Dubai",
    "Hotel Massage Dubai", "Villa Spa Service Dubai", "Massage Delivery Dubai",
    "Home Massage Downtown Dubai", "Home Spa Downtown Dubai", "Home Massage Dubai Marina", "Home Spa Dubai Marina",
    "Home Massage Jumeirah", "Home Massage Al Barsha", "Home Massage DIFC", 
    "Home Massage Palm Jumeirah", "Home Massage Business Bay", "Home Massage Dubai Creek",
    "Home Massage JLT", "Home Massage Kerobokan", "Home Massage Pererenan",
    "Home Massage Berawa", "Home Massage Bingin", "Home Massage Pecatu",
    "Choose Massage Therapist Dubai", "Book Available Therapist Dubai", "Massage near me Dubai"
  ],
  authors: [{ name: "Therapick Dubai" }],
  creator: "Therapick Dubai",
  publisher: "Therapick Dubai",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Therapick Dubai | Choose Available Therapists in Your Area",
    description: "Find and book available professional massage therapists in your area on-demand. Browse therapist profiles, check availability, and book your premium home spa experience in Dubai.",
    url: 'https://therapickdubai.vercel.app',
    siteName: 'Book Therapick',
    images: [
      {
        url: 'https://therapickdubai.vercel.app/logo.png',
        width: 1200,
        height: 630,
        alt: 'Therapick Dubai - Find Massage Therapists',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Therapick Dubai | Choose Available Therapists in Your Area',
    description: 'Find and book available professional massage therapists in your area on-demand. Browse therapist profiles and check availability.',
    images: ['https://therapickdubai.vercel.app/logo.png'],
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
    'geo.placename': 'Dubai',
    'geo.position': '-8.4095;115.1889',
    'ICBM': '-8.4095, 115.1889',
  }
};

export const viewport: Viewport = {
  themeColor: "#111111",
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
  const name = "Book Therapick";
  const url = "https://therapickdubai.vercel.app";
  
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Book Therapick',
    url: 'https://therapickdubai.vercel.app',
  };
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['HealthAndBeautyBusiness', 'DaySpa'],
    name: name,
    image: 'https://therapickdubai.vercel.app/logo.png',
    '@id': url,
    url: url,
    telephone: '+6285174119423',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Sri Wedari, Downtown Dubai',
      addressLocality: 'Gianyar',
      addressRegion: 'Dubai',
      postalCode: '80571',
      addressCountry: 'ID'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -8.5069,
      longitude: 115.2625
    },
    areaServed: [
      { '@type': 'City', name: 'Downtown Dubai' },
      { '@type': 'City', name: 'Dubai Marina' },
      { '@type': 'City', name: 'Jumeirah' },
      { '@type': 'City', name: 'Palm Jumeirah' },
      { '@type': 'City', name: 'DIFC' },
      { '@type': 'City', name: 'Business Bay' },
      { '@type': 'City', name: 'Dubai Creek' },
      { '@type': 'City', name: 'Al Barsha' },
      { '@type': 'City', name: 'JLT' }
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
      'https://instagram.com/therapickdubai'
    ],
    description: 'Find and book available professional massage therapists in your area on-demand. Browse therapist profiles, check availability, and book your premium home spa experience in Dubai.'
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Luxury Mobile Massage and In-Villa Spa Service',
    provider: {
      '@type': 'LocalBusiness',
      name: name,
      image: 'https://therapickdubai.vercel.app/logo.png'
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
      priceCurrency: 'AED',
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
        name: 'What is the best home spa in Dubai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${name} is highly rated as one of the best luxury mobile spas in Dubai, offering 5-star professional treatments directly to your villa or hotel.`
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide massage in villas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we specialize in in-villa massages and home spa services across Dubai, allowing you to choose available therapists in your specific area.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I get a massage delivered to my hotel or villa in Dubai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Therapick provides premium massage delivery and mobile spa services directly to your hotel, villa, or home in Dubai Marina, Jumeirah, Downtown Dubai, Palm Jumeirah, and other major areas in Dubai.'
        }
      },
      {
        '@type': 'Question',
        name: 'What types of mobile massage services do you offer in Dubai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer Traditional Dubainese Massage, Deep Tissue therapies, couples massage packages, and facial treatments all brought to your location by professional therapists.'
        }
      }
    ]
  };

  return (
    <html lang="en" className="antialiased scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
