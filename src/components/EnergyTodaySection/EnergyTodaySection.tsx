import React, { useState, useEffect } from 'react'
import { FileText, Image, AudioLines, Video, Code } from 'lucide-react'

interface DataTypeCardProps {
  title: string
  icon: React.ReactNode
  isActive: boolean
}

const DataTypeCard = ({ title, icon, isActive }: DataTypeCardProps) => {
  return (
    <div className="relative rounded-2xl p-[3px] overflow-hidden group cursor-pointer shadow-[0_10px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-shadow">
      {/* Static white background */}
      <div className="absolute inset-[-50%] bg-white" />
      
      {/* Animated rotating gradient border with fade */}
      <div 
        className={`absolute inset-[-50%] animated-gradient-border transition-opacity duration-500 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`} 
      />
      
      {/* Card content */}
      <div className="relative bg-white rounded-2xl p-4 h-full w-full  ">
        <div className='justify-self-center'>
            <div className="w-12 h-12 flex items-center justify-center mb-4">
            {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
      </div>
    </div>
  )
}

const dataTypes = [
  { title: "Text", icon: <FileText className="w-8 h-8 text-blue-600" /> },
  { title: "Image", icon: <Image className="w-8 h-8 text-purple-600" /> },
  { title: "Audio", icon: <AudioLines className="w-8 h-8 text-emerald-600" /> },
  { title: "Video", icon: <Video className="w-8 h-8 text-red-500" /> },
  { title: "Code", icon: <Code className="w-8 h-8 text-amber-500" /> },
]

const EnergyTodaySection = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % dataTypes.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 max-w-6xl mx-auto">
      <div className="px-4 grid grid-cols-12 gap-4">
        <div className="col-span-10 sm:col-span-10 md:col-span-9 lg:col-span-7">
          <h2 className="text-3xl/tight sm:text-3xl/tight md:text-4xl/tight lg:text-5xl/tight font-bold text-black mb-6 mt-12">
            ELM processes and generates all forms of data
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
        {dataTypes.map((item, index) => (
          <DataTypeCard 
            key={item.title} 
            title={item.title} 
            icon={item.icon} 
            isActive={index === activeIndex}
          />
        ))}
      </div>
    </div>
  )
}

export default EnergyTodaySection