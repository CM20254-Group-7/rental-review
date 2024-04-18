import { createEnv } from "@t3-oss/env-nextjs";
import { defaultIfDev } from "./helpers";
import { z } from "zod";

// Environment variables required to access the Supabase client
const supabaseClientEnv = createEnv({
  server: {
    SUPABASE_SERVICE_KEY: defaultIfDev(
      z.string().min(1),
      'http://127.0.0.1:54321',
    ),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: defaultIfDev(
      z.string().url(),
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: defaultIfDev(
      z.string().min(1),
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
    ),
  },
  runtimeEnv: {
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});

export default supabaseClientEnv;
