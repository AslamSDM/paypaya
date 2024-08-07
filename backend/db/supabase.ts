import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.join(__dirname, '../.env').toString() });

export const supabase = createClient(
  String(process.env.NEXT_PUBLIC_SUPABASE_URL),
  String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
);

