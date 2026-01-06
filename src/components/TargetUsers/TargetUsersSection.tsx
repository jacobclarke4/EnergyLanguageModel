import React, { useState, useEffect, useRef } from 'react'
import EnergyTree from '../../assets/EnergyTree.svg'

interface TargetUserCardProps {
  title: string
  description: string
  isVisible: boolean
}

const TargetUserCard = ({ title, description, isVisible }: TargetUserCardProps) => {
  return (
    <div 
      className={`relative rounded-2xl p-[3px] overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-500 h-[120px] ${
        isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-8'
      }`}
    >
      {/* Static background */}
      <div className="absolute inset-[-50%] bg-white" />
      
      {/* Animated rotating gradient border */}
      <div className="absolute inset-[-50%] animated-gradient-border opacity-100" />
      
      {/* Card content */}
      <div className="relative bg-white rounded-2xl p-6 h-full overflow-hidden">
        <h3 className="text-lg font-bold text-[var(--purple)] mb-2">{title}</h3>
        <p className="text-sm text-gray-700 line-clamp-3">{description}</p>
      </div>
    </div>
  )
}

const targetUsers = [
  { 
    title: "Fortune 1000 Company", 
    description: "Saving 3% on a $10m energy budget by verifying proposals." 
  },
  { 
    title: "Electric Utility", 
    description: "Accelerating one 150MW interconnection by three months." 
  },
  { 
    title: "Policy Maker", 
    description: "Targeting just one clean energy incentive to the highest-impact community using data-backed burden analysis." 
  },
  { 
    title: "Energy Development Firm", 
    description: "Catching deal-ending mistakes on one multi-million dollar proposal before it's sent out." 
  },
  { 
    title: "Person at Home", 
    description: "Taking a photo of one electric bill and enrolling in deregulated energy brokerage through ELM's instant supplier matching." 
  },
  { 
    title: "Energy Broker", 
    description: "Converting 15% more prospects to clients by instantly analyzing bills and identifying optimal supplier matches." 
  },
  { 
    title: "Private Equity Firm", 
    description: "Improving due diligence efficiency by 40% when evaluating energy asset acquisitions, saving more than $300,000 per deal." 
  },
  { 
    title: "School District or University", 
    description: "Reducing campus energy spend by 7% through tariff optimization and demand charge avoidance strategies." 
  },
  { 
    title: "City Manager", 
    description: "Recruiting one corporation/enterprise headquarters using data center energy cost competitiveness insights." 
  },
]

const TargetUsersSection = () => {
  const [activeIndices, setActiveIndices] = useState([0, 1])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSectionVisible, setIsSectionVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Rotate cards
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      
      setTimeout(() => {
        setActiveIndices(prev => {
          const next0 = (prev[0] + 2) % targetUsers.length
          const next1 = (prev[1] + 2) % targetUsers.length
          return [next0, next1]
        })
        setIsAnimating(false)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Intersection Observer for section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left side - Text and rotating cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header */}
            <div 
              className={`transition-all duration-700 ${
                isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-[var(--purple)] font-semibold mb-2">Who Benefits</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Built for everyone in energy
              </h2>
              <p className="text-gray-600">
                From Fortune 1000 companies to homeowners, ELM transforms how decisions are made across the energy ecosystem.
              </p>
            </div>

            {/* Rotating cards */}
            <div className="space-y-4">
              {activeIndices.map((index, i) => (
                <TargetUserCard
                  key={`${index}-${i}`}
                  title={targetUsers[index].title}
                  description={targetUsers[index].description}
                  isVisible={!isAnimating}
                />
              ))}
            </div>

            {/* Stats */}
            <div 
              className={`flex gap-8 pt-4 transition-all duration-700 delay-300 ${
                isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="border-l-4 border-[var(--purple)] pl-4">
                <p className="text-2xl font-bold text-gray-900">9+</p>
                <p className="text-sm text-gray-600">User segments served</p>
              </div>
              <div className="border-l-4 border-[var(--gold)] pl-4">
                <p className="text-2xl font-bold text-gray-900">1B+</p>
                <p className="text-sm text-gray-600">Energy data points</p>
              </div>
            </div>
          </div>

          {/* Right side - Tree */}
          <div 
            className={`lg:col-span-7 flex items-center justify-center transition-all duration-1000 ${
              isSectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <img 
              src={EnergyTree} 
              alt="Energy Tree" 
              className="w-full h-auto max-h-[600px] object-contain" 
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default TargetUsersSection