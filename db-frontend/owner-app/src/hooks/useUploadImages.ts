import { useState } from 'react'
import { getUploadUrl, uploadToS3 } from '../services/image.service'

export function useUploadImages() {
  const [isUploading, setIsUploading] = useState(false)

  async function uploadImages(propertyId: string, files: File[]): Promise<void> {
    if (files.length === 0) return
    setIsUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const { upload_url } = await getUploadUrl(propertyId, files[i], i === 0)
        await uploadToS3(upload_url, files[i])
      }
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadImages, isUploading }
}
