import { useState } from 'react'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import TechStack from '../components/TechStack'
import Projects from '../components/Projects'
import ExecutionLog from '../components/ExecutionLog'
import PDISection from '../components/PDISection'
import MockAuth from '../components/MockAuth'
import Footer from '../components/Footer'
import Divider from '../components/Divider'
import ArchitectureBackground from '../components/ArchitectureBackground'

function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleAccessClick = () => {
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen text-on-background selection:bg-primary/30">
      <ArchitectureBackground />
      <Navigation onAccessClick={handleAccessClick} />
      <main>
        <Hero />
        <TechStack />
        <Divider />
        <Projects />
        <Divider />
        <ExecutionLog />
        <Divider />
        <PDISection onAccessClick={handleAccessClick} />
      </main>
      <Footer />
      
      <MockAuth 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </div>
  )
}

export default Home
