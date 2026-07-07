import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://esioxxiawkawtpphexzf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_9ocb1uxMjlwg2lyloeIU9Q_jP6uumqJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
