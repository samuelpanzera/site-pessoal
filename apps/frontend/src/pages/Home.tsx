import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import TechStack from '../components/TechStack'
import Projects from '../components/Projects'
import PDISection from '../components/PDISection'
import Footer from '../components/Footer'
import Divider from '../components/Divider'
import ArchitectureBackground from '../components/ArchitectureBackground'
import Experience from '../components/Experience'

function Home() {
  return (
    <div className="min-h-screen text-on-background selection:bg-primary/30">
      <ArchitectureBackground />
      <Navigation />
      <main>
        <Hero />
        <TechStack />
        <Divider />
        <Projects />
        <Divider />
        <Experience />
        <Divider />
        <PDISection />
      </main>
      <Footer />
    </div>
  )
}

export default Home
