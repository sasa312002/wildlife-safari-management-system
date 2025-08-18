import React from 'react';
import { useNavigate } from 'react-router-dom';

const Awareness = () => {
  const navigate = useNavigate();

  const handleNavigateToDonate = () => {
    navigate('/donate');
    // Scroll to top when navigating to donate page
    window.scrollTo(0, 0);
  };
  const hikingTopics = [
    {
      id: 1,
      title: "Elephant Hiking",
      description: "Learn about Sri Lanka's wild elephant population and the challenges they face in their natural habitat.",
      icon: "🐘",
      stats: "6,000+ wild elephants",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Leopard Protection",
      description: "Discover the importance of protecting Sri Lanka's apex predator and maintaining ecosystem balance.",
      icon: "🐆",
      stats: "800+ leopards in the wild",
      color: "from-orange-500 to-orange-600"
    },
    {
      id: 3,
      title: "Bird Sanctuary",
      description: "Explore the diverse avian life of Sri Lanka, including endemic species found nowhere else on Earth.",
      icon: "🦜",
      stats: "450+ bird species",
      color: "from-green-500 to-green-600"
    },
    {
      id: 4,
      title: "Marine Life",
      description: "Understand the importance of protecting Sri Lanka's coastal ecosystems and marine biodiversity.",
      icon: "🐋",
      stats: "28 whale species",
      color: "from-purple-500 to-purple-600"
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
    <section id="awareness" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-abeze font-bold text-white mb-4">
            Wildlife <span className="text-green-400">Conservation</span>
          </h2>
          <p className="text-gray-300 text-lg font-abeze max-w-3xl mx-auto">
            Join us in protecting Sri Lanka's precious wildlife heritage. Learn about conservation efforts, 
            environmental challenges, and how you can contribute to preserving our natural wonders for future generations.
          </p>
        </div>

        {/* Conservation Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {hikingTopics.map((topic) => (
            <div 
              key={topic.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 text-center">
                {topic.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-abeze font-bold text-white mb-3 text-center">
                {topic.title}
              </h3>

              {/* Stats */}
              <div className={`bg-gradient-to-r ${topic.color} text-white text-center py-2 px-4 rounded-lg mb-4`}>
                <span className="font-abeze font-bold text-sm">{topic.stats}</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 font-abeze text-sm text-center leading-relaxed">
                {topic.description}
              </p>
            </div>
          ))}
        </div>

        {/* Conservation Initiatives */}
        <div className="mb-16">
          <h3 className="text-3xl font-abeze font-bold text-white text-center mb-12">
            Our <span className="text-green-400">Conservation Initiatives</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {initiatives.map((initiative, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30"
              >
                <h4 className="text-xl font-abeze font-bold text-white mb-3">
                  {initiative.title}
                </h4>
                <p className="text-gray-300 font-abeze mb-4 leading-relaxed">
                  {initiative.description}
                </p>
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg inline-block">
                  <span className="font-abeze font-bold text-sm">{initiative.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
            <h3 className="text-2xl font-abeze font-bold text-white mb-4">
              Be Part of the Solution
            </h3>
            <p className="text-gray-300 font-abeze mb-6 max-w-2xl mx-auto">
              Every donation directly supports wildlife conservation efforts. 
              Your contribution funds habitat protection, anti-poaching measures, community education programs, and scientific research.
            </p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button 
                 onClick={handleNavigateToDonate}
                 className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-abeze font-bold transition-colors duration-300"
               >
                 Support Wildlife
               </button>
               <button 
                 onClick={handleNavigateToDonate}
                 className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 rounded-full font-abeze font-bold transition-all duration-300"
               >
                 Learn More
               </button>
             </div>
          </div>
        </div>

        {/* Environmental Facts */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-abeze font-bold text-green-400 mb-2">25%</div>
            <p className="text-gray-300 font-abeze">Of Sri Lanka's land is protected for wildlife</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-abeze font-bold text-green-400 mb-2">26</div>
            <p className="text-gray-300 font-abeze">National parks and wildlife sanctuaries</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-abeze font-bold text-green-400 mb-2">100+</div>
            <p className="text-gray-300 font-abeze">Endemic species found only in Sri Lanka</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awareness; 