'use client'

import { useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import AnimatedBars from './animated-bars'
import StoryText from './story-text'
import SolutionText from './solution-text'


export default function Storytelling() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })
  // leaving comments here because of magic numbers
  // everything happens but never reaches the end - stops at 99.9%
  const barHeight = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.85], ["0%", "12%", "12%", "0%"])
  
  // Story text starts visible (opacity 1) and fades out after phase 2 is done
  const storyOpacity = useTransform(scrollYProgress, [0.6, 0.65], [1, 0])
  // Solution text fades in immediately as story fades out
  const solutionOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1])

  return (
    <div>
      <div className="hidden lg:block">
        <AnimatedBars barHeight={barHeight} />
      </div>

      <div ref={containerRef} className="relative h-[400vh] bg-background hidden lg:block max-w-screen-4xl mx-auto w-full px-4">
        {/* sticky container that holds everything in place while user scrolls */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

          {/* main story text - always visible, sticky in center */}
          <StoryText storyOpacity={storyOpacity} scrollYProgress={scrollYProgress} />

          {/* solution text - stays in middle, fades in */}
          <SolutionText solutionOpacity={solutionOpacity} />
        </div>
      </div>
    </div>
  )
}
