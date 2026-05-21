import type { PayloadRequest } from 'payload'

type JobAccessRequest = Pick<PayloadRequest, 'headers' | 'user'>

export function canRunPayloadJobs(req: JobAccessRequest): boolean {
  if (req.user) return true

  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false

  return req.headers.get('authorization') === `Bearer ${cronSecret}`
}
