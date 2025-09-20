'use client'

import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'

// Racing-inspired easing curves from branding guidelines
export const racingEasing = {
  outRacing: [0.16, 1, 0.3, 1], // Fast start, smooth end
  inRacing: [0.4, 0, 0.6, 1],   // Smooth start, fast end
  inOutRacing: [0.4, 0, 0.2, 1], // Balanced acceleration
  bounceRacing: [0.68, -0.55, 0.265, 1.55] // Energetic bounce
}

// Racing durations from branding guidelines
export const racingDuration = {
  instant: 0.05,
  fast: 0.15,
  normal: 0.2,
  smooth: 0.3,
  slow: 0.5,
  slower: 0.75,
  crawl: 1.0
}

interface RacingFadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function RacingFadeIn({
  children,
  delay = 0,
  duration = racingDuration.smooth,
  className = ""
}: RacingFadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration,
        delay,
        ease: racingEasing.outRacing
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface RacingStaggerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export function RacingStagger({
  children,
  staggerDelay = 0.1,
  className = ""
}: RacingStaggerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            ease: racingEasing.outRacing
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface RacingStaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function RacingStaggerItem({ children, className = "" }: RacingStaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: racingDuration.smooth,
            ease: racingEasing.outRacing
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface RacingLiftProps {
  children: React.ReactNode
  liftHeight?: number
  className?: string
}

export function RacingLift({
  children,
  liftHeight = -2,
  className = ""
}: RacingLiftProps) {
  return (
    <motion.div
      whileHover={{
        y: liftHeight,
        transition: {
          duration: racingDuration.fast,
          ease: racingEasing.outRacing
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface RacingScaleProps {
  children: React.ReactNode
  scale?: number
  className?: string
}

export function RacingScale({
  children,
  scale = 1.02,
  className = ""
}: RacingScaleProps) {
  return (
    <motion.div
      whileHover={{
        scale,
        transition: {
          duration: racingDuration.fast,
          ease: racingEasing.inOutRacing
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface RacingSlideInProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  distance?: number
  delay?: number
  className?: string
}

export function RacingSlideIn({
  children,
  direction = 'left',
  distance = 20,
  delay = 0,
  className = ""
}: RacingSlideInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" })

  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -distance, y: 0 }
      case 'right': return { x: distance, y: 0 }
      case 'up': return { x: 0, y: -distance }
      case 'down': return { x: 0, y: distance }
      default: return { x: -distance, y: 0 }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
      transition={{
        duration: racingDuration.smooth,
        delay,
        ease: racingEasing.outRacing
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface RacingPageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function RacingPageTransition({ children, className = "" }: RacingPageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: racingDuration.smooth,
          ease: racingEasing.outRacing
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

interface RacingPulseProps {
  children: React.ReactNode
  scale?: number[]
  duration?: number
  className?: string
}

export function RacingPulse({
  children,
  scale = [1, 1.05, 1],
  duration = racingDuration.slow,
  className = ""
}: RacingPulseProps) {
  return (
    <motion.div
      animate={{ scale }}
      transition={{
        duration,
        repeat: Infinity,
        ease: racingEasing.inOutRacing
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default {
  FadeIn: RacingFadeIn,
  Stagger: RacingStagger,
  StaggerItem: RacingStaggerItem,
  Lift: RacingLift,
  Scale: RacingScale,
  SlideIn: RacingSlideIn,
  PageTransition: RacingPageTransition,
  Pulse: RacingPulse,
  easing: racingEasing,
  duration: racingDuration
}