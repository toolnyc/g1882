'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { getCategoryTagClasses } from '@/utilities/getCategoryTagClasses'

interface DirectoryItem {
  id?: string
  slug?: string | null
  name: string
  groupKey?: string
  displayName?: string
  subtitle?: string
  href?: string | null
  category?: string | null
  [key: string]: any
}

interface DirectoryListingProps {
  items: DirectoryItem[]
  title: string
  groupBy: 'alphabetical' | 'chronological'
  className?: string
  banner?: React.ReactNode
}

export const DirectoryListing: React.FC<DirectoryListingProps> = ({
  items,
  title,
  groupBy,
  className = '',
  banner,
}) => {
  const [activeGroup, setActiveGroup] = useState<string>('')
  const [groupRefs, setGroupRefs] = useState<{ [key: string]: HTMLDivElement | null }>({})
  const [searchQuery, setSearchQuery] = useState<string>('')
  const stickyHeaderRef = useRef<HTMLDivElement>(null)
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState<number>(0)

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items
    }

    const query = searchQuery.toLowerCase().trim()
    return items.filter((item) => {
      const displayName = (item.displayName || item.name || '').toLowerCase()
      const subtitle = (item.subtitle || '').toLowerCase()
      return displayName.includes(query) || subtitle.includes(query)
    })
  }, [items, searchQuery])

  // Group items by the specified key
  const groupedItems = useMemo(() => {
    return filteredItems.reduce(
      (groups, item) => {
        const key = item.groupKey || 'Unknown'
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(item)
        return groups
      },
      {} as { [key: string]: DirectoryItem[] },
    )
  }, [filteredItems])

  // Sort groups and items within groups
  const sortedGroups = useMemo(() => {
    const groups = Object.keys(groupedItems).sort((a, b) => {
      if (groupBy === 'alphabetical') {
        return a.localeCompare(b)
      } else {
        // For chronological, we want newest first (reverse order)
        return b.localeCompare(a)
      }
    })

    // Sort items within each group
    groups.forEach((groupKey) => {
      groupedItems[groupKey].sort((a, b) => {
        if (groupBy === 'alphabetical') {
          return (a.displayName || a.name || '').localeCompare(b.displayName || b.name || '')
        } else {
          // For chronological, sort by date (newest first)
          return (
            new Date(b.startDate || b.date || b.publishedAt || '').getTime() -
            new Date(a.startDate || a.date || a.publishedAt || '').getTime()
          )
        }
      })
    })

    return groups
  }, [groupedItems, groupBy])

  // Measure sticky header height
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (stickyHeaderRef.current) {
        setStickyHeaderHeight(stickyHeaderRef.current.offsetHeight)
      }
    }

    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)

    // Use ResizeObserver for more accurate measurements when content changes
    const resizeObserver = new ResizeObserver(updateHeaderHeight)
    if (stickyHeaderRef.current) {
      resizeObserver.observe(stickyHeaderRef.current)
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
      resizeObserver.disconnect()
    }
  }, [banner, searchQuery])

  // Set up intersection observer to track which group is currently visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        // Find the entry with the highest intersection ratio that is intersecting
        let maxRatio = 0
        let activeGroupKey: string | null = null

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            const groupKey = entry.target.getAttribute('data-group-key')
            if (groupKey) {
              activeGroupKey = groupKey
            }
          }
        })

        if (activeGroupKey) {
          setActiveGroup(activeGroupKey)
        }
      },
      {
        root: null, // Use viewport instead of container
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      },
    )

    Object.values(groupRefs).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [groupRefs, sortedGroups])

  const setGroupRef = (groupKey: string) => (ref: HTMLDivElement | null) => {
    setGroupRefs((prev) => ({ ...prev, [groupKey]: ref }))
  }

  return (
    <section className={`pt-32 gallery-section ${className}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Sticky Header, Banner, and Search Container */}
          <div
            ref={stickyHeaderRef}
            className="sticky top-20 z-10 bg-cream/50 backdrop-blur-lg -mx-4 px-4 pt-4 pb-3 mb-8 border-b border-navy/10"
          >
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-navy border-b-4 border-bright-lake pb-4">
                {title}
              </h1>
            </div>

            {/* Banner */}
            {banner && <div className="mb-3">{banner}</div>}

            {/* Search Bar */}
            <div>
              <Input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full opacity-60 focus:opacity-100 transition-opacity"
              />
            </div>
          </div>

          <div className="flex w-full">
            {/* Side Tracker */}
            <div className="w-16 flex-shrink-0 mr-8">
              <div
                className="sticky self-start"
                style={{
                  top: stickyHeaderHeight > 0 ? `calc(5rem + ${stickyHeaderHeight}px)` : '5rem',
                }}
              >
                {sortedGroups
                  .filter((groupKey) => {
                    // Filter groups based on search - show group if any items match
                    if (!searchQuery.trim()) return true
                    return groupedItems[groupKey] && groupedItems[groupKey].length > 0
                  })
                  .map((groupKey) => (
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
              {sortedGroups
                .filter((groupKey) => {
                  // Filter groups based on search - show group if any items match
                  if (!searchQuery.trim()) return true
                  return groupedItems[groupKey] && groupedItems[groupKey].length > 0
                })
                .map((groupKey, groupIndex) => (
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
                      {groupedItems[groupKey].map((item, itemIndex) => {
                        const href =
                          item.href || (item.slug ? `/${title.toLowerCase()}/${item.slug}` : null)
                        const displayName = item.displayName || item.name || ''
                        const content = (
                          <div className="border-b border-navy/20 py-6 hover:scale-[1.01] transition-all duration-700">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-xl font-semibold text-navy group-hover:text-bright-lake transition-colors duration-200">
                                    {displayName}
                                  </h3>
                                  {item.category &&
                                    (() => {
                                      const { bgClass, textClass } = getCategoryTagClasses(
                                        item.category,
                                      )
                                      return (
                                        <span
                                          className={`inline-block px-3 py-1 ${bgClass} ${textClass} border border-bright-lake rounded text-sm font-semibold`}
                                        >
                                          {item.category}
                                        </span>
                                      )
                                    })()}
                                </div>
                                {item.subtitle && (
                                  <p className="text-sm text-navy/70 mt-1">{item.subtitle}</p>
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
                        )

                        return (
                          <motion.div
                            key={item.id || itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                            viewport={{ once: true }}
                            className="group"
                          >
                            {href ? (
                              <Link href={href} className="block">
                                {content}
                              </Link>
                            ) : (
                              content
                            )}
                          </motion.div>
                        )
                      })}
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
