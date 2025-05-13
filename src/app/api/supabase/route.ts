import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  // initialize the SSR client exactly as in src/lib/supabase.ts
  const cookieStore = await cookies()
  const supabase = createServerClient(
    'https://bdmvozylkioolebbgcor.supabase.co',
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ignore when called from a Server Component
          }
        },
      },
    }
  )

  // run any query you need
  const { data, error } = await supabase
    .from('your_table')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
