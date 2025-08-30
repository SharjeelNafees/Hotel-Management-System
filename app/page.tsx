import Hero from '@/components/Hero'
import RoomShowcase from '@/components/RoomShowcase'
import Services from '@/components/Services'
import About from '@/components/About'
import Contact from '@/components/Contact'
import ChatWidget from '@/components/ChatWidget'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <RoomShowcase />
      <Services />
      <About />
      <Contact />
      <Footer />
      <ChatWidget />
    </main>
  )
}
