import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the SERVICE ROLE KEY to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Insert into website_bookings
        const { data, error } = await supabaseAdmin.from('website_bookings').insert({
            customer_name: body.customer_name,
            date: body.date,
            time: body.time,
            location_area: body.location_area,
            address: body.address,
            room_number: body.room_number || '',
            treatments: body.treatments,
            total_price: body.total_price,
            requested_therapist_ids: body.requested_therapist_ids || [],
            status: 'pending'
        });

        if (error) {
            console.error('API Insert Error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (e: any) {
        console.error('API Server Error:', e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
