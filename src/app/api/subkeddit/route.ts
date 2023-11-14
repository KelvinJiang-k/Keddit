import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubkedditValidator } from '@/lib/validators/subkeddit'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = SubkedditValidator.parse(body)

    const subkedditExists = await db.subkeddit.findFirst({
      where: {
        name,
      },
    })

    if (subkedditExists) {
      return new Response('Subkeddit already exists', { status: 409 })
    }

    const subkeddit = await db.subkeddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    })

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subkedditId: subkeddit.id,
      },
    })

    return new Response(subkeddit.name)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not create subkeddit', { status: 500 })
  }
}
