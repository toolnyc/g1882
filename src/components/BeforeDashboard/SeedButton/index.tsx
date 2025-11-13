'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{' '}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Database already seeded.')
        return
      }
      if (loading) {
        toast.info('Seeding already in progress.')
        return
      }
      if (error) {
        toast.error(`An error occurred, please refresh and try again.`)
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed', { method: 'POST', credentials: 'include' })
                .then(async (res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                  } else {
                    // Try to parse JSON error response
                    let errorMessage = 'An error occurred while seeding.'
                    try {
                      const errorData = await res.json()
                      if (errorData.errors && Array.isArray(errorData.errors)) {
                        // Format validation errors
                        const errorMessages = errorData.errors
                          .map((err: { message?: string; path?: string }) => {
                            if (err.path && err.message) {
                              return `${err.path}: ${err.message}`
                            }
                            return err.message || 'Validation error'
                          })
                          .join('; ')
                        errorMessage = `Validation errors: ${errorMessages}`
                      } else if (errorData.message) {
                        errorMessage = errorData.message
                      }
                    } catch {
                      // If JSON parsing fails, use default message
                    }
                    reject(errorMessage)
                  }
                })
                .catch((error) => {
                  reject(error instanceof Error ? error.message : String(error))
                })
            } catch (error) {
              reject(error instanceof Error ? error.message : String(error))
            }
          }),
          {
            loading: 'Seeding with data....',
            success: <SuccessMessage />,
            error: (error) => (typeof error === 'string' ? error : 'An error occurred while seeding.'),
          },
        )
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setError(error)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Seed your database
      </button>
      {message}
    </Fragment>
  )
}
