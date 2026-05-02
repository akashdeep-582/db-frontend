import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../sections/Hero'
import Features from '../sections/Features'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'

type ModalState = 'login' | 'register' | null

export default function Home() {
  const [modal, setModal] = useState<ModalState>(null)

  return (
    <div className="home">
      <Navbar
        onLogin={() => setModal('login')}
        onRegister={() => setModal('register')}
      />

      <main>
        <Hero
          onRegister={() => setModal('register')}
          onLogin={() => setModal('login')}
        />
        <Features />
      </main>

      <Footer />

      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal(null)}
          onSwitchToRegister={() => setModal('register')}
        />
      )}
      {modal === 'register' && (
        <RegisterModal
          onClose={() => setModal(null)}
          onSwitchToLogin={() => setModal('login')}
        />
      )}
    </div>
  )
}
