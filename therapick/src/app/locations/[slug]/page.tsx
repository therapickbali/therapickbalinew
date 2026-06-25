import { Metadata } from 'next';
import LocationClient from '@/components/LocationClient';

type Props = {
    params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const locationName = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `Home Spa ${locationName} | Luxury Mobile Massage Delivery`,
        description: `Looking for the best home spa in ${locationName}? Therapick delivers premium professional massages and luxury spa treatments directly to your villa or hotel in ${locationName}, Bali.`,
        openGraph: {
            title: `Therapick Home Spa ${locationName} | Mobile Massage`,
            description: `Experience the ultimate luxury mobile spa in ${locationName}, Bali. Book our signature professional massages to your private villa today.`,
            url: `https://www.therapickhomespaubud.com/locations/${slug}`,
        },
        alternates: {
            canonical: `https://www.therapickhomespaubud.com/locations/${slug}`,
        }
    };
}

export function generateStaticParams() {
    return [
        { slug: 'ubud' },
        { slug: 'canggu' },
        { slug: 'seminyak' },
        { slug: 'uluwatu' },
        { slug: 'sanur' },
        { slug: 'nusa-dua' },
        { slug: 'jimbaran' },
        { slug: 'kuta' },
    ];
}

export default async function LocationPage({ params }: Props) {
    const { slug } = await params;
    const locationName = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    return <LocationClient locationName={locationName} locationSlug={slug} />;
}
