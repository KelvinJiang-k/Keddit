import { Comment, Post, Subkeddit, User, Vote } from '@prisma/client'

export type ExtendedPost = Post & {
    subkeddit: Subkeddit,
    votes: Vote[],
    author: User,
    comments: Comment[]
}