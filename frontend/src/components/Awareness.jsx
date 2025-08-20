import React from 'react';
import { useNavigate } from 'react-router-dom';

const Awareness = () => {
  const navigate = useNavigate();

  const handleNavigateToDonate = () => {
    navigate('/donate');
    window.scrollTo(0, 0);
  };

  const hikingTopics = [
    {
      id: 1,
      title: "Elephant Hiking",
      description: "Learn about Sri Lanka's wild elephant population and the challenges they face in their natural habitat.",
      icon: "🐘",
      stats: "6,000+ wild elephants",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 2,
      title: "Leopard Protection",
      description: "Discover the importance of protecting Sri Lanka's apex predator and maintaining ecosystem balance.",
      icon: "🐆",
      stats: "800+ leopards in the wild",
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 3,
      title: "Bird Sanctuary",
      description: "Explore the diverse avian life of Sri Lanka, including endemic species found nowhere else on Earth.",
      icon: "🦜",
      stats: "450+ bird species",
      color: "from-lime-500 to-green-600"
    },
    {
      id: 4,
      title: "Marine Life",
      description: "Understand the importance of protecting Sri Lanka's coastal ecosystems and marine biodiversity.",
      icon: "🐋",
      stats: "28 whale species",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  const initiatives = [
    {
      title: "Community Education",
      description: "Working with local communities to promote wildlife hiking and sustainable tourism practices.",
      impact: "500+ families educated"
    },
    {
      title: "Habitat Restoration",
      description: "Restoring degraded habitats and creating wildlife corridors for safe animal movement.",
      impact: "1,000+ acres restored"
    },
    {
      title: "Anti-Poaching",
      description: "Supporting ranger programs and technology to prevent illegal hunting and wildlife trade.",
      impact: "24/7 monitoring"
    },
    {
      title: "Research & Monitoring",
      description: "Conducting scientific research to better understand and protect Sri Lanka's wildlife populations.",
      impact: "50+ research projects"
    }
  ];

  return (
    <section id="awareness" className="py-28 bg-gradient-to-br from-gray-900 via-green-950 to-gray-900">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeIn">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-abeze font-extrabold text-white mb-6 tracking-tight">
            Wildlife <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">Conservation</span>
          </h2>
          <p className="text-gray-200 text-lg md:text-xl lg:text-2xl font-abeze max-w-4xl mx-auto leading-relaxed">
            Join us in safeguarding Sri Lanka's extraordinary wildlife. Discover our conservation efforts, understand the challenges, and help preserve these natural treasures for generations to come.
          </p>
        </div>

        {/* Conservation Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {hikingTopics.map((topic, index) => (
            <div 
              key={topic.id}
              className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-green-400/10 hover:border-green-400/40 transition-all duration-500 hover:shadow-2xl hover:scale-105 animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 hover:opacity-20 transition-opacity duration-500" />
              {/* Icon */}
              <div className="text-6xl mb-4 text-center transform transition-transform duration-300 hover:scale-110">
                {topic.icon}
              </div>
              {/* Title */}
              <h3 className="text-xl font-abeze font-bold text-white mb-3 text-center">
                {topic.title}
              </h3>
              {/* Stats */}
              <div className={`bg-gradient-to-r ${topic.color} text-white text-center py-2 px-4 rounded-lg mb-4 font-abeze font-bold text-sm`}>
                {topic.stats}
              </div>
              {/* Description */}
              <p className="text-gray-300 font-abeze text-sm text-center leading-relaxed">
                {topic.description}
              </p>
            </div>
          ))}
        </div>

        {/* Conservation Initiatives */}
        <div className="mb-24">
          <h3 className="text-4xl md:text-5xl font-abeze font-extrabold text-white text-center mb-12 animate-fadeIn">
            Our <span className="text-green-400">Initiatives</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((initiative, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl rounded-xl p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-500 hover:shadow-xl animate-slideUp"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <h4 className="text-xl font-abeze font-bold text-white mb-3">
                  {initiative.title}
                </h4>
                <p className="text-gray-200 font-abeze mb-4 leading-relaxed text-sm">
                  {initiative.description}
                </p>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg inline-block font-abeze font-bold text-sm transform transition-transform duration-300 hover:scale-105">
                  {initiative.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-20 animate-fadeIn">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-2xl p-10 border border-green-400/20 hover:border-green-400/40 transition-all duration-500">
            <h3 className="text-3xl md:text-4xl font-abeze font-extrabold text-white mb-6">
              Be a Wildlife Champion
            </h3>
            <p className="text-gray-200 font-abeze mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
              Your support fuels habitat protection, anti-poaching efforts, community education, and groundbreaking research. Make a difference today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleNavigateToDonate}
                className="relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-4 rounded-full font-abeze font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                Support Wildlife
              </button>
              <button 
                onClick={handleNavigateToDonate}
                className="relative bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-10 py-4 rounded-full font-abeze font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Environmental Facts */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { stat: "25%", text: "Of Sri Lanka's land is protected for wildlife" },
            { stat: "26", text: "National parks and wildlife sanctuaries" },
            { stat: "100+", text: "Endemic species found only in Sri Lanka" }
          ].map((fact, index) => (
            <div 
              key={index}
              className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-green-400/10 animate-slideUp"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-5xl font-abeze font-extrabold text-green-400 mb-3">{fact.stat}</div>
              <p className="text-gray-200 font-abeze text-base leading-relaxed">{fact.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awareness;