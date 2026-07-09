const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('therapists').select('id, latitude, longitude').limit(1);
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("Data:", data);
    }
}
check();
