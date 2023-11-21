import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import MiniCreatePost from '@/components/MiniCreatePost'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
  const { slug } = params

  const session = await getAuthSession()

  const subkeddit = await db.subkeddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subkeddit: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  })

  if (!subkeddit) {
    return notFound()
  }

  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl h-14 tracking-wide'>
        k/{subkeddit.name}
      </h1>
      <MiniCreatePost session={session} />
    </>
  )
}

export default page
