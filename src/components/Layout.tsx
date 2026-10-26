import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Chatbot from './Chatbot'
import Footer from './Footer'
import LoginModal from './LoginModal'
import Navbar from './Navbar'

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  useEffect(() => { document.body.classList.remove('modo-admin') }, [])

  return (
    <>
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      <LoginModal />
      <Chatbot />
    </>
  )
}
