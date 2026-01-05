import FluidBackground from "./components/GradientBackground/FluidBackground";
import IntroSection from "./components/IntroSection/IntroSection";
import Header from "./components/Navigation/Header";


function App() {
  return (
    <div className="overflow-x-hidden">
      <FluidBackground />
      <div className="relative grid grid-rows-[auto_1fr] min-h-screen">
        <Header />
        <section id="home">
          <IntroSection />
        </section>
      </div>

      <section id="about" className="min-h-screen bg-amber-500">
        {/* about content */}
      </section>

      <section id="services" className="min-h-screen bg-gray-800">
        {/* services content */}
      </section>

      <section id="contact" className="min-h-screen bg-blue-600">
        {/* contact content */}
      </section>
    </div>
  );
}

export default App;