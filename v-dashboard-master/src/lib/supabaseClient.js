import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://kmddfivfxugfgdtneigj.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZGRmaXZmeHVnZmdkdG5laWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyOTExNzYsImV4cCI6MjA0Njg2NzE3Nn0.ytzvLbVWFaR9qG3NYA0tavBRifsEvsgKVy7DxCPXWRc'; 
export const supabase = createClient(supabaseUrl, supabaseKey);