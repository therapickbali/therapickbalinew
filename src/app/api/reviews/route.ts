import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyBjSx_DiGeZHDUYxiP_jSUNdeJg3AFUZT0';
    const placeId = 'ChIJaUfu4AA90i0Ram4ReFIGUyM'; // Exlexoir Home Spa Ubud Place ID
    
    if (!apiKey) {
        return NextResponse.json({ error: 'Google Places API key is missing' }, { status: 500 });
    }

    try {
        const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating,userRatingCount&key=${apiKey}`, {
            next: { revalidate: 3600 } // Cache for 1 hour to avoid hitting API limits
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.status}`);
        }

        const data = await response.json();
        
        // Filter reviews to only include 4 and 5 star reviews, and format them
        const reviews = (data.reviews || [])
            .filter((review: any) => review.rating >= 4)
            .map((review: any) => ({
                id: review.name,
                authorName: review.authorAttribution.displayName,
                authorPhotoUri: review.authorAttribution.photoUri,
                rating: review.rating,
                text: review.originalText?.text || review.text?.text || '',
                relativePublishTimeDescription: review.relativePublishTimeDescription,
                publishTime: review.publishTime
            }));

        return NextResponse.json({
            rating: data.rating,
            userRatingCount: data.userRatingCount,
            reviews
        });
    } catch (error) {
        console.error('Error fetching Google Reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
