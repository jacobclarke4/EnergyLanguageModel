import DoubleGridSection from "../Sections/DoubleGridSection"
import StatsBar from "./StatsBar"

const IntroSection = () => {
  return (
    <div className='grid grid-col-1 h-full'> {/* Remove h-full, use min-h instead */}
        <DoubleGridSection>
            {/* Left Column - Text Content */}
            <div className="flex flex-col justify-center">
            <h1 className="text-7xl/tight md:text-7xl/tight text-5xl/tight font-bold text-white mb-6">
                Energy<br />Language<br />Model
            </h1>
            <h2 className='text-2xl/tight font-bold text-white mb-6'>The Largest and Most Capable Energy Domain Language Model</h2>
            <div className="flex gap-4">
                <button className="px-4 py-1.5 rounded-full font-bold text-black bg-white text-base">
                Join Waitlist
                </button>
            </div>
            </div>
            {/* Right Column - Image/Graphic */}
            <div className="relative">
            </div>
        </DoubleGridSection>
        <div className="clipped-section bg-white w-full  mt-auto"> {/* Remove flex-1 h-full, add mt-auto */}
           <StatsBar />
        </div>
    </div>
  )
}

export default IntroSection