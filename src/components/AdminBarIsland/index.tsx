import { draftMode } from 'next/headers'
import { getAuthStatus } from '@/utilities/getAuthStatus'
import { AdminBar } from '@/components/AdminBar'

export async function AdminBarIsland() {
  const { isEnabled } = await draftMode()
  const { isAuthenticated } = await getAuthStatus()

  if (!isEnabled && !isAuthenticated) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <AdminBar adminBarProps={{ preview: isEnabled }} />
    </div>
  )
}
