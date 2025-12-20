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

  // Default values for fallback
  const defaultRegularHours = [
    { day: 'Monday - Friday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 8:00 PM' },
    { day: 'Sunday', hours: '12:00 PM - 6:00 PM' },
  ]

  const defaultSpecialHours = [
    {
      title: 'First Friday of Each Month',
      description: 'Extended hours until 9:00 PM with special programming',
    },
    {
      title: 'Summer Season (June-August)',
      description: 'Additional evening hours on Thursdays until 8:00 PM',
    },
  ]

  const defaultGeneralAdmissionFeatures = [
    'All ages welcome',
    'No advance booking required',
    'Self-guided tours available',
  ]

  const defaultGroupVisitFeatures = [
    'Guided tours available',
    'Educational programs',
    'Special group rates for programs',
  ]

  const defaultParkingFeatures = [
    '20 spaces in gallery lot',
    'Street parking on Broadway',
    'Accessible parking spaces available',
  ]

  const defaultDirections = [
    {
      title: 'By Car',
      content:
        'From Chicago: Take I-94 East to Exit 26A (IN-49), then follow signs to Chesterton.\n\nFrom Indianapolis: Take I-65 North to I-94 West, then follow the same directions.',
      style: 'default' as const,
    },
    {
      title: 'Public Transit',
      content:
        'South Shore Line train to Chesterton station, then 5-minute walk to gallery.\n\nBus routes 1 and 3 stop within 2 blocks of the gallery.',
      style: 'lake' as const,
    },
    {
      title: 'Accessibility',
      content:
        'The gallery is fully accessible with ramps, elevators, and accessible restrooms. Service animals are welcome.',
      style: 'dark' as const,
    },
  ]

  const defaultChestertonFeatures = [
    {
      title: 'National Park Access',
      description:
        'Just 5 minutes from the Indiana Dunes National Park, with hiking trails, beaches, and unique ecosystems.',
      icon: 'location' as const,
    },
    {
      title: 'Historic Downtown',
      description:
        "Explore Chesterton's charming downtown with local shops, restaurants, and historic architecture.",
      icon: 'building' as const,
    },
    {
      title: 'Community Spirit',
      description:
        'A tight-knit community that values arts, culture, and environmental stewardship in equal measure.',
      icon: 'heart' as const,
    },
  ]

  const defaultFaqs = [
    {
      question: 'What should I expect during my visit?',
      answer:
        'Gallery 1882 offers a contemplative space to experience contemporary art in a natural setting. Visitors can explore our current exhibitions at their own pace, with gallery attendants available to answer questions. We encourage quiet reflection and respectful engagement with the artwork.',
    },
    {
      question: 'Is photography allowed?',
      answer:
        'Photography is welcome in the gallery spaces for personal use only. We ask that visitors refrain from using flash photography and respect the experience of other visitors. Commercial photography requires advance permission.',
    },
    {
      question: 'Are there guided tours available?',
      answer:
        'Yes! We offer guided tours for groups of 10 or more visitors. Tours can be scheduled in advance and are led by knowledgeable gallery staff or trained docents. Contact us at least one week in advance to schedule your group visit.',
    },
    {
      question: 'What facilities are available?',
      answer:
        'The gallery features accessible restrooms, a small gift shop with artist books and locally-made items, and a reading room with art publications. We also have a coat check area and seating throughout the galleries for visitor comfort.',
    },
    {
      question: 'Can I bring children to the gallery?',
      answer:
        'Children of all ages are welcome at Gallery 1882. We ask that parents and guardians supervise their children to ensure a respectful environment for all visitors. We offer family-friendly programs and activities during select times.',
    },
    {
      question: 'How often do exhibitions change?',
      answer:
        'We typically present 4-6 major exhibitions per year, with each exhibition running for 8-12 weeks. We also feature smaller rotating displays in our project space. Check our website or sign up for our newsletter to stay updated on current and upcoming exhibitions.',
    },
  ]

  const regularHours =
    visit.hours?.regularHours && visit.hours.regularHours.length > 0
      ? visit.hours.regularHours
      : defaultRegularHours

  const specialHours =
    visit.hours?.specialHours && visit.hours.specialHours.length > 0
      ? visit.hours.specialHours
      : defaultSpecialHours

  const generalAdmissionFeatures =
    visit.admission?.generalAdmissionFeatures &&
    visit.admission.generalAdmissionFeatures.length > 0
      ? visit.admission.generalAdmissionFeatures.map((f) => f.feature)
      : defaultGeneralAdmissionFeatures

  const groupVisitFeatures =
    visit.admission?.groupVisitFeatures && visit.admission.groupVisitFeatures.length > 0
      ? visit.admission.groupVisitFeatures.map((f) => f.feature)
      : defaultGroupVisitFeatures

  const parkingFeatures =
    visit.location?.parkingFeatures && visit.location.parkingFeatures.length > 0
      ? visit.location.parkingFeatures.map((f) => f.feature)
      : defaultParkingFeatures

  const directions =
    visit.location?.directions && visit.location.directions.length > 0
      ? visit.location.directions
      : defaultDirections

  const chestertonFeatures =
    visit.chesterton?.features && visit.chesterton.features.length > 0
      ? visit.chesterton.features
      : defaultChestertonFeatures

  const faqs =
    visit.faqsSection?.faqs && visit.faqsSection.faqs.length > 0
      ? visit.faqsSection.faqs
      : defaultFaqs

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
                src={heroImage?.url || '/media/placeholder.svg'}
                alt={heroImage?.alt || 'Gallery 1882 placeholder image'}
                width={1920}
                height={1080}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hours Section */}
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
              <div className="caption text-lake mb-6">{visit.hours?.caption || 'Hours'}</div>
              <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
                {visit.hours?.title || 'Gallery Hours'}
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-navy/80">
                <p>
                  {visit.hours?.description ||
                    'Gallery 1882 is open to the public with regular hours that allow visitors to experience our exhibitions and programs throughout the week.'}
                </p>
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
                <p className="text-sm text-navy/60 mt-6">
                  {visit.hours?.note ||
                    '* Last admission 30 minutes before closing. The gallery is closed on major holidays.'}
                </p>
              </div>
            </div>
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
          </motion.div>
        </div>
      </section>

      {/* Entry Section */}
      <section className="py-20 gallery-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="caption text-lake mb-6">
              {visit.admission?.caption || 'Admission'}
            </div>
            <h2 className="mb-10 text-4xl font-bold tracking-tight md:text-5xl text-navy">
              {visit.admission?.title || 'Free Admission'}
            </h2>
            <div className="space-y-8 text-lg leading-relaxed text-navy/80">
              <p>
                {visit.admission?.description ||
                  'Gallery 1882 is committed to making contemporary art accessible to everyone. Admission is always free for all visitors.'}
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-off-white p-8 rounded-lg border border-navy/10">
                  <h3 className="text-2xl font-bold text-navy mb-4">
                    {visit.admission?.generalAdmissionTitle || 'General Admission'}
                  </h3>
                  <p className="text-navy/80 mb-4">
                    {visit.admission?.generalAdmissionDescription ||
                      'No tickets required for general admission. Simply walk in during our regular hours.'}
                  </p>
                  <ul className="text-sm text-navy/70 space-y-2">
                    {generalAdmissionFeatures.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-lake/5 p-8 rounded-lg border border-lake/20">
                  <h3 className="text-2xl font-bold text-navy mb-4">
                    {visit.admission?.groupVisitTitle || 'Group Visits'}
                  </h3>
                  <p className="text-navy/80 mb-4">
                    {visit.admission?.groupVisitDescription ||
                      'Groups of 10 or more are encouraged to contact us in advance for the best experience.'}
                  </p>
                  <ul className="text-sm text-navy/70 space-y-2">
                    {groupVisitFeatures.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Getting Here Section */}
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
              <div className="caption text-lake mb-6">
                {visit.location?.caption || 'Location'}
              </div>
              <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
                {visit.location?.title || 'Getting Here'}
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-navy/80">
                <p>
                  {visit.location?.description ||
                    'Located in the heart of Chesterton, Indiana, Gallery 1882 is easily accessible by car and public transportation, with convenient parking available.'}
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-navy mb-4">Address</h3>
                    <p className="text-lg text-navy/80 whitespace-pre-line">
                      {visit.location?.address || '1882 Broadway\nChesterton, IN 46304'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-navy mb-4">Parking</h3>
                    <p className="text-navy/80 mb-4">
                      {visit.location?.parkingDescription ||
                        'Free parking is available in our dedicated lot adjacent to the gallery. Additional street parking is available on Broadway and surrounding streets.'}
                    </p>
                    <ul className="text-sm text-navy/70 space-y-1">
                      {parkingFeatures.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
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
          </motion.div>
        </div>
      </section>

      {/* About Chesterton Section */}
      <section className="py-20 gallery-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="caption text-lake mb-6">
              {visit.chesterton?.caption || 'About Chesterton'}
            </div>
            <h2 className="mb-10 text-4xl font-bold tracking-tight md:text-5xl text-navy">
              {visit.chesterton?.title || 'A Gateway to the Indiana Dunes'}
            </h2>
            <div className="space-y-8 text-lg leading-relaxed text-navy/80">
              <p>
                {visit.chesterton?.description ||
                  'Chesterton serves as the perfect gateway to the Indiana Dunes National Park, offering visitors a unique blend of natural beauty and cultural experiences. Our gallery is proud to be part of this vibrant community.'}
              </p>
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 gallery-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="caption text-lake mb-6">
              {visit.faqsSection?.caption || 'Frequently Asked Questions'}
            </div>
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
    </main>
  )
}
