// TODO: This block is currently commented out because it's not registered in any collection.
// To enable it, add the CallToAction block from '@/blocks/CallToAction/config' to a collection's
// BlocksFeature in the Payload config, then uncomment this file and the import in RenderBlocks.tsx

import React from 'react'

// TODO: Uncomment when block is registered in Payload config
// import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

// Temporary interface until the block is registered
/* eslint-disable @typescript-eslint/no-explicit-any */
interface CTABlockProps {
  links?: { link: any }[]
  richText?: any
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Temporarily exporting to avoid unused file warnings
export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
    </div>
  )
}
