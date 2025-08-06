'use client'

import { motion, MotionValue } from 'motion/react'

interface AnimatedBarsProps {
  barHeight: MotionValue<string>
}

export default function AnimatedBars({ barHeight }: AnimatedBarsProps) {
  return (
    <>
      {/* Top bar - grows from top edge toward middle */}
      <motion.div
        className="fixed top-0 left-0 w-full bg-foreground z-[100]"
        style={{ 
          height: barHeight
        }}
      />

      {/* Bottom bar - grows from bottom edge toward middle */}
      <motion.div
        className="fixed bottom-0 left-0 w-full bg-foreground z-[100]"
        style={{ 
          height: barHeight
        }}
      />
    </>
  )
}
