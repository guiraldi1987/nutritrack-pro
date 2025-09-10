// Worker configuration types
declare global {
  interface Env {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_SUPABASE_SERVICE_ROLE_KEY?: string;
    MOCHA_USERS_SERVICE_API_URL?: string;
    MOCHA_USERS_SERVICE_API_KEY?: string;
    DB?: D1Database;
  }
}

export {};