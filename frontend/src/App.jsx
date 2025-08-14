import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import Awareness from './components/Awareness'
import SafariPackages from './components/SafariPackages'
import TravelPackagesPage from './pages/TravelPackagesPage'
import ContactUsPage from './pages/ContactUsPage'
import AboutUsPage from './pages/AboutUsPage'
import './App.css'

function MainPage() {
  return (
    <div className="App">
      <Header />
      <Home />
      <Awareness />
      <SafariPackages />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/travel-packages" element={<TravelPackagesPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
      </Routes>
    </Router>
  )
}

export default App
