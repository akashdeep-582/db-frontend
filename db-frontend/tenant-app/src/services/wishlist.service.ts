import api from '../api/axios'
import type { WishlistItem } from '../types/wishlist'

interface WishlistItemDTO {
  id: string
  property_id: string
  title: string
  city: string
  locality: string
  price: number
  type: string
  furnished: string
  primary_image: string | null
  created_at: string
}

interface GetWishlistResponseDTO {
  wishlists: WishlistItemDTO[]
  count: number
}

function mapWishlistItem(dto: WishlistItemDTO): WishlistItem {
  return {
    id: dto.id,
    propertyId: dto.property_id,
    title: dto.title,
    city: dto.city,
    locality: dto.locality,
    price: dto.price,
    type: dto.type,
    furnished: dto.furnished,
    primaryImage: dto.primary_image,
    createdAt: dto.created_at,
  }
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const { data } = await api.get<GetWishlistResponseDTO>('/api/wishlists')
  return (data.wishlists ?? []).map(mapWishlistItem)
}

export async function addToWishlist(propertyId: string): Promise<void> {
  await api.post('/api/wishlists', { property_id: propertyId })
}

export async function removeFromWishlist(propertyId: string): Promise<void> {
  await api.delete(`/api/wishlists/${propertyId}`)
}
