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
        <h2 className="text-5xl font-bold text-foreground leading-tight">
        But what if you could remember every key decision, stay aligned, and <span className="underline">focus on what matters</span>?
        </h2>
      </div>
    </motion.div>
  )
}
