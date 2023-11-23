import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubkedditSubscriptioniValidator } from '@/lib/validators/subkeddit'
import { getSession } from 'next-auth/react'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { subkedditId } = SubkedditSubscriptioniValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subkedditId,
        userId: session.user.id,
      },
    })

    if (subscriptionExists) {
      return new Response('You are already subscribed to this subkeddit', {
        status: 400,
      })
    }

    await db.subscription.create({
      data: {
        subkedditId,
        userId: session.user.id,
      },
    })

    return new Response(subkedditId)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response('Could not subscribe, please try again later', {
      status: 500,
    })
  }
}
