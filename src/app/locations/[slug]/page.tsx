import { Metadata } from 'next';
import LocationClient from '@/components/LocationClient';

type Props = {
    params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const locationName = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: "Therapick Dubai | Choose Available Therapists in Your Area",
        description: `Premium home massage and mobile spa services in ${locationName}, Dubai. Therapick allows you to book professional, available massage therapists directly to your villa, hotel, or home in ${locationName}.`,
        keywords: [`Home Massage ${locationName}`, `Home Spa ${locationName}`, `Mobile Massage ${locationName}`, `Mobile Spa ${locationName}`, `In-Villa Massage ${locationName}`, `Massage Delivery ${locationName}`, `Dubai Home Massage`, `Dubai Home Spa`, `${locationName} Massage Therapist`],
        openGraph: {
            title: "Therapick Dubai | Choose Available Therapists in Your Area",
            description: `Premium home massage and mobile spa services in ${locationName}, Dubai. Book available professional therapists directly to your villa or hotel.`,
            url: `https://therapickdubai.vercel.app/locations/${slug}`,
        },
        alternates: {
            canonical: `https://therapickdubai.vercel.app/locations/${slug}`,
        }
    };
}

export function generateStaticParams() {
    return [
        { slug: 'downtown-dubai' },
        { slug: 'dubai-marina' },
        { slug: 'jumeirah' },
        { slug: 'al-barsha' },
        { slug: 'difc' },
        { slug: 'palm-jumeirah' },
        { slug: 'business-bay' },
        { slug: 'dubai-creek' },
        { slug: 'jlt' },
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
        name: 'Therapick Dubai',
        image: 'https://therapickdubai.vercel.app/logo.png',
        '@id': `https://therapickdubai.vercel.app/locations/${slug}`,
        url: `https://therapickdubai.vercel.app/locations/${slug}`,
        telephone: '+6285174119423',
        areaServed: { '@type': 'City', name: locationName },
        description: `Premium home massage and mobile spa services in ${locationName}, Dubai.`
    };
    
    const serviceJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: `Mobile Massage and In-Villa Spa Service in ${locationName}`,
        provider: {
            '@type': 'LocalBusiness',
            name: 'Therapick Dubai',
            image: 'https://therapickdubai.vercel.app/logo.png'
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
