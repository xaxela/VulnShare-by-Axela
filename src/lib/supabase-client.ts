import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bgaegiekpbcvddbktxle.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnYWVnaWVrcGJjdmRkYmt0eGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDU5NjcsImV4cCI6MjA2ODY4MTk2N30.wPL_GWeoKMgdThmE3nUoGqu_Ifh82LHgO2ctzzL1io0';

export const supabase = createClient(supabaseUrl, supabaseKey);
