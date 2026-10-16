// External
import { createClient } from '@supabase/supabase-js';

// The publishable key is public by design; row-level security protects the data.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

// PostgREST returns at most 1000 rows per request.
export const pageSize = 1000;
