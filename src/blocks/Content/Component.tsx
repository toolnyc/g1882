// TODO: This block is currently commented out because it's not registered in any collection.
// To enable it, add the Content block from '@/blocks/Content/config' to a collection's
// BlocksFeature in the Payload config, then uncomment this file and the import in RenderBlocks.tsx

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

// TODO: Uncomment when block is registered in Payload config
// import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink, type CMSLinkType } from '../../components/Link'

// Temporary interface until the block is registered
interface ContentBlockProps {
  columns?: Array<{
    enableLink?: boolean
    link?: CMSLinkType
    richText?: DefaultTypedEditorState
    size?: 'full' | 'half' | 'oneThird' | 'twoThirds'
  }>
}

// Temporarily exporting to avoid unused file warnings
export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
