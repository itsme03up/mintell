'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    'https://bdmvozylkioolebbgcor.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbXZvenlsa2lvb2xlYmJnY29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMTQ3ODUsImV4cCI6MjA2MjY5MDc4NX0.cDK40708Nl9OwQ7BmaMlW2-x3sS6hAD5o2Kfny_04SM',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}