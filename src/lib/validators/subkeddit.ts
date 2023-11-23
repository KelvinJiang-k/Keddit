import { z } from 'zod'

export const SubkedditValidator = z.object({
  name: z.string().min(3).max(21),
})

export const SubkedditSubscriptioniValidator = z.object({
  subkedditId: z.string(),
})

export type CreateSubkedditPayload = z.infer<typeof SubkedditValidator>
export type SubscribeToSubkedditPayload = z.infer<
  typeof SubkedditSubscriptioniValidator
>
