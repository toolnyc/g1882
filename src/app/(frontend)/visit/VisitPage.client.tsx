'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { AnimatedBorder } from '@/components/AnimatedBorder'
import type { Visit, Media } from '@/payload-types'

interface VisitPageClientProps {
  visit: Visit
}

const LocationIcon = () => (
  <svg className="w-8 h-8 text-lake" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

const BuildingIcon = () => (
  <svg className="w-8 h-8 text-lake" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-8 h-8 text-lake" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)

const ChevronIcon = () => (
  <svg
    className="w-5 h-5 text-lake group-open:rotate-180 transition-transform"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const getIcon = (iconType: string | null | undefined) => {
  switch (iconType) {
    case 'building':
      return <BuildingIcon />
    case 'heart':
      return <HeartIcon />
    case 'location':
    default:
      return <LocationIcon />
  }
}

const getDirectionCardStyle = (style: string | null | undefined) => {
  switch (style) {
    case 'lake':
      return 'bg-lake/5 p-6 rounded-lg border border-lake/20'
    case 'dark':
      return 'bg-navy/5 p-6 rounded-lg border border-navy/20'
    case 'default':
    default:
      return 'bg-off-white p-6 rounded-lg border border-navy/10'
  }
}

export default function VisitPageClient({ visit }: VisitPageClientProps) {
  const heroImage = visit.heroImage as Media | null | undefined

  const regularHours = visit.hours?.regularHours && visit.hours.regularHours.length > 0
    ? visit.hours.regularHours
    : null

  const specialHours = visit.hours?.specialHours && visit.hours.specialHours.length > 0
    ? visit.hours.specialHours
    : null

  const showAdmission = visit.showAdmissionSection === true

  const generalAdmissionFeatures =
    visit.admission?.generalAdmissionFeatures && visit.admission.generalAdmissionFeatures.length > 0
      ? visit.admission.generalAdmissionFeatures.map((f) => f.feature)
      : null

  const groupVisitFeatures =
    visit.admission?.groupVisitFeatures && visit.admission.groupVisitFeatures.length > 0
      ? visit.admission.groupVisitFeatures.map((f) => f.feature)
      : null

  const parkingFeatures =
    visit.location?.parkingFeatures && visit.location.parkingFeatures.length > 0
      ? visit.location.parkingFeatures.map((f) => f.feature)
      : null

  const directions =
    visit.location?.directions && visit.location.directions.length > 0
      ? visit.location.directions
      : null

  const chestertonFeatures =
    visit.chesterton?.features && visit.chesterton.features.length > 0
      ? visit.chesterton.features
      : null

  const faqs =
    visit.faqsSection?.faqs && visit.faqsSection.faqs.length > 0
      ? visit.faqsSection.faqs
      : null

  return (
    <main className="min-h-screen bg-off-white">
      {/* Header */}
      <section className="pt-32 mt-12 gallery-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-navy">Visit</h1>
              <AnimatedBorder className="mt-4" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      {heroImage?.url && (
        <section className="py-0">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-lg"
            >
              <div className="aspect-[16/9] w-full bg-navy/5 flex items-center justify-center">
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt || 'Gallery 1882'}
                  width={1920}
                  height={1080}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Hours Section */}
      {(regularHours || visit.hours?.description) && (
        <section className="py-10 gallery-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid gap-20 lg:grid-cols-12"
            >
              <div className="lg:col-span-7">
                {visit.hours?.caption && (
                  <div className="caption text-lake mb-6">{visit.hours.caption}</div>
                )}
                <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
                  {visit.hours?.title || 'Gallery Hours'}
                </h2>
                <div className="space-y-6 text-lg leading-relaxed text-navy/80">
                  {visit.hours?.description && <p>{visit.hours.description}</p>}
                  {regularHours && (
                    <div className="space-y-4">
                      {regularHours.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-3 border-b border-navy/10"
                        >
                          <span className="font-semibold text-navy">{item.day}</span>
                          <span className="text-navy/80">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {visit.hours?.note && (
                    <p className="text-sm text-navy/60 mt-6">{visit.hours.note}</p>
                  )}
                </div>
              </div>
              {specialHours && (
                <div className="lg:col-span-5 lg:col-start-8">
                  <div className="bg-lake/5 p-8 rounded-lg">
                    <h3 className="text-2xl font-bold text-navy mb-6">
                      {visit.hours?.specialHoursTitle || 'Special Hours'}
                    </h3>
                    <div className="space-y-4">
                      {specialHours.map((item, index) => (
                        <div key={index}>
                          <p className="font-semibold text-navy mb-2">{item.title}</p>
                          <p className="text-navy/80">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Admission Section — only show when enabled and has content */}
      {showAdmission && (
        <section className="py-20 gallery-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              {visit.admission?.caption && (
                <div className="caption text-lake mb-6">{visit.admission.caption}</div>
              )}
              <h2 className="mb-10 text-4xl font-bold tracking-tight md:text-5xl text-navy">
                {visit.admission?.title || 'Admission'}
              </h2>
              <div className="space-y-8 text-lg leading-relaxed text-navy/80">
                {visit.admission?.description && <p>{visit.admission.description}</p>}
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  {(visit.admission?.generalAdmissionTitle || generalAdmissionFeatures) && (
                    <div className="bg-off-white p-8 rounded-lg border border-navy/10">
                      <h3 className="text-2xl font-bold text-navy mb-4">
                        {visit.admission?.generalAdmissionTitle || 'General Admission'}
                      </h3>
                      {visit.admission?.generalAdmissionDescription && (
                        <p className="text-navy/80 mb-4">{visit.admission.generalAdmissionDescription}</p>
                      )}
                      {generalAdmissionFeatures && (
                        <ul className="text-sm text-navy/70 space-y-2">
                          {generalAdmissionFeatures.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  {(visit.admission?.groupVisitTitle || groupVisitFeatures) && (
                    <div className="bg-lake/5 p-8 rounded-lg border border-lake/20">
                      <h3 className="text-2xl font-bold text-navy mb-4">
                        {visit.admission?.groupVisitTitle || 'Group Visits'}
                      </h3>
                      {visit.admission?.groupVisitDescription && (
                        <p className="text-navy/80 mb-4">{visit.admission.groupVisitDescription}</p>
                      )}
                      {groupVisitFeatures && (
                        <ul className="text-sm text-navy/70 space-y-2">
                          {groupVisitFeatures.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Getting Here Section */}
      {(visit.location?.description || visit.location?.address || directions) && (
        <section className="py-20 gallery-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid gap-20 lg:grid-cols-12"
            >
              <div className="lg:col-span-7">
                {visit.location?.caption && (
                  <div className="caption text-lake mb-6">{visit.location.caption}</div>
                )}
                <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
                  {visit.location?.title || 'Getting Here'}
                </h2>
                <div className="space-y-6 text-lg leading-relaxed text-navy/80">
                  {visit.location?.description && <p>{visit.location.description}</p>}
                  <div className="space-y-6">
                    {visit.location?.address && (
                      <div>
                        <h3 className="text-2xl font-bold text-navy mb-4">Address</h3>
                        <p className="text-lg text-navy/80 whitespace-pre-line">
                          {visit.location.address}
                        </p>
                      </div>
                    )}
                    {(visit.location?.parkingDescription || parkingFeatures) && (
                      <div>
                        <h3 className="text-2xl font-bold text-navy mb-4">Parking</h3>
                        {visit.location?.parkingDescription && (
                          <p className="text-navy/80 mb-4">{visit.location.parkingDescription}</p>
                        )}
                        {parkingFeatures && (
                          <ul className="text-sm text-navy/70 space-y-1">
                            {parkingFeatures.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {directions && (
                <div className="lg:col-span-5 lg:col-start-8">
                  <div className="space-y-6">
                    {directions.map((item, index) => (
                      <div key={index} className={getDirectionCardStyle(item.style)}>
                        <h3 className="text-xl font-bold text-navy mb-4">{item.title}</h3>
                        <p className="text-navy/80 text-sm whitespace-pre-line">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* About Chesterton Section */}
      {(visit.chesterton?.description || chestertonFeatures) && (
        <section className="py-20 gallery-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-5xl mx-auto"
            >
              {visit.chesterton?.caption && (
                <div className="caption text-lake mb-6">{visit.chesterton.caption}</div>
              )}
              <h2 className="mb-10 text-4xl font-bold tracking-tight md:text-5xl text-navy">
                {visit.chesterton?.title || 'About Chesterton'}
              </h2>
              <div className="space-y-8 text-lg leading-relaxed text-navy/80">
                {visit.chesterton?.description && <p>{visit.chesterton.description}</p>}
                {chestertonFeatures && (
                  <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {chestertonFeatures.map((feature, index) => (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 bg-lake/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          {getIcon(feature.icon)}
                        </div>
                        <h3 className="text-xl font-bold text-navy mb-3">{feature.title}</h3>
                        <p className="text-navy/80 text-sm">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQs Section — only show when FAQs are configured */}
      {faqs && (
        <section className="py-20 gallery-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              {visit.faqsSection?.caption && (
                <div className="caption text-lake mb-6">{visit.faqsSection.caption}</div>
              )}
              <h2 className="mb-12 text-4xl font-bold tracking-tight md:text-5xl text-navy text-center">
                {visit.faqsSection?.title || 'Visitor Information'}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group border border-navy/10 rounded-lg overflow-hidden">
                    <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-navy/5 transition-colors">
                      <span className="font-semibold text-navy text-lg">{faq.question}</span>
                      <ChevronIcon />
                    </summary>
                    <div className="px-6 pb-6 text-navy/80">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </main>
  )
}
