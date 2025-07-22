import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ivfxyqyewgtshiyvpftj.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Znh5cXlld2d0c2hpeXZwZnRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNzMzODQsImV4cCI6MjA2ODc0OTM4NH0.PcVuJOYh3DD2xcEzin8G6C8VNF0jcEiFbDOOto8GKlI';

export const supabase = createClient(supabaseUrl, supabaseKey);
