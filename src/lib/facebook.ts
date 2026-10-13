export interface FacebookPost {
  id: string
  message?: string
  full_picture?: string
  created_time: string
  permalink_url: string
}

export async function getRecentFacebookPosts(limit: number = 4): Promise<FacebookPost[]> {
  const pageId = (
    process.env.FACEBOOK_PAGE_ID ||
    process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID ||
    ''
  )
    .replace(/[`'"]/g, '')
    .trim()

  const accessToken = (process.env.FACEBOOK_PAGE_TOKEN || '')
    .replace(/[`'"]/g, '')
    .trim()

  const baseUri = (
    process.env.FACEBOOK_PAGE_BASE_URI || 'https://graph.facebook.com/v22.0'
  )
    .replace(/[`'"]/g, '')
    .trim()

  if (!pageId || !accessToken) {
    console.error('Facebook API credentials missing')
    return []
  }

  try {
    const response = await fetch(
      `${baseUri}/${pageId}/feed?access_token=${accessToken}&fields=message,full_picture,created_time,permalink_url&limit=${limit}`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Facebook API Error:', errorData)
      return []
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Facebook posts:', error)
    return []
  }
}
