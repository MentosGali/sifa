import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rprtzkowfnpcvowswhhb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwcnR6a293Zm5wY3Zvd3N3aGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NDAzMDgsImV4cCI6MjA4ODUxNjMwOH0.V58U3Mva5Sp4uwi5D0DMm9AC_9JnbDquS0YJy7QRrdo";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan variables de entorno de Supabase: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
