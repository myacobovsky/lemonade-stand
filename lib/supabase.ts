// @ts-nocheck
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tddckukchlntmpjcespb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkZGNrdWtjaGxudG1wamNlc3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODY3OTIsImV4cCI6MjA4ODY2Mjc5Mn0.ZgjvF0InNJ7aJigWwLhzOfYD0_XGZROXXclnOwv7EvE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
