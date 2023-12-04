import { z } from 'zod'

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be longer than 3 characters' })
    .max(128, { message: 'Title cannot be greater then 128 characters' }),
  subkedditId: z.string(),
  content: z.any(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>
