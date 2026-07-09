import { Metadata } from 'next';
import LocationClient from '@/components/LocationClient';

type Props = {
    params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const locationName = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: "Therapick Bali | Choose Available Therapists in Your Area",
        description: `Premium home massage and mobile spa services in ${locationName}, Bali. Therapick allows you to book professional, available massage therapists directly to your villa, hotel, or home in ${locationName}.`,
        keywords: [`Home Massage ${locationName}`, `Home Spa ${locationName}`, `Mobile Massage ${locationName}`, `Mobile Spa ${locationName}`, `In-Villa Massage ${locationName}`, `Massage Delivery ${locationName}`, `Bali Home Massage`, `Bali Home Spa`, `${locationName} Massage Therapist`],
        openGraph: {
            title: "Therapick Bali | Choose Available Therapists in Your Area",
            description: `Premium home massage and mobile spa services in ${locationName}, Bali. Book available professional therapists directly to your villa or hotel.`,
            url: `https://therapickbali.vercel.app/locations/${slug}`,
        },
        alternates: {
            canonical: `https://therapickbali.vercel.app/locations/${slug}`,
        }
    };
}

export function generateStaticParams() {
    return [
        { slug: 'ubud' },
        { slug: 'canggu' },
        { slug: 'seminyak' },
        { slug: 'kuta' },
        { slug: 'sanur' },
        { slug: 'uluwatu' },
        { slug: 'nusa-dua' },
        { slug: 'jimbaran' },
        { slug: 'legian' },
        { slug: 'kerobokan' },
        { slug: 'pererenan' },
        { slug: 'berawa' },
        { slug: 'bingin' },
        { slug: 'pecatu' },
    ];
}

export default async function LocationPage({ params }: Props) {
    const { slug } = await params;
    const locationName = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': ['HealthAndBeautyBusiness', 'DaySpa'],
        name: 'Therapick Bali',
        image: 'https://therapickbali.vercel.app/logo.png',
        '@id': `https://therapickbali.vercel.app/locations/${slug}`,
        url: `https://therapickbali.vercel.app/locations/${slug}`,
        telephone: '+6285174119423',
        areaServed: { '@type': 'City', name: locationName },
        description: `Premium home massage and mobile spa services in ${locationName}, Bali.`
    };
    
    const serviceJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: `Mobile Massage and In-Villa Spa Service in ${locationName}`,
        provider: {
            '@type': 'LocalBusiness',
            name: 'Therapick Bali',
            image: 'https://therapickbali.vercel.app/logo.png'
        },
        areaServed: { '@type': 'City', name: locationName }
    };
    
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
            />
            <LocationClient locationName={locationName} locationSlug={slug} />
        </>
    );
}
