import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

export const Icon = (props: Props) => {
  const { className } = props

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Gallery 1882"
      width={24}
      height={24}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      className={clsx('w-6 h-6', className)}
      src="/Icon-Navy-Flat.png"
    />
  )
}
