import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const session = await getAuthSession()

  let followedCommunitesIds: string[] = []

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session?.user.id,
      },
      include: {
        subkeddit: true,
      },
    })

    followedCommunitesIds = followedCommunities.map(
      ({ subkeddit }) => subkeddit.id
    )
  }

  try {
    const { limit, page, subkedditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subkedditName: z.string(),
      })
      .parse({
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
        subkedditName: url.searchParams.get('subkedditName'),
      })

    let whereClause = {}

    if (subkedditName) {
      whereClause = {
        subkeddit: {
          name: subkedditName,
        },
      }
    } else if (session) {
      whereClause = {
        subkeddit: {
          id: {
            in: followedCommunitesIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subkeddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response('Could not fetch more posts', { status: 500 })
  }
}
