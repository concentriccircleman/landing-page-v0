'use client'

import { motion, MotionValue, useTransform } from 'motion/react'

interface StoryTextProps {
  storyOpacity: MotionValue<number>
  scrollYProgress: MotionValue<number>
}

export default function StoryText({ storyOpacity, scrollYProgress }: StoryTextProps) {
  // Text phases based on scroll progress - phase 1 starts visible
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0])
  // Phase 2 fades in immediately after phase 1
  const phase2Opacity = useTransform(scrollYProgress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0])

  return (
    <motion.div 
      className="relative z-20 text-center px-8 max-w-5xl"
      style={{ opacity: storyOpacity }}
    >
      {/* Phase 1: Many successful organizations pride themselves on agility - now fades in */}
      <motion.h2 
        className="text-5xl font-bold text-foreground leading-tight"
        style={{ opacity: phase1Opacity }}
      >
        All great companies start small, but greatness comes with <span className="italic">scale</span>. 
      </motion.h2>

      {/* Phase 2: But over time, they start to feel way, way slower */}
      <motion.h2 
        className="absolute inset-0 text-5xl font-bold text-foreground leading-tight"
        style={{ opacity: phase2Opacity }}
      >
        Scaling is extraordinarily painful.{' '}
        ...decisions <span className="italic">fragment</span>, context <span className="italic">scatters</span>, and teams <span className="italic">become misaligned</span>. 
      </motion.h2>
    </motion.div>
  )
}
