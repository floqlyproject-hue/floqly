import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Create a Supabase client for use in the browser
 */
export function createBrowserClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Create a Supabase client for use on the server
 * Uses service role key for admin operations
 */
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Default client export (browser-safe)
 */
export function createClient() {
  return createBrowserClient()
}
