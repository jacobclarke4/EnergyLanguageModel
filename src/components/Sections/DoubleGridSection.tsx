import React, { type ReactNode } from 'react'

interface DoubleGridSectionProps {
  children: ReactNode
}

const DoubleGridSection = ({ children }: DoubleGridSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center max-w-6xl mx-auto px-4">
      {children}
    </div>
  )
}

export default DoubleGridSection