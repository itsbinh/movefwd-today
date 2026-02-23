'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'movefwd_favorites'

interface UseFavoritesReturn {
  favorites: Set<string>
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  clearFavorites: () => void
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setFavorites(new Set(parsed))
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error)
    }
  }, [])

  // Save favorites to localStorage whenever they change
  const saveToStorage = useCallback((newFavorites: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newFavorites)))
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error)
    }
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.has(id),
    [favorites]
  )

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const newFavorites = new Set(prev)
        if (newFavorites.has(id)) {
          newFavorites.delete(id)
        } else {
          newFavorites.add(id)
        }
        saveToStorage(newFavorites)
        return newFavorites
      })
    },
    [saveToStorage]
  )

  const clearFavorites = useCallback(() => {
    setFavorites(new Set())
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear favorites from localStorage:', error)
    }
  }, [])

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  }
}
