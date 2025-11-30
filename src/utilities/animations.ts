import type { MotionProps } from 'framer-motion'

type FadeOptions = {
  delay?: number
  distance?: number
  duration?: number
  once?: boolean
}

type ScaleOptions = {
  delay?: number
  duration?: number
  once?: boolean
  start?: number
}

type SlideOptions = {
  delay?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  distance?: number
  duration?: number
  once?: boolean
}

const withViewport = (props: MotionProps, once = true): MotionProps => ({
  viewport: { once },
  ...props,
})

export const fadeUp = ({
  delay = 0,
  distance = 40,
  duration = 0.8,
  once = true,
}: FadeOptions = {}): MotionProps =>
  withViewport(
    {
      initial: { opacity: 0, y: distance },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration, delay, ease: 'easeOut' },
    },
    once,
  )

export const fadeIn = ({
  delay = 0,
  duration = 0.8,
  once = true,
}: FadeOptions = {}): MotionProps =>
  withViewport(
    {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { duration, delay, ease: 'easeOut' },
    },
    once,
  )

export const scaleIn = ({
  delay = 0,
  duration = 0.8,
  once = true,
  start = 0.95,
}: ScaleOptions = {}): MotionProps =>
  withViewport(
    {
      initial: { opacity: 0, scale: start },
      whileInView: { opacity: 1, scale: 1 },
      transition: { duration, delay, ease: 'easeOut' },
    },
    once,
  )

export const slideIn = ({
  delay = 0,
  direction = 'left',
  distance = 40,
  duration = 0.8,
  once = true,
}: SlideOptions = {}): MotionProps => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'
  const value =
    direction === 'left' || direction === 'up'
      ? -Math.abs(distance)
      : Math.abs(distance)

  return withViewport(
    {
      initial: { opacity: 0, [axis]: value },
      whileInView: { opacity: 1, [axis]: 0 },
      transition: { duration, delay, ease: 'easeOut' },
    },
    once,
  )
}

