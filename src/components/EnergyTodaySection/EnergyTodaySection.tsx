import { useState, useEffect, useRef } from 'react'
import EnergyTree from '../../assets/EnergyTree.svg'

const EnergyTodaySection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const challenges = [
    { 
      title: "Unprecedented Complexity", 
      description: "More than 10,000,000 different tariff combinations across 3,000+ utilities in the US alone." 
    },
    { 
      title: "Growing Energy Demand", 
      description: "More people need more energy than ever before, driven by electrification and digital transformation." 
    },
    { 
      title: "Market Accessibility", 
      description: "Energy markets are more accessible but more complicated than ever before, requiring expert navigation." 
    },
    { 
      title: "Monetization Promise", 
      description: "Monetizing energy opportunities has more promise than ever before, but requires sophisticated analysis." 
    },
  ]

  return (
    <div ref={sectionRef} className="relative overflow-hidden">
      {/* Angled section using clip-path */}
      <div 
        className="bg-[var(--dark-purple)] relative"
        style={{
          clipPath: 'polygon(0 80px, 100% 0, 100% 100%, 0 100%)'
        }}
      >
        {/* Tree - Absolute positioned, clipping off right and bottom edge */}
        <div 
          className={`absolute top-1/2 -translate-y-[40%] right-0 translate-x-[15%] h-[120%] aspect-square pointer-events-none hidden lg:block transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <img 
            src={EnergyTree} 
            alt="" 
            className="w-full h-full object-contain object-top"
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-32 pb-20 relative z-10">
          {/* Left-aligned content */}
          <div 
            className={`max-w-xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Energy Today
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-12">
              The energy landscape has never been more complex—or more full of opportunity.
            </p>
          </div>

          {/* Stats/Challenges row */}
          <div 
            className={`grid grid-cols-2 gap-6 lg:max-w-[50%] transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {challenges.map((challenge, index) => (
              <div key={index} className="flex gap-4">
                <div className="bg-[var(--purple)] w-1 rounded-full flex-shrink-0" />
                <div>
                  <p className="text-lg md:text-xl font-bold text-white mb-2">{challenge.title}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{challenge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnergyTodaySection