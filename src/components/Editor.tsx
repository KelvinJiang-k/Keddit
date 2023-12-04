'use client'

import { FC, useCallback, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { zodResolver } from '@hookform/resolvers/zod'
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'

interface EditorProps {
  subkedditId: string
}

const Editor: FC<EditorProps> = ({ subkedditId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subkedditId,
      title: '',
      content: null,
    },
  })

  const ref = useRef<EditorJS>()
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const _titleRef = useRef<HTMLTextAreaElement>(null)

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [ref] = await uploadFiles([file], 'imageUploader')

                  return {
                    success: 1,
                    file: {
                      url: ref.fileUrl,
                    },
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    
  }, [errors])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        _titleRef.current?.focus()
      }, 0)
    }

    if (isMounted) {
      init()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const { ref: titleRef, ...rest } = register('title')

  return (
    <div className='w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200'>
      <form
        id='subkeddit-post-form'
        className='w-fit'
        onSubmit={handleSubmit((e) => {})}
      >
        <div className='prose prose-stone dark:prose-invert'>
          <TextareaAutosize
            ref={(e) => {
              titleRef(e)

              // @ts-ignore
              _titleRef.current = e
            }}
            placeholder='Title'
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
          />

          <div id='editor' className='min-h-[500px]' />
        </div>
      </form>
    </div>
  )
}

export default Editor
