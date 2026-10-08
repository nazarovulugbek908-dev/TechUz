import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function HeroCarousel() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-1',
      badge: t('home.slides.slide1_badge'),
      title: t('home.slides.slide1_title'),
      desc: t('home.slides.slide1_desc'),
      btnText: t('home.slides.slide1_btn'),
      link: '/shop?category=cases',
      bgGradient: 'from-zinc-950 via-zinc-900 to-orange-950',
      image: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'slide-2',
      badge: t('home.slides.slide2_badge'),
      title: t('home.slides.slide2_title'),
      desc: t('home.slides.slide2_desc'),
      btnText: t('home.slides.slide2_btn'),
      link: '/shop?category=chargers',
      bgGradient: 'from-slate-950 via-slate-900 to-amber-950',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'slide-3',
      badge: t('home.slides.slide3_badge'),
      title: t('home.slides.slide3_title'),
      desc: t('home.slides.slide3_desc'),
      btnText: t('home.slides.slide3_btn'),
      link: '/shop?category=screen_protectors',
      bgGradient: 'from-neutral-950 via-zinc-900 to-orange-900',
      image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] bg-slate-900 text-white flex items-center">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={cn(
                'absolute inset-0 w-full h-full p-6 sm:p-10 lg:p-14 flex items-center bg-linear-to-r transition-all duration-700 ease-out',
                slide.bgGradient,
                isActive ? 'opacity-100 scale-100 z-10 pointer-events-auto' : 'opacity-0 scale-95 z-0 pointer-events-none'
              )}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                {/* Text Content */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FF7A00] text-xs font-black uppercase tracking-wider border border-white/10">
                    <span>{slide.badge}</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight tracking-tight text-white">
                    {slide.title}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
                    {slide.desc}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <Link to={slide.link}>
                      <Button variant="primary" size="lg" icon={ShoppingBag}>
                        {slide.btnText}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
                  <div className="relative w-full max-w-sm aspect-4/3 rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-2 shadow-2xl">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#FF7A00] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          aria-label="Oldingi slayd"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#FF7A00] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          aria-label="Keyingi slayd"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                'h-2 rounded-full transition-all cursor-pointer',
                idx === currentSlide ? 'w-8 bg-[#FF7A00]' : 'w-2 bg-white/40 hover:bg-white/70'
              )}
              aria-label={`Slayd ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
