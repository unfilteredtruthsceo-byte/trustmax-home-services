import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Wrench, ShoppingBag } from 'lucide-react';
import { CategoryModal } from './CategoryModal';

export function CategoryHeroSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'services',
      title: 'Services',
      icon: Wrench,
      description: 'Professional cleaning & maintenance',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'packages',
      title: 'Packages',
      icon: Package,
      description: 'Bundled service packages',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'products',
      title: 'Products',
      icon: ShoppingBag,
      description: 'Furniture, decor & more',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <>
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Tivup
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our services, packages, and products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="group relative overflow-hidden bg-card border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${category.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6">
                      {category.description}
                    </p>
                    
                    <Button
                      className={`w-full bg-gradient-to-r ${category.gradient} hover:opacity-90 text-white font-semibold shadow-lg transition-all`}
                    >
                      View {category.title}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <CategoryModal
        category={selectedCategory}
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  );
}