'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { AnimatedBorder } from '@/components/AnimatedBorder'

export default function VisitPage() {
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
              <img
                src="/media/placeholder.svg"
                alt="Gallery 1882 placeholder image"
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
              <div className="caption text-lake mb-6">Hours</div>
              <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">Gallery Hours</h2>
              <div className="space-y-6 text-lg leading-relaxed text-navy/80">
                <p>
                  Gallery 1882 is open to the public with regular hours that allow visitors to
                  experience our exhibitions and programs throughout the week.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-navy/10">
                    <span className="font-semibold text-navy">Monday - Friday</span>
                    <span className="text-navy/80">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-navy/10">
                    <span className="font-semibold text-navy">Saturday</span>
                    <span className="text-navy/80">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-navy/10">
                    <span className="font-semibold text-navy">Sunday</span>
                    <span className="text-navy/80">12:00 PM - 6:00 PM</span>
                  </div>
                </div>
                <p className="text-sm text-navy/60 mt-6">
                  * Last admission 30 minutes before closing. The gallery is closed on major
                  holidays.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="bg-lake/5 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-navy mb-6">Special Hours</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-navy mb-2">First Friday of Each Month</p>
                    <p className="text-navy/80">
                      Extended hours until 9:00 PM with special programming
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-navy mb-2">Summer Season (June-August)</p>
                    <p className="text-navy/80">
                      Additional evening hours on Thursdays until 8:00 PM
                    </p>
                  </div>
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
            <div className="caption text-lake mb-6">Admission</div>
            <h2 className="mb-10 text-4xl font-bold tracking-tight md:text-5xl text-navy">
              Free Admission
            </h2>
            <div className="space-y-8 text-lg leading-relaxed text-navy/80">
              <p>
                Gallery 1882 is committed to making contemporary art accessible to everyone.
                Admission is always free for all visitors.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-off-white p-8 rounded-lg border border-navy/10">
                  <h3 className="text-2xl font-bold text-navy mb-4">General Admission</h3>
                  <p className="text-navy/80 mb-4">
                    No tickets required for general admission. Simply walk in during our regular
                    hours.
                  </p>
                  <ul className="text-sm text-navy/70 space-y-2">
                    <li>• All ages welcome</li>
                    <li>• No advance booking required</li>
                    <li>• Self-guided tours available</li>
                  </ul>
                </div>
                <div className="bg-lake/5 p-8 rounded-lg border border-lake/20">
                  <h3 className="text-2xl font-bold text-navy mb-4">Group Visits</h3>
                  <p className="text-navy/80 mb-4">
                    Groups of 10 or more are encouraged to contact us in advance for the best
                    experience.
                  </p>
                  <ul className="text-sm text-navy/70 space-y-2">
                    <li>• Guided tours available</li>
                    <li>• Educational programs</li>
                    <li>• Special group rates for programs</li>
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
              <div className="caption text-lake mb-6">Location</div>
              <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">Getting Here</h2>
              <div className="space-y-6 text-lg leading-relaxed text-navy/80">
                <p>
                  Located in the heart of Chesterton, Indiana, Gallery 1882 is easily accessible by
                  car and public transportation, with convenient parking available.
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-navy mb-4">Address</h3>
                    <p className="text-lg text-navy/80">
                      1882 Broadway
                      <br />
                      Chesterton, IN 46304
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-navy mb-4">Parking</h3>
                    <p className="text-navy/80 mb-4">
                      Free parking is available in our dedicated lot adjacent to the gallery.
                      Additional street parking is available on Broadway and surrounding streets.
                    </p>
                    <ul className="text-sm text-navy/70 space-y-1">
                      <li>• 20 spaces in gallery lot</li>
                      <li>• Street parking on Broadway</li>
                      <li>• Accessible parking spaces available</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="space-y-6">
                <div className="bg-off-white p-6 rounded-lg border border-navy/10">
                  <h3 className="text-xl font-bold text-navy mb-4">By Car</h3>
                  <p className="text-navy/80 text-sm mb-3">
                    From Chicago: Take I-94 East to Exit 26A (IN-49), then follow signs to
                    Chesterton.
                  </p>
                  <p className="text-navy/80 text-sm">
                    From Indianapolis: Take I-65 North to I-94 West, then follow the same
                    directions.
                  </p>
                </div>
                <div className="bg-lake/5 p-6 rounded-lg border border-lake/20">
                  <h3 className="text-xl font-bold text-navy mb-4">Public Transit</h3>
                  <p className="text-navy/80 text-sm mb-3">
                    South Shore Line train to Chesterton station, then 5-minute walk to gallery.
                  </p>
                  <p className="text-navy/80 text-sm">
                    Bus routes 1 and 3 stop within 2 blocks of the gallery.
                  </p>
                </div>
                <div className="bg-navy/5 p-6 rounded-lg border border-navy/20">
                  <h3 className="text-xl font-bold text-navy mb-4">Accessibility</h3>
                  <p className="text-navy/80 text-sm">
                    The gallery is fully accessible with ramps, elevators, and accessible restrooms.
                    Service animals are welcome.
                  </p>
                </div>
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
            <div className="caption text-lake mb-6">About Chesterton</div>
            <h2 className="mb-10 text-4xl font-bold tracking-tight md:text-5xl text-navy">
              A Gateway to the Indiana Dunes
            </h2>
            <div className="space-y-8 text-lg leading-relaxed text-navy/80">
              <p>
                Chesterton serves as the perfect gateway to the Indiana Dunes National Park,
                offering visitors a unique blend of natural beauty and cultural experiences. Our
                gallery is proud to be part of this vibrant community.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-lake/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-lake"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">National Park Access</h3>
                  <p className="text-navy/80 text-sm">
                    Just 5 minutes from the Indiana Dunes National Park, with hiking trails,
                    beaches, and unique ecosystems.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-lake/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-lake"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">Historic Downtown</h3>
                  <p className="text-navy/80 text-sm">
                    Explore Chesterton&apos;s charming downtown with local shops, restaurants, and
                    historic architecture.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-lake/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-lake"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">Community Spirit</h3>
                  <p className="text-navy/80 text-sm">
                    A tight-knit community that values arts, culture, and environmental stewardship
                    in equal measure.
                  </p>
                </div>
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
            <div className="caption text-lake mb-6">Frequently Asked Questions</div>
            <h2 className="mb-12 text-4xl font-bold tracking-tight md:text-5xl text-navy text-center">
              Visitor Information
            </h2>
            <div className="space-y-4">
              <details className="group border border-navy/10 rounded-lg overflow-hidden">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-navy/5 transition-colors">
                  <span className="font-semibold text-navy text-lg">
                    What should I expect during my visit?
                  </span>
                  <svg
                    className="w-5 h-5 text-lake group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-navy/80">
                  <p>
                    Gallery 1882 offers a contemplative space to experience contemporary art in a
                    natural setting. Visitors can explore our current exhibitions at their own pace,
                    with gallery attendants available to answer questions. We encourage quiet
                    reflection and respectful engagement with the artwork.
                  </p>
                </div>
              </details>

              <details className="group border border-navy/10 rounded-lg overflow-hidden">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-navy/5 transition-colors">
                  <span className="font-semibold text-navy text-lg">Is photography allowed?</span>
                  <svg
                    className="w-5 h-5 text-lake group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-navy/80">
                  <p>
                    Photography is welcome in the gallery spaces for personal use only. We ask that
                    visitors refrain from using flash photography and respect the experience of
                    other visitors. Commercial photography requires advance permission.
                  </p>
                </div>
              </details>

              <details className="group border border-navy/10 rounded-lg overflow-hidden">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-navy/5 transition-colors">
                  <span className="font-semibold text-navy text-lg">
                    Are there guided tours available?
                  </span>
                  <svg
                    className="w-5 h-5 text-lake group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-navy/80">
                  <p>
                    Yes! We offer guided tours for groups of 10 or more visitors. Tours can be
                    scheduled in advance and are led by knowledgeable gallery staff or trained
                    docents. Contact us at least one week in advance to schedule your group visit.
                  </p>
                </div>
              </details>

              <details className="group border border-navy/10 rounded-lg overflow-hidden">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-navy/5 transition-colors">
                  <span className="font-semibold text-navy text-lg">
                    What facilities are available?
                  </span>
                  <svg
                    className="w-5 h-5 text-lake group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-navy/80">
                  <p>
                    The gallery features accessible restrooms, a small gift shop with artist books
                    and locally-made items, and a reading room with art publications. We also have a
                    coat check area and seating throughout the galleries for visitor comfort.
                  </p>
                </div>
              </details>

              <details className="group border border-navy/10 rounded-lg overflow-hidden">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-navy/5 transition-colors">
                  <span className="font-semibold text-navy text-lg">
                    Can I bring children to the gallery?
                  </span>
                  <svg
                    className="w-5 h-5 text-lake group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-navy/80">
                  <p>
                    Children of all ages are welcome at Gallery 1882. We ask that parents and
                    guardians supervise their children to ensure a respectful environment for all
                    visitors. We offer family-friendly programs and activities during select times.
                  </p>
                </div>
              </details>

              <details className="group border border-navy/10 rounded-lg overflow-hidden">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-navy/5 transition-colors">
                  <span className="font-semibold text-navy text-lg">
                    How often do exhibitions change?
                  </span>
                  <svg
                    className="w-5 h-5 text-lake group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-navy/80">
                  <p>
                    We typically present 4-6 major exhibitions per year, with each exhibition
                    running for 8-12 weeks. We also feature smaller rotating displays in our project
                    space. Check our website or sign up for our newsletter to stay updated on
                    current and upcoming exhibitions.
                  </p>
                </div>
              </details>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
