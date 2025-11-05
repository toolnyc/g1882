'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface DirectoryItem {
  id: string
  name: string
  [key: string]: any
}

interface DirectoryListingProps {
  items: DirectoryItem[]
  title: string
  groupBy: 'alphabetical' | 'chronological'
  getGroupKey: (item: DirectoryItem) => string
  getDisplayName: (item: DirectoryItem) => string
  getSubtitle?: (item: DirectoryItem) => string
  className?: string
  banner?: React.ReactNode
}

export const DirectoryListing: React.FC<DirectoryListingProps> = ({
  items,
  title,
  groupBy,
  getGroupKey,
  getDisplayName,
  getSubtitle,
  className = '',
  banner,
}) => {
  const [activeGroup, setActiveGroup] = useState<string>('')
  const [groupRefs, setGroupRefs] = useState<{ [key: string]: HTMLDivElement | null }>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // Group items by the specified key
  const groupedItems = items.reduce(
    (groups, item) => {
      const key = getGroupKey(item)
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
      return groups
    },
    {} as { [key: string]: DirectoryItem[] },
  )

  // Sort groups and items within groups
  const sortedGroups = Object.keys(groupedItems).sort((a, b) => {
    if (groupBy === 'alphabetical') {
      return a.localeCompare(b)
    } else {
      // For chronological, we want newest first (reverse order)
      return b.localeCompare(a)
    }
  })

  // Sort items within each group
  sortedGroups.forEach((groupKey) => {
    groupedItems[groupKey].sort((a, b) => {
      if (groupBy === 'alphabetical') {
        return getDisplayName(a).localeCompare(getDisplayName(b))
      } else {
        // For chronological, sort by date (newest first)
        return (
          new Date(b.startDate || b.date || '').getTime() -
          new Date(a.startDate || a.date || '').getTime()
        )
      }
    })
  })

  // Set up intersection observer to track which group is currently visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const groupKey = entry.target.getAttribute('data-group-key')
            if (groupKey) {
              setActiveGroup(groupKey)
            }
          }
        })
      },
      {
        root: containerRef.current,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.1,
      },
    )

    Object.values(groupRefs).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [groupRefs])

  const setGroupRef = (groupKey: string) => (ref: HTMLDivElement | null) => {
    setGroupRefs((prev) => ({ ...prev, [groupKey]: ref }))
  }

  return (
    <section className={`py-32 mt-12 gallery-section ${className}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="mb-20">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-navy border-b-4 border-bright-lake pb-4">
              {title}
            </h1>
          </div>

          {/* Banner */}
          {banner && <div className="mb-16">{banner}</div>}

          <div className="flex w-full" ref={containerRef}>
            {/* Side Tracker */}
            <div className="w-16 flex-shrink-0 mr-8">
              <div className="sticky top-32">
                {sortedGroups.map((groupKey) => (
                  <div
                    key={groupKey}
                    className={`h-8 flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                      activeGroup === groupKey ? 'text-bright-lake' : 'text-navy'
                    }`}
                  >
                    {groupKey}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full">
              {sortedGroups.map((groupKey, groupIndex) => (
                <motion.div
                  key={groupKey}
                  ref={setGroupRef(groupKey)}
                  data-group-key={groupKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-16"
                >
                  {/* Group Header */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-bright-lake border-b border-bright-lake/30 pb-2">
                      {groupKey}
                    </h2>
                  </div>

                  {/* Items in Group */}
                  <div className="space-y-0">
                    {groupedItems[groupKey].map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                        viewport={{ once: true }}
                        className="group"
                      >
                        <div className="border-b border-navy/20 py-6 hover:scale-[1.01] transition-all duration-700">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-navy group-hover:text-bright-lake transition-colors duration-200">
                                {getDisplayName(item)}
                              </h3>
                              {getSubtitle && (
                                <p className="text-sm text-navy/70 mt-1">{getSubtitle(item)}</p>
                              )}
                            </div>
                            <div className="ml-4">
                              <svg
                                className="w-5 h-5 text-off-navy/60 group-hover:text-bright-lake group-hover:translate-x-1 transition-all duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
