'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ children, delay = 0, duration = 0.5, className = '' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }
      )
    }
  }, [delay, duration])

  return <div ref={ref} className={className}>{children}</div>
}

export function SlideIn({ children, delay = 0, duration = 0.5, className = '' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration, delay, ease: 'power2.out' }
      )
    }
  }, [delay, duration])

  return <div ref={ref} className={className}>{children}</div>
}

export function StaggerContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const children = ref.current.children
      gsap.fromTo(
        children,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          stagger: 0.1, 
          ease: 'power2.out' 
        }
      )
    }
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}