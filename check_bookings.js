require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('website_bookings').select('*');
    if (error) {
        console.error("Error fetching:", error);
    } else {
        console.log("Bookings count:", data.length);
        console.log("Bookings:", data);
    }
}
check();
