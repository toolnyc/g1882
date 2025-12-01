// TODO: This block is currently commented out because it's not registered in any collection.
// To enable it, add the Archive block from '@/blocks/ArchiveBlock/config' to a collection's
// BlocksFeature in the Payload config, then uncomment this file and the import in RenderBlocks.tsx

import type { Post, Category } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import type { CardPostData } from '@/components/Card'

interface ArchiveBlockProps {
  id?: string
  introContent?: {
    root: {
      type: string
      children: {
        type: unknown
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  }
  populateBy?: 'collection' | 'selection'
  relationTo?: 'posts'
  categories?: (string | Category)[] | null
  limit?: number | null
  selectedDocs?: {
    relationTo: 'posts'
    value: string | Post
  }[] | null
}

// Temporarily exporting a placeholder to avoid unused file warnings
export const ArchiveBlock: React.FC<ArchiveBlockProps> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let posts: CardPostData[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      select: {
        slug: true,
        categories: true,
        meta: true,
        title: true,
      },
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs as unknown as CardPostData[]
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as unknown as CardPostData[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent as never} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  )
}
