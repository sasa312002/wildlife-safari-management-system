import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { contactMessageApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactUsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const loginTriggerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form with user data when authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  // Initialize interactive map with safari/hiking/adventure locations
  React.useEffect(() => {
    const ensureLeaflet = () => new Promise((resolve, reject) => {
      if (window.L) return resolve(window.L);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => resolve(window.L);
      script.onerror = () => reject(new Error('Failed to load Leaflet'));
      document.body.appendChild(script);
    });

    const initMap = async () => {
      try {
        const L = await ensureLeaflet();
        if (mapInstanceRef.current || !mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Inject CSS for pulsing office marker
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
          .pulse-marker { position: relative; width: 18px; height: 18px; }
          .pulse-marker .dot { width: 12px; height: 12px; background: #ef4444; border: 2px solid #fca5a5; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
          .pulse-marker .ring { position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; border: 2px solid rgba(239, 68, 68, 0.6); border-radius: 50%; transform: translate(-50%, -50%); animation: pulse-ring 1.8s ease-out infinite; }
          @keyframes pulse-ring { 0% { transform: translate(-50%, -50%) scale(0.6); opacity: 1; } 80% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; } 100% { opacity: 0; } }
        `;
        document.head.appendChild(styleTag);

        // Points of interest across Sri Lanka with categories
        const points = [
          { coords: [6.3619, 81.5206], title: 'Yala National Park', category: 'safari', desc: 'Big cats and diverse wildlife' },
          { coords: [8.4871, 80.1069], title: 'Wilpattu National Park', category: 'safari', desc: 'Largest national park' },
          { coords: [8.0393, 80.8203], title: 'Minneriya National Park', category: 'safari', desc: 'Elephant gathering' },
          { coords: [6.4108, 80.4580], title: 'Sinharaja Forest Reserve', category: 'adventure', desc: 'Rainforest biodiversity hotspot' },
          { coords: [7.4653, 80.7782], title: 'Knuckles Mountain Range', category: 'hiking', desc: 'Scenic trails' },
          { coords: [6.8667, 81.0465], title: 'Ella', category: 'hiking', desc: 'Little Adam\'s Peak & Nine Arches' },
          { coords: [6.8097, 80.4990], title: 'Adam\'s Peak (Sri Pada)', category: 'hiking', desc: 'Sunrise pilgrimage hike' },
          { coords: [6.8020, 80.7998], title: 'Horton Plains National Park', category: 'hiking', desc: 'World\'s End' }
        ];

        const categoryColors = {
          safari: '#10B981',
          hiking: '#3B82F6',
          adventure: '#F59E0B'
        };

        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

        const bounds = L.latLngBounds([]);

        // Office marker in red with pulse animation
        const officeLatLng = [6.9147, 79.8523];
        const officeIcon = L.divIcon({
          className: '',
          html: '<div class="pulse-marker"><span class="ring"></span><span class="dot"></span></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        const officeMarker = L.marker(officeLatLng, { icon: officeIcon }).addTo(map);
        officeMarker.bindPopup('<strong>Office - Colombo 03</strong><br/>123 Wildlife Road, Colombo 03');
        bounds.extend(officeLatLng);

        // Category markers with tooltip showing name and category
        points.forEach(p => {
          const color = categoryColors[p.category] || '#22D3EE';
          const marker = L.circleMarker(p.coords, {
            radius: 7,
            color,
            weight: 2,
            fillColor: color,
            fillOpacity: 0.9
          }).addTo(map);
          marker.bindTooltip(`${p.title} • ${capitalize(p.category)}`, { direction: 'top', offset: [0, -8] });
          marker.bindPopup(`<strong>${p.title}</strong><br/><em>Category: ${capitalize(p.category)}</em><br/>${p.desc}`);
          bounds.extend(p.coords);
        });

        map.fitBounds(bounds, { padding: [30, 30] });
      } catch (e) {
        console.error('Map initialization failed:', e);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Trigger the login modal from header
      if (loginTriggerRef.current) {
        loginTriggerRef.current();
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await contactMessageApi.createContactMessage(formData);
      
      // Reset form - preserve user data if authenticated
      if (isAuthenticated && user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          subject: '',
          message: ''
        });
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
      
      alert('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: "What is the best time to visit Sri Lanka for wildlife safaris?",
      answer: "The best time for wildlife safaris in Sri Lanka is during the dry season (February to September), with peak wildlife viewing from May to September."
    },
    {
      question: "Do you provide transportation to and from the national parks?",
      answer: "Yes, we provide complete transportation services including airport transfers, hotel pickups, and comfortable safari vehicles."
    },
    {
      question: "What should I bring for a safari tour?",
      answer: "We recommend bringing comfortable clothing, a hat, sunscreen, binoculars, camera, and any personal medications. We provide detailed packing lists for each tour."
    },
    {
      question: "Are your tours suitable for children?",
      answer: "Yes, we offer family-friendly tours with special considerations for children. Some tours have age restrictions for safety reasons."
    },
    {
      question: "What is your cancellation policy?",
      answer: "We offer flexible cancellation policies with full refunds available up to 7 days before the tour date, subject to terms and conditions."
    },
    {
      question: "Do you offer custom safari packages?",
      answer: "Absolutely! We specialize in creating custom safari experiences tailored to your interests, group size, and travel dates."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header triggerLogin={loginTriggerRef} />
      
      <div className="pt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-abeze font-bold text-white mb-4">
              Contact <span className="text-green-400">Us</span>
            </h1>
            <p className="text-gray-300 text-lg font-abeze max-w-3xl mx-auto">
              Ready to start your wildlife adventure? Get in touch with our expert team to plan your perfect Sri Lankan safari experience.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-abeze font-bold text-white mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {isAuthenticated && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-400 font-abeze text-sm">
                        Your contact information has been pre-filled from your account.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-abeze font-medium mb-2">
                      First Name {isAuthenticated && <span className="text-green-400 text-sm">(Pre-filled)</span>}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      readOnly={isAuthenticated}
                      className={`w-full border rounded-lg px-4 py-3 text-white font-abeze focus:outline-none transition-colors ${
                        isAuthenticated 
                          ? 'bg-gray-700/50 border-gray-600 cursor-not-allowed' 
                          : 'bg-white/10 border-white/20 focus:border-green-400'
                      }`}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-abeze font-medium mb-2">
                      Last Name {isAuthenticated && <span className="text-green-400 text-sm">(Pre-filled)</span>}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      readOnly={isAuthenticated}
                      className={`w-full border rounded-lg px-4 py-3 text-white font-abeze focus:outline-none transition-colors ${
                        isAuthenticated 
                          ? 'bg-gray-700/50 border-gray-600 cursor-not-allowed' 
                          : 'bg-white/10 border-white/20 focus:border-green-400'
                      }`}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white font-abeze font-medium mb-2">
                    Email Address {isAuthenticated && <span className="text-green-400 text-sm">(Pre-filled)</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly={isAuthenticated}
                    className={`w-full border rounded-lg px-4 py-3 text-white font-abeze focus:outline-none transition-colors ${
                      isAuthenticated 
                        ? 'bg-gray-700/50 border-gray-600 cursor-not-allowed' 
                        : 'bg-white/10 border-white/20 focus:border-green-400'
                    }`}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-abeze font-medium mb-2">
                    Phone Number {isAuthenticated && <span className="text-green-400 text-sm">(Pre-filled)</span>}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    readOnly={isAuthenticated}
                    className={`w-full border rounded-lg px-4 py-3 text-white font-abeze focus:outline-none transition-colors ${
                      isAuthenticated 
                        ? 'bg-gray-700/50 border-gray-600 cursor-not-allowed' 
                        : 'bg-white/10 border-white/20 focus:border-green-400'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-abeze font-medium mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze focus:border-green-400 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="safari-booking">Safari Booking</option>
                    <option value="custom-package">Custom Package</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="group-booking">Group Booking</option>
                    <option value="support">Customer Support</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-abeze font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-abeze focus:border-green-400 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your wildlife adventure plans..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-abeze font-bold transition-colors duration-300"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600/20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-abeze font-bold text-white mb-2">Office Location</h4>
                    <p className="text-gray-300 font-abeze text-sm leading-relaxed">
                      123 Wildlife Road<br />
                      Colombo 03, Sri Lanka<br />
                      Near the National Museum
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600/20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-abeze font-bold text-white mb-2">Phone & Email</h4>
                    <div className="space-y-2">
                      <p className="text-gray-300 font-abeze text-sm">
                        <span className="text-green-400">Phone:</span> +94 11 234 5678
                      </p>
                      <p className="text-gray-300 font-abeze text-sm">
                        <span className="text-green-400">WhatsApp:</span> +94 77 123 4567
                      </p>
                      <p className="text-gray-300 font-abeze text-sm">
                        <span className="text-green-400">Email:</span> info@wildpath.lk
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600/20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-abeze font-bold text-white mb-2">Business Hours</h4>
                    <div className="space-y-1">
                      <p className="text-gray-300 font-abeze text-sm">
                        <span className="text-green-400">Monday - Sunday:</span> 6:00 AM - 8:00 PM
                      </p>
                      <p className="text-gray-300 font-abeze text-sm">
                        <span className="text-green-400">Safari Departures:</span> 5:30 AM - 6:00 PM
                      </p>
                      <p className="text-gray-300 font-abeze text-sm">
                        <span className="text-green-400">Emergency:</span> 24/7 Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="text-xl font-abeze font-bold text-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="bg-green-600/20 p-3 rounded-lg hover:bg-green-600/30 transition-colors">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="bg-green-600/20 p-3 rounded-lg hover:bg-green-600/30 transition-colors">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="bg-green-600/20 p-3 rounded-lg hover:bg-green-600/30 transition-colors">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5 Hawkins 0 1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="bg-green-600/20 p-3 rounded-lg hover:bg-green-600/30 transition-colors">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-abeze font-bold text-white mb-6 text-center">Find Us</h3>
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div ref={mapContainerRef} className="w-full h-96" />
                <div className="p-3 text-center">
                  <a
                    href="https://www.openstreetmap.org/#map=7/7.500/80.700"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 font-abeze text-sm"
                  >
                    View on OpenStreetMap
                  </a>
                  <p className="text-gray-400 font-abeze text-xs mt-1">Explore safari, hiking, and adventure locations across Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-3xl font-abeze font-bold text-white text-center mb-12">
              Frequently Asked <span className="text-green-400">Questions</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="text-lg font-abeze font-bold text-white mb-3">{faq.question}</h4>
                  <p className="text-gray-300 font-abeze text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUsPage;