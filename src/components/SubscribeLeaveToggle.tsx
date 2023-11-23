'use client'

import { FC, startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscribeToSubkedditPayload } from '@/lib/validators/subkeddit'
import axios, { AxiosError } from 'axios'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SubscribeLeaveToggleProps {
  subkedditId: string
  isSubscribed: boolean
  subkedditName: string
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subkedditId,
  isSubscribed,
  subkedditName,
}) => {
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubkedditPayload = {
        subkedditId,
      }

      const { data } = await axios.post('/api/subkeddit/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }

        return toast({
          title: 'There was a problem',
          description: 'Something went wrong, please try again',
          variant: 'destructive',
        })
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })
      return toast({
        title: 'Subscribed',
        description: `You are now subscribed to k/${subkedditName}`,
      })
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubkedditPayload = {
        subkedditId,
      }

      const { data } = await axios.post('/api/subkeddit/unsubscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }

        return toast({
          title: 'There was a problem',
          description: 'Something went wrong, please try again',
          variant: 'destructive',
        })
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })
      return toast({
        title: 'Unsubscribed',
        description: `You are now unsubscribed to k/${subkedditName}`,
      })
    },
  })

  return isSubscribed ? (
    <Button
      onClick={() => unsubscribe()}
      isLoading={isUnsubLoading}
      className='w-full mt-1 mb-4'
    >
      Leave community
    </Button>
  ) : (
    <Button
      onClick={() => subscribe()}
      isLoading={isSubLoading}
      className='w-full mt-1 mb-4'
    >
      Join to post
    </Button>
  )
}

export default SubscribeLeaveToggle
