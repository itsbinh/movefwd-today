import { supabase } from './supabase'
import type { Resource, ResourceFilters, Category } from '@/types/resources'

export async function getResources(filters?: ResourceFilters): Promise<Resource[]> {
  let query = supabase.from('resources').select('*').order('created_at', { ascending: false })

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
    console.error('Error fetching resources:', error)
    return []
  }

  return data || []
}

export async function getResourceById(id: string): Promise<Resource | null> {
  const { data, error } = await supabase.from('resources').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching resource:', error)
    return null
  }

  return data
}

export async function getCities(): Promise<string[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('city')
    .not('city', 'is', null)
    .order('city')

  if (error) {
    console.error('Error fetching cities:', error)
    return []
  }

  const citySet = new Set(data?.map((r) => r.city).filter(Boolean))
  const cities = Array.from(citySet)
  return cities as string[]
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('resources').select('categories')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  const allCategories = data?.flatMap((r) => r.categories) || []
  const categorySet = new Set(allCategories)
  const uniqueCategories = Array.from(categorySet) as Category[]
  return uniqueCategories
}
