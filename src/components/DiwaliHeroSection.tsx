import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DiwaliServiceDialog } from './DiwaliServiceDialog';
import { Home, Car, Sparkles } from 'lucide-react';

export function DiwaliHeroSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleServiceClick = (service: string) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const services = [
    {
      title: 'House Cleaning',
      icon: Home,
      description: 'Complete deep cleaning for your home',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Vehicle Cleaning',
      icon: Car,
      description: 'Professional car washing & detailing',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'House Decoration',
      icon: Sparkles,
      description: 'Beautiful Diwali decorations',
      gradient: 'from-pink-500 to-purple-500',
    },
  ];

  return (
    <>
      <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Fireworks */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-orange-400 rounded-full animate-ping opacity-75 animation-delay-1000"></div>
          <div className="absolute top-40 left-1/4 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75 animation-delay-2000"></div>
          <div className="absolute top-32 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-75 animation-delay-1500"></div>
          
          {/* Floating Diyas */}
          <div className="absolute bottom-20 left-10 text-4xl animate-bounce-slow">🪔</div>
          <div className="absolute bottom-32 left-1/4 text-3xl animate-bounce-slow animation-delay-500">🪔</div>
          <div className="absolute bottom-28 right-1/4 text-4xl animate-bounce-slow animation-delay-1000">🪔</div>
          <div className="absolute bottom-24 right-10 text-3xl animate-bounce-slow animation-delay-1500">🪔</div>
          
          {/* Sparkles */}
          <div className="absolute top-1/4 left-1/3 text-2xl animate-pulse">✨</div>
          <div className="absolute top-1/3 right-1/4 text-xl animate-pulse animation-delay-700">✨</div>
          <div className="absolute bottom-1/3 left-1/5 text-2xl animate-pulse animation-delay-1200">✨</div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/30 to-gray-900/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
              <span className="text-white font-bold text-sm">🎆 DIWALI SPECIAL OFFER 🎆</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Celebrate Diwali with a
              <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Sparkling Clean Home
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-4">
              Get ready for the festival of lights! Book our special Diwali cleaning & decoration services.
            </p>
            <div className="flex items-center justify-center gap-2 text-yellow-300">
              <span className="text-2xl">🎊</span>
              <p className="text-lg font-medium">October slots available now!</p>
              <span className="text-2xl">🎊</span>
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="group relative overflow-hidden bg-gray-800/90 backdrop-blur border-2 border-yellow-500/30 hover:border-yellow-500 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/50 hover:-translate-y-2 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => handleServiceClick(service.title)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${service.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-6">
                      {service.description}
                    </p>
                    
                    <Button
                      className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white font-semibold shadow-lg group-hover:shadow-xl transition-all`}
                    >
                      Book Now 🎆
                    </Button>
                  </div>

                  {/* Decorative corner diyas */}
                  <div className="absolute top-2 right-2 text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                    🪔
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Bottom decoration */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur rounded-full border border-yellow-500/30">
              <span className="text-3xl animate-pulse">🎇</span>
              <p className="text-yellow-200 font-medium">
                Limited slots for October - Book early!
              </p>
              <span className="text-3xl animate-pulse">🎇</span>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 82.5C1200 85 1320 80 1380 77.5L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      <DiwaliServiceDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        serviceType={selectedService}
      />
    </>
  );
}
