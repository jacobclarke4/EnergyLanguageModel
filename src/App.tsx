import EnergyTodaySection from "./components/EnergyTodaySection/EnergyTodaySection";
import FluidBackground from "./components/GradientBackground/FluidBackground";
import IntroSection from "./components/IntroSection/IntroSection";
import LeadershipTeamSection from "./components/LeadershipTeamSection/LeadershipTeamSection";
import Header from "./components/Navigation/Header";
import TargetUsersSection from "./components/TargetUsers/TargetUsersSection";

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

      <section id="about">
        <EnergyTodaySection />
      </section>

      <section id="services" className="min-h-screen ">
        <TargetUsersSection />
      </section>
      <section id="Team" className="min-h-screen ">
        <LeadershipTeamSection />
      </section>
      <section id="contact" className="min-h-screen bg-blue-600">
        {/* contact content */}
      </section>
    </div>
  );
}

export default App;