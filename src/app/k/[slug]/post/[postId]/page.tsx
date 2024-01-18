import { redis } from '@/lib/redis'
import { CachedPost } from '@/types/redis'
import { FC } from 'react'

interface pageProps {
  params: {
    postId: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page = async ({ params }: pageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost

  return <div>page</div>
}

export default page
