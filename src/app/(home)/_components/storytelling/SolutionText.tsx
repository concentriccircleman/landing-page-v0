'use client'

import { motion, MotionValue } from 'motion/react'

interface SolutionTextProps {
  solutionOpacity: MotionValue<number>
}

export default function SolutionText({ solutionOpacity }: SolutionTextProps) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-20"
      style={{ opacity: solutionOpacity }}
    >
      <div className="text-center px-8 max-w-4xl">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
          Scaling is hard. Sentra is here to help.
        </h2>
      </div>
    </motion.div>
  )
}
