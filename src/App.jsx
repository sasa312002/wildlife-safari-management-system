import React from 'react'
import Header from './components/Header'
import Home from './components/Home'
import Awareness from './components/Awareness'
import SafariPackages from './components/SafariPackages'
import AboutUs from './components/AboutUs'
import ContactUs from './components/ContactUs'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
      <Awareness />
      <SafariPackages />
      <AboutUs />
      <ContactUs />
    </div>
  )
}

export default App
