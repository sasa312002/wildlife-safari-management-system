import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutUsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const teamMembers = [
    {
      name: "Kumara Perera",
      role: "Founder & Wildlife Expert",
      description: "With over 15 years of experience in wildlife hiking, Kumara leads our mission to explore Sri Lanka's natural heritage.",
expertise: "Elephant behavior, Hiking trails",
      image: "👨‍🦱"
    },
    {
      name: "Dr. Anjali Silva",
      role: "Hiking Director",
      description: "A PhD in Wildlife Biology, Dr. Silva oversees our research programs and community education initiatives.",
      expertise: "Research & Monitoring, Community Outreach",
      image: "👩‍🔬"
    },
    {
      name: "Ravi Mendis",
      role: "Safari Guide & Naturalist",
      description: "Born and raised near Yala National Park, Ravi has an intimate knowledge of Sri Lanka's wildlife and ecosystems.",
      expertise: "Bird watching, Photography tours",
      image: "👨‍🦰"
    },
    {
      name: "Priya Fernando",
      role: "Customer Experience Manager",
      description: "Ensuring every guest has an unforgettable and responsible wildlife experience in Sri Lanka.",
      expertise: "Sustainable tourism, Guest relations",
      image: "👩‍💼"
    }
  ];

  const values = [
    {
      title: t('about.values.hikingFirst.title'),
      description: t('about.values.hikingFirst.description'),
      icon: "🌱"
    },
    {
      title: t('about.values.localExpertise.title'),
      description: t('about.values.localExpertise.description'),
      icon: "🏠"
    },
    {
      title: t('about.values.sustainableTourism.title'),
      description: t('about.values.sustainableTourism.description'),
      icon: "♻️"
    },
    {
      title: t('about.values.authenticExperiences.title'),
      description: t('about.values.authenticExperiences.description'),
      icon: "✨"
    }
  ];

  const achievements = [
    {
      number: "10+",
      label: t('about.achievements.years'),
      description: t('about.achievements.yearsDesc')
    },
    {
      number: "5,000+",
      label: t('about.achievements.guests'),
      description: t('about.achievements.guestsDesc')
    },
    {
      number: "100%",
      label: t('about.achievements.safety'),
      description: t('about.achievements.safetyDesc')
    },
    {
      number: "15+",
      label: t('about.achievements.projects'),
      description: t('about.achievements.projectsDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      
      <div className="pt-20">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-abeze font-bold text-white mb-4">
              {t('about.title')} <span className="text-green-400">Wild Path</span>
            </h1>
            <p className="text-gray-300 text-lg font-abeze max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl font-abeze font-bold text-white mb-6">
                {t('about.story.title')}
              </h3>
              <div className="space-y-4 text-gray-300 font-abeze leading-relaxed">
                <p>
                  {t('about.story.founded')}
                </p>
                <p>
                  {t('about.story.founder')}
                </p>
                <p>
                  {t('about.story.today')}
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
              <h4 className="text-2xl font-abeze font-bold text-white mb-4">{t('about.mission.title')}</h4>
              <p className="text-gray-300 font-abeze mb-6">
                {t('about.mission.description')}
              </p>
              <h4 className="text-2xl font-abeze font-bold text-white mb-4">{t('about.vision.title')}</h4>
              <p className="text-gray-300 font-abeze">
                {t('about.vision.description')}
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h3 className="text-3xl font-abeze font-bold text-white text-center mb-12">
              {t('about.values.title')} <span className="text-green-400">Values</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="text-4xl mb-4 text-center">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-abeze font-bold text-white mb-3 text-center">
                    {value.title}
                  </h4>
                  <p className="text-gray-300 font-abeze text-sm text-center leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h3 className="text-3xl font-abeze font-bold text-white text-center mb-12">
              {t('about.team.title')} <span className="text-green-400">Team</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="text-6xl mb-4 text-center">
                    {member.image}
                  </div>
                  <h4 className="text-xl font-abeze font-bold text-white mb-2 text-center">
                    {member.name}
                  </h4>
                  <p className="text-green-400 font-abeze text-sm text-center mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-300 font-abeze text-sm text-center mb-3 leading-relaxed">
                    {member.description}
                  </p>
                  <div className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-center">
                    <span className="font-abeze font-medium text-xs">{member.expertise}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-abeze font-bold text-white text-center mb-12">
              {t('about.achievements.title')} <span className="text-green-400">Achievements</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="text-center bg-gradient-to-br from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30"
                >
                  <div className="text-4xl font-abeze font-bold text-green-400 mb-2">
                    {achievement.number}
                  </div>
                  <h4 className="text-xl font-abeze font-bold text-white mb-2">
                    {achievement.label}
                  </h4>
                  <p className="text-gray-300 font-abeze text-sm">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
              <h3 className="text-2xl font-abeze font-bold text-white mb-4">
                {t('about.cta.title')}
              </h3>
              <p className="text-gray-300 font-abeze mb-6 max-w-2xl mx-auto">
                {t('about.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-abeze font-bold transition-colors duration-300">
                  {t('about.cta.bookSafari')}
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 rounded-full font-abeze font-bold transition-all duration-300"
                >
                  {t('about.cta.contactUs')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage; 