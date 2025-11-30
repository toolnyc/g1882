'use client'

import React from 'react'
import { getCategoryTagClasses } from '@/utilities/getCategoryTagClasses'
import { cn } from '@/utilities/ui'

interface CategoryTagProps {
  category: string
  className?: string
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ category, className }) => {
  const { bgClass, textClass } = getCategoryTagClasses(category)

  return (
    <span
      className={cn(
        'inline-block px-2 py-1 border border-navy/10 rounded-tag text-sm font-semibold',
        bgClass,
        textClass,
        className,
      )}
    >
      {category}
    </span>
  )
}

