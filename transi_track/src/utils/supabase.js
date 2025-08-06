import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lulsuiwpxzxgbitdygce.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1bHN1aXdweHp4Z2JpdGR5Z2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDY1MTQsImV4cCI6MjA2OTQyMjUxNH0.3amkgtFi9-vq9CecqMhiretwCz8eAcnp3gz2JQQGxV8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);