import api from '../api/axios'

interface UploadUrlResponseDTO {
  upload_url: string
  s3_url: string
}

async function getUploadUrl(propertyId: string, file: File, isPrimary: boolean): Promise<UploadUrlResponseDTO> {
  const { data } = await api.post<UploadUrlResponseDTO>(`/api/properties/${propertyId}/images`, {
    file_name: file.name,
    content_type: file.type,
    is_primary: isPrimary,
  })
  return data
}

async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
}

export { getUploadUrl, uploadToS3 }
