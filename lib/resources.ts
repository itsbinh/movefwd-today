import { supabase } from './supabase'
import type { Resource, ResourceFilters, Category } from '@/types/resources'

export async function getResources(filters?: ResourceFilters): Promise<Resource[]> {
  let query = (supabase.from('resources' as never) as any)
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.categories && filters.categories.length > 0) {
    query = query.contains('categories', filters.categories)
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.city) {
    query = query.eq('city', filters.city)
  }

  if (filters?.zip) {
    query = query.eq('zip', filters.zip)
  }

  if (filters?.verified !== undefined) {
    query = query.eq('verified', filters.verified)
  }

  const { data, error } = await query

  if (error) {
    return []
  }

  return (data || []) as Resource[]
}

export async function getResourceById(id: string): Promise<Resource | null> {
  const { data, error } = await (supabase.from('resources' as never) as any)
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return null
  }

  return data as Resource
}

export async function getCities(): Promise<string[]> {
  const { data, error } = await (supabase.from('resources' as never) as any)
    .select('city')
    .not('city', 'is', null)
    .order('city')

  if (error) {
    return []
  }

  const citySet = new Set((data ?? []).map((r: { city: string | null }) => r.city).filter(Boolean))
  return Array.from(citySet) as string[]
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await (supabase.from('resources' as never) as any).select('categories')

  if (error) {
    return []
  }

  const allCategories = (data ?? []).flatMap((r: { categories: Category[] }) => r.categories)
  return Array.from(new Set(allCategories)) as Category[]
}
