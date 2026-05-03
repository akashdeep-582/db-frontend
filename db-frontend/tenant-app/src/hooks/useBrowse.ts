import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listProperties } from '../services/property.service'
import type { BrowseFilters } from '../types/property'

const INITIAL_FILTERS: BrowseFilters = {
  city: '',
  type: '',
  furnished: '',
  min_price: '',
  max_price: '',
}

export function useBrowse() {
  const [filters, setFilters] = useState<BrowseFilters>(INITIAL_FILTERS)
  const [applied, setApplied] = useState<BrowseFilters>(INITIAL_FILTERS)

  const query = useQuery({
    queryKey: ['properties', applied],
    queryFn: () => listProperties(applied),
  })

  function handleFilterChange(key: keyof BrowseFilters, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function applyFilters() {
    setApplied(filters)
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS)
    setApplied(INITIAL_FILTERS)
  }

  return {
    properties: query.data,
    isLoading: query.isLoading,
    error: query.error,
    filters,
    handleFilterChange,
    applyFilters,
    clearFilters,
  }
}
