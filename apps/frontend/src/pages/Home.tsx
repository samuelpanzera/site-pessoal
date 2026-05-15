import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import TechStack from '../components/TechStack'
import Projects from '../components/Projects'
import PDISection from '../components/PDISection'
import Footer from '../components/Footer'
import Divider from '../components/Divider'
import ArchitectureBackground from '../components/ArchitectureBackground'
import Experience from '../components/Experience'
import { useSectionTitle } from '../hooks/useSectionTitle'

function Home() {
  useSectionTitle()

  return (
    <div className="min-h-screen text-on-background selection:bg-primary/30">
      <ArchitectureBackground />
      <Navigation />
      <main>
        <section id="hero"><Hero /></section>
        <section id="techstack"><TechStack /></section>
        <Divider />
        <section id="projetos"><Projects /></section>
        <Divider />
        <section id="experience"><Experience /></section>
        <Divider />
        <section id="pdi"><PDISection /></section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
