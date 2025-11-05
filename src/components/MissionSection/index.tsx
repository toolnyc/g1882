'use client'
import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export const MissionSection: React.FC = () => {
  const { scrollYProgress } = useScroll()

  // Animate border from 0 to 100% width
  const borderWidth = useTransform(scrollYProgress, [0, 0.2], ['0%', '100%'])

  const statement =
    'We believe art has the power to transform our understanding of place, to bridge the gap between human creativity and the natural world, and to inspire new ways of seeing the landscape we call home.'
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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="caption text-lake mb-6"
          >
            Our Mission
          </motion.div>

          <motion.h2 className="mb-10 text-3xl md:text-4xl text-navy leading-tight">
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
                viewport={{ once: true }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>

          {/* Animated bright lake border */}
          <motion.div className="h-[.15em] bg-bright-lake mx-auto" style={{ width: borderWidth }} />
        </motion.div>
      </div>
    </section>
  )
}
