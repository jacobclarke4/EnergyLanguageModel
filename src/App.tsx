import DataTypesSection from "./components/DataTypesSection/DataTypesSection";
import EnergyTodaySection from "./components/EnergyTodaySection/EnergyTodaySection";
import FormSection from "./components/FormSection.tsx/FormSection";
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

      <section id="challenge" className="py-16">
        <EnergyTodaySection />
      </section>

      <section id="data" className="py-16">
        <DataTypesSection />
      </section>

      <section id="users" className="min-h-screen py-16">
        <TargetUsersSection />
      </section>

      <section id="team" className="min-h-screen py-16">
        <LeadershipTeamSection />
      </section>

      <section id="contact" className="min-h-screen py-16">
        <FormSection />
      </section>
    </div>
  );
}

export default App;