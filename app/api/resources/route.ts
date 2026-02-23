import { NextRequest, NextResponse } from 'next/server'
import { getResources } from '@/lib/resources'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const filters = {
      categories: searchParams.get('categories')?.split(',') as any[] | undefined,
      search: searchParams.get('search') || undefined,
      city: searchParams.get('city') || undefined,
      verified: searchParams.get('verified') === 'true' ? true : undefined,
    }

    const resources = await getResources(filters)

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error in resources API:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}
