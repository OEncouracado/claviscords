import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores do seu projeto Supabase
const SUPABASE_URL = 'https://zdxbrfbubdidfadjumbk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkeGJyZmJ1YmRpZGZhZGp1bWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDg4NDksImV4cCI6MjA2MDQ4NDg0OX0.kngpfd9u1_qKmecNOkmHZ8xkUK6my4g1VKM8NMEPJug';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;