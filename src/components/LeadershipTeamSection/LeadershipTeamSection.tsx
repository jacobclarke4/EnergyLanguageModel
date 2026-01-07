import AdamPleasant from '../../assets/team/Adam+Pleasant.png'
import MarkPruitt from '../../assets/team/Mark+Pruitt.png'
import MarkNakayama from '../../assets/team/Mark+Nakayama.png'
import DavePavlik from '../../assets/team/David+Pavlik.png'

interface TeamMemberCardProps {
  name: string
  title: string
  description?: string
  image: string
}

const TeamMemberCard = ({ name, title, description, image }: TeamMemberCardProps) => {
  return (
    <div className="relative rounded-2xl p-[3px] overflow-hidden group cursor-pointer shadow-[0_10px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-shadow h-full">
      {/* Static background */}
      <div className="absolute inset-[-50%] bg-white" />
      
      {/* Animated rotating gradient border on hover */}
      <div className="absolute inset-[-50%] animated-gradient-border opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card content */}
      <div className="relative bg-white rounded-2xl p-6 h-full flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-gray-100">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <p className="text-[var(--purple)] font-semibold mb-2">{title}</p>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
    </div>
  )
}

const teamMembers = [
  {
    name: "Adam Pleasant",
    title: "Chief Operating Officer",
    description: "5 years of energy market strategy expertise. Head of Strategic Initiatives at Truffle Pig. Northwestern University MSES Teaching Team.",
    image: AdamPleasant
  },
  {
    name: "Mark Pruitt",
    title: "Chief Power Officer",
    description: "25+ years in energy markets. Former Director of Illinois Power Agency. Secured electricity for 4.7M ratepayer accounts. Northwestern Adjunct Professor.",
    image: MarkPruitt
  },
  {
    name: "Mark Nakayama",
    title: "Chief Commercial Officer",
    description: "15+ years in renewable energy development. Partner at 11 Million Acres. 10,000+ commercial energy accounts managed across 20+ markets.",
    image: MarkNakayama
  },
  {
    name: "Dave Pavlik",
    title: "Executive Chairman",
    description: "15+ years in energy investment and development. Led $2.8B+ in capital investments. Former Illinois State Budget Manager overseeing $20B+ in funding.",
    image: DavePavlik
  },
]

const LeadershipSection = () => {
  return (
    <div className="">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black  mb-4">
            Leadership Team
          </h2>
          <p className="text-gray-600 text-lg">
            Combining deep energy expertise with cutting-edge AI capabilities
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.name}
              name={member.name}
              title={member.title}
              description={member.description}
              image={member.image}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeadershipSection