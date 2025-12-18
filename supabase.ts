import { createClient } from '@supabase/supabase-js';

// Access environment variables safely using optional chaining
// Casting import.meta to any prevents "Property 'env' does not exist on type 'ImportMeta'" error
const env = (import.meta as any).env;

const supabaseUrl = env?.VITE_SUPABASE_URL;
const supabaseKey = env?.VITE_SUPABASE_ANON_KEY;

// Create client only if keys are available
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;