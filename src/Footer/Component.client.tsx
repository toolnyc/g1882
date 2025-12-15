'use client'

interface FooterClientWrapperProps {
  children: React.ReactNode
}

export const FooterClientWrapper: React.FC<FooterClientWrapperProps> = ({ children }) => {
  const gateEnabled = process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER_GATE === 'true'

  // Hide footer entirely when gate is active (it's CMS-controlled content)
  if (gateEnabled) {
    return null
  }

  return <>{children}</>
}
