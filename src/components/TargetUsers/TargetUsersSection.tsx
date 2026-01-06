import React, { useState, useEffect, useRef } from 'react'
import { 
  Building2, 
  Zap, 
  Landmark, 
  Factory, 
  Home, 
  TrendingUp, 
  Briefcase, 
  GraduationCap, 
  Building 
} from 'lucide-react'

interface TargetUserCardProps {
  title: string
  description: string
  icon: React.ReactNode
  accentColor: string
}

const TargetUserCard = ({ title, description, icon, accentColor }: TargetUserCardProps) => {
  return (
    <div className="relative rounded-2xl p-[2px] overflow-hidden shadow-[0_10px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-shadow  duration-300 min-w-[300px] max-w-[300px] h-[140px] flex-shrink-0 group will-change-transform">
      {/* Static background */}
      <div className="absolute inset-0 bg-white rounded-2xl" />
      
      {/* Card content */}
      <div className="relative bg-white rounded-2xl p-4 h-full overflow-hidden flex gap-3 items-center">
        {/* Icon */}
        <div 
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accentColor}`}
        >
          {icon}
        </div>
        
        {/* Text content */}
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-bold text-gray-900 mb-0.5">{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}

const targetUsers = [
  { 
    title: "Fortune 1000 Company", 
    description: "Saving 3% on a $10m energy budget by verifying proposals.",
    icon: <Building2 className="w-6 h-6 text-white" />,
    accentColor: "bg-gradient-to-br from-blue-500 to-blue-700"
  },
  { 
    title: "Electric Utility", 
    description: "Accelerating one 150MW interconnection by three months.",
    icon: <Zap className="w-6 h-6 text-white" />,
    accentColor: "bg-gradient-to-br from-amber-400 to-amber-600"
  },
  { 
    title: "Policy Maker", 
    description: "Targeting just one clean energy incentive to the highest-impact community using data-backed burden analysis.",
    icon: <Landmark className="w-6 h-6 text-white" />,
    accentColor: "bg-gradient-to-br from-purple-500 to-purple-700"
  },
  { 
    title: "Energy Development Firm", 
    description: "Catching deal-ending mistakes on one multi-million dollar proposal before it's sent out.",
    icon: <Factory className="w-6 h-6 text-white" />,
    accentColor: "bg-gradient-to-br from-emerald-500 to-emerald-700"
  },
  { 
    title: "Person at Home", 
    description: "Taking a photo of one electric bill and enrolling in deregulated energy brokerage through ELM's instant supplier matching.",
    icon: <Home className="w-6 h-6 text-white" />,
    accentColor: "bg-gradient-to-br from-pink-500 to-pink-700"
  },
  { 
    title: "Energy Broker", 
    description: "Converting 15% more prospects to clients by instantly analyzing bills and identifying optimal supplier matches.",
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    accentColor: "bg-gradient-to-br from-cyan-500 to-cyan-700"
  },
  { 
    title: "Private Equity Firm", 
    description: "Improving due diligence efficiency by 40% when evaluating energy asset acquisitions, saving more than $300,000 per deal.",
    icon: <Briefcase className="w-6 h-6 text-white" />,
    accentColor: "bg-gradient-to-br from-slate-600 to-slate-800"
  },
  { 
    title: "School District or University", 
    description: "Reducing campus energy spend by 7% through tariff optimization and demand charge avoidance strategies.",
    icon: <GraduationCap className="w-6 h-6 text-white" />,
    accentColor: "bg-gradient-to-br from-red-500 to-red-700"
  },
  { 
    title: "City Manager", 
    description: "Recruiting one corporation/enterprise headquarters using data center energy cost competitiveness insights.",
    icon: <Building className="w-6 h-6 text-white" />,
    accentColor: "bg-gradient-to-br from-indigo-500 to-indigo-700"
  },
]

// Split into 3 rows
const row1 = targetUsers.slice(0, 3)
const row2 = targetUsers.slice(3, 6)
const row3 = targetUsers.slice(6, 9)

const MarqueeRow = ({ 
  items, 
  direction = 'left',
  speed = 30
}: { 
  items: typeof targetUsers
  direction?: 'left' | 'right'
  speed?: number
}) => {
  // Only duplicate twice for better performance
  const duplicatedItems = [...items, ...items]
  
  return (
    <div className="relative overflow-hidden py-2">
      <div 
        className={`flex gap-6 will-change-transform ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {duplicatedItems.map((item, index) => (
          <TargetUserCard
            key={`${item.title}-${index}`}
            title={item.title}
            description={item.description}
            icon={item.icon}
            accentColor={item.accentColor}
          />
        ))}
        {/* Inline duplicate for seamless loop */}
        {duplicatedItems.map((item, index) => (
          <TargetUserCard
            key={`dup-${item.title}-${index}`}
            title={item.title}
            description={item.description}
            icon={item.icon}
            accentColor={item.accentColor}
          />
        ))}
      </div>
    </div>
  )
}

const TargetUsersSection = () => {
  const [isSectionVisible, setIsSectionVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className=" overflow-hidden bg-gray-50/50">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <div 
          className={`text-center transition-all duration-700 ${
            isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Built for everyone in energy
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From Fortune 1000 companies to homeowners, ELM transforms how decisions are made across the energy ecosystem.
          </p>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-4">
        <MarqueeRow items={row1} direction="left" speed={80} />
        <MarqueeRow items={row2} direction="right" speed={90} />
        <MarqueeRow items={row3} direction="left" speed={80} />
      </div>

      {/* CSS for marquee animation - GPU accelerated */}
      <style>{`
        @keyframes marquee-left {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        
        @keyframes marquee-right {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        
        .animate-marquee-left {
          animation: marquee-left linear infinite;
        }
        
        .animate-marquee-right {
          animation: marquee-right linear infinite;
        }
      `}</style>
    </div>
  )
}

export default TargetUsersSection