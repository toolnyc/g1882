'use client'

import Link from 'next/link'
import React from 'react'

import './index.scss'

const baseClass = 'back-to-site'

export const BackToSite: React.FC = () => {
  return (
    <Link href="/" className={baseClass}>
      <svg
        className={`${baseClass}__icon`}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6.5 12.5L2 8m0 0l4.5-4.5M2 8h12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back to the site
    </Link>
  )
}

export default BackToSite
