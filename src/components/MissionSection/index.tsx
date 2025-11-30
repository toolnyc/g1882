'use client'
import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { fadeUp } from '@/utilities/animations'

interface MissionSectionProps {
  missionStatement?: string | null
  missionCtaText?: string | null
  missionCtaUrl?: string | null
}

export const MissionSection: React.FC<MissionSectionProps> = ({
  missionStatement,
  missionCtaText,
  missionCtaUrl,
}) => {
  const { scrollYProgress } = useScroll()

  // Animate border from 0 to 100% width
  const borderWidth = useTransform(scrollYProgress, [0, 0.2], ['0%', '100%'])

  const statement = missionStatement || ''
  const words = statement.split(' ').reduce<string[]>((acc, word, idx) => {
    if ((idx + 1) % 3 === 0 && idx !== 0) {
      acc[acc.length - 1] += ' ' + word
    } else {
      acc.push(word)
    }
    return acc
  }, [])

  return (
    <section className="py-20 gallery-section">
      <div className="container">
        <motion.div {...fadeUp()} className="text-center max-w-5xl mx-auto">
          <motion.div {...fadeUp({ delay: 0.2, distance: 20 })} className="caption text-lake mb-6">
            Our Mission
          </motion.div>

          <motion.h2 className="mb-10 text-3xl md:text-4xl text-navy leading-tight">
            {words.map((word, index) => (
              <motion.span
                key={index}
                {...fadeUp({ delay: index * 0.1, distance: 20, duration: 0.5 })}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>

          {/* Animated bright lake border */}
          <motion.div className="h-[.15em] bg-bright-lake mx-auto" style={{ width: borderWidth }} />

          {/* CTA Button */}
          {missionCtaText && missionCtaUrl && (
            <motion.div {...fadeUp({ delay: 0.6, distance: 20 })} className="mt-10">
              <Link href={missionCtaUrl} className="gallery-button-primary px-8 py-4 text-lg">
                {missionCtaText}
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
