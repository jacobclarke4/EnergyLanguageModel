import React from 'react'

interface DataCardProps {
  badge?: {
    icon?: React.ReactNode
    label: string
  }
  title: string
  children?: React.ReactNode
}

const DataCard = ({ badge, title, children }: DataCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md">
      {badge && (
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 mb-4">
          {badge.icon}
          <span className="text-sm font-medium text-gray-700">{badge.label}</span>
        </div>
      )}
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      
      {children}
    </div>
  )
}

export default DataCard