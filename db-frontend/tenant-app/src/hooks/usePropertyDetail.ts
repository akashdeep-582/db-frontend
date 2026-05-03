import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getProperty } from '../services/property.service'
import { addToWishlist, removeFromWishlist, getWishlist } from '../services/wishlist.service'
import { requestVisit } from '../services/visit.service'
import type { RequestVisitPayload } from '../types/visit'

const INITIAL_VISIT_FORM = { requested_date: '', requested_time: '', message: '' }

export function usePropertyDetail(id: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [visitForm, setVisitForm] = useState(INITIAL_VISIT_FORM)
  const [visitSuccess, setVisitSuccess] = useState(false)

  const propertyQuery = useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id),
  })

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
  })

  const isWishlisted = wishlistQuery.data?.some(w => w.propertyId === id) ?? false

  const wishlistMutation = useMutation({
    mutationFn: () => isWishlisted ? removeFromWishlist(id) : addToWishlist(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const visitMutation = useMutation({
    mutationFn: (payload: RequestVisitPayload) => requestVisit(payload),
    onSuccess: () => {
      setVisitForm(INITIAL_VISIT_FORM)
      setVisitSuccess(true)
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
  })

  function handleVisitFormChange(key: keyof typeof INITIAL_VISIT_FORM, value: string) {
    setVisitForm(prev => ({ ...prev, [key]: value }))
    setVisitSuccess(false)
  }

  function handleVisitSubmit(e: React.FormEvent) {
    e.preventDefault()
    visitMutation.mutate({ property_id: id, ...visitForm })
  }

  return {
    property: propertyQuery.data,
    isLoading: propertyQuery.isLoading,
    error: propertyQuery.error,
    isWishlisted,
    toggleWishlist: () => wishlistMutation.mutate(),
    isWishlistPending: wishlistMutation.isPending,
    visitForm,
    handleVisitFormChange,
    handleVisitSubmit,
    isVisitPending: visitMutation.isPending,
    visitError: visitMutation.error,
    visitSuccess,
    goBack: () => navigate(-1),
  }
}
