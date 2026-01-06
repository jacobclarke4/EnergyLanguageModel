import DoubleGridSection from "../Sections/DoubleGridSection"
import StatsBar from "./StatsBar"

const IntroSection = () => {
  return (
    <div className='grid grid-col-1 h-full w-full pt-2'> {/* Remove h-full, use min-h instead */}
        <div className="grid grid-cols-12 gap-4 max-w-6xl mx-auto px-4 w-full">
            {/* Left Column - Text Content */}
            <div className="col-span-10 sm:col-span-10 md:col-span-9 lg:col-span-7 justify-center ">
              <h1 className="text-4xl/tight sm:text-4xl/tight md:text-5xl/tight lg:text-6xl/tight font-bold text-white mb-6">
                Energy Language Model
              </h1>
              <h2 className='text-lg/tight sm:text-xl/tight md:text-2xl/tight lg:text-3xl/tight font-bold text-white mb-6'>The Largest and Most Capable Energy Domain Language Model</h2>
              <div className="flex gap-4">
                  <button className="px-4 py-1.5 rounded-full font-bold text-black bg-white text-base">
                  Join Waitlist
                  </button>
              </div>
            </div>
            {/* Right Column - Image/Graphic */}
            <div className="relative">
            </div>
        </div>
        <div className="clipped-section bg-white w-full  mt-auto"> {/* Remove flex-1 h-full, add mt-auto */}
           <StatsBar />
        </div>
    </div>
  )
}

export default IntroSection