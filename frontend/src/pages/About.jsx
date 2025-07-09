import React, { useState, useEffect } from 'react';
import { ChevronDown, Coffee, Heart, Users, Mountain, Sun, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../component/Footer';

const About = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      id: 'hero',
      title: 'The Legend of Kaldi',
      content: 'Under the soft morning light of Ethiopia\'s highlands, there grows a special coffee bean that tells an old, proud story.',
      image: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=800&h=600&fit=crop',
      icon: <Mountain className="w-8 h-8" />
    },
    {
      id: 'origin',
      title: 'Ancient Forests of Yayu',
      content: 'Long ago in the forests of Yayu, wild coffee plants grew free and strong. A young goat herder named Kaldi noticed his goats became lively after eating bright red berries.',
      image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
      icon: <Leaf className="w-8 h-8" />
    },
    {
      id: 'discovery',
      title: 'The Sacred Discovery',
      content: 'Curious, he tasted one too—and felt a spark of energy and joy. This moment changed the world forever, giving birth to the coffee culture we cherish today.',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
      icon: <Sun className="w-8 h-8" />
    },
    {
      id: 'today',
      title: 'Keeping the Spark Alive',
      content: 'Today at Akaka Coffee, we keep that spark alive. Our beans come from small farms in Sidama and Kafa, where families pick each cherry by hand.',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
      icon: <Heart className="w-8 h-8" />
    },
    {
      id: 'ceremony',
      title: 'The Sacred Ceremony',
      content: 'When you visit Akaka Coffee, you join an old celebration called the coffee ceremony. We roast green beans in a flat pan over charcoal, then grind them fresh and brew in a clay pot called a jebena.',
      image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&h=600&fit=crop',
      icon: <Coffee className="w-8 h-8" />
    }
  ];

  const features = [
    {
      title: 'Hand-Picked Excellence',
      description: 'Each cherry is carefully selected by skilled hands at dawn',
      icon: '🌅'
    },
    {
      title: 'Sun-Dried Perfection',
      description: 'Naturally dried under the Ethiopian highlands sun',
      icon: '☀️'
    },
    {
      title: 'Small-Batch Roasting',
      description: 'Roasted in small batches to preserve unique flavors',
      icon: '🔥'
    },
    {
      title: 'Ceremonial Tradition',
      description: 'Honoring the ancient Ethiopian coffee ceremony',
      icon: '🫖'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=1920&h=1080&fit=crop)',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-8 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent animate-pulse">
            Akaka Coffee
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed font-light">
            Where ancient legends meet modern passion
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <div className="w-16 h-1 bg-amber-400 rounded-full"></div>
            <div className="w-8 h-1 bg-orange-400 rounded-full"></div>
            <div className="w-4 h-1 bg-red-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Story Sections */}
      <div className="relative">
        {sections.map((section, index) => (
          <div 
            key={section.id}
            className={`min-h-screen flex items-center ${
              index % 2 === 0 ? 'bg-gradient-to-r from-amber-100 to-orange-100' : 'bg-gradient-to-r from-orange-100 to-red-100'
            }`}
          >
            <div className="container mx-auto px-8 py-20">
              <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16`}>
                <div className="flex-1">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                      {section.icon}
                    </div>
                    <div className="h-px bg-gradient-to-r from-amber-400 to-orange-400 flex-1"></div>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 leading-tight">
                    {section.title}
                  </h2>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-8 font-light">
                    {section.content}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Chapter {index + 1} of our story
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mt-8 md:mt-0">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <img 
                      src={section.image}
                      alt={section.title}
                      className="relative w-full h-64 sm:h-80 md:h-96 object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-gradient-to-br from-amber-900 to-orange-900">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Sacred Process
            </h2>
            <p className="text-xl text-amber-200 font-light">
              Every cup carries the wisdom of generations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-amber-200 font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Flavors Section */}
      <div className="py-20 bg-gradient-to-br from-orange-900 to-red-900">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Highland Flavors
            </h2>
            <p className="text-xl text-orange-200 font-light">
              Taste the essence of Ethiopian highlands in every sip
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { flavor: 'Sweet Honey', icon: '🍯', description: 'Natural sweetness from highland flowers' },
                { flavor: 'Soft Jasmine', icon: '🌸', description: 'Delicate floral notes that dance on your palate' },
                { flavor: 'Berry Hint', icon: '🫐', description: 'Subtle fruit undertones from wild berries' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.flavor}</h3>
                  <p className="text-orange-200 font-light">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;