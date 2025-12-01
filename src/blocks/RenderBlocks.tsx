import React, { Fragment } from 'react'

// TODO: Uncomment these when blocks are added to a collection's BlocksFeature in the Payload config
// import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
// import { CallToActionBlock } from '@/blocks/CallToAction/Component'
// import { ContentBlock } from '@/blocks/Content/Component'

import { BannerBlock } from '@/blocks/Banner/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<string, React.ComponentType<any>> = {
  // TODO: Uncomment these when blocks are added to a collection's BlocksFeature in the Payload config
  // archive: ArchiveBlock,
  // cta: CallToActionBlock,
  // content: ContentBlock,
  banner: BannerBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  code: CodeBlock,
}

type Block = {
  blockType?: string
  [key: string]: unknown
}

export const RenderBlocks: React.FC<{
  blocks: Block[]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
