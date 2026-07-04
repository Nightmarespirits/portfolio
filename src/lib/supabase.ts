import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const storageBucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'portfolio-assets';

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    })
    : null;

export function getStoragePublicUrl(path: string | null | undefined) {
    if (!supabase || !path) {
        return null;
    }

    const { data } = supabase.storage.from(storageBucket).getPublicUrl(path);
    return data.publicUrl || null;
}
