import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
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
      link: '/shop',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'slide-2',
      badge: t('home.slides.slide2_badge'),
      title: t('home.slides.slide2_title'),
      desc: t('home.slides.slide2_desc'),
      btnText: t('home.slides.slide2_btn'),
      link: '/shop?category=chargers',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'slide-3',
      badge: t('home.slides.slide3_badge'),
      title: t('home.slides.slide3_title'),
      desc: t('home.slides.slide3_desc'),
      btnText: t('home.slides.slide3_btn'),
      link: '/shop?category=screen_protectors',
      image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80'
    }
  ];

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
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      <div className="relative w-full rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[330px] lg:min-h-[360px] bg-white dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] shadow-xs flex items-center">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={cn(
                'absolute inset-0 w-full h-full px-6 sm:px-12 lg:px-16 py-6 sm:py-8 flex items-center transition-opacity duration-500 ease-out',
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full">
                {/* Text Content */}
                <div className="md:col-span-7 space-y-3 pr-2 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[#EEEEFF] dark:bg-[#5B5BD6]/15 text-[#5B5BD6] dark:text-[#A5A5F5]">
                    {slide.badge}
                  </span>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#17191F] dark:text-[#F4F7FC] leading-tight">
                    {slide.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#737985] dark:text-[#9CA3AF] max-w-lg leading-relaxed line-clamp-2">
                    {slide.desc}
                  </p>

                  <div className="pt-2">
                    <Link to={slide.link}>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5B5BD6] hover:bg-[#4949BC] active:bg-[#3C3CA8] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
                      >
                        <span>{slide.btnText}</span>
                        <ArrowRight className="w-4 h-4 ml-0.5" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Product Image Stage */}
                <div className="hidden md:flex md:col-span-5 items-center justify-center">
                  <div className="relative w-full max-w-[280px] lg:max-w-[320px] h-[200px] sm:h-[230px] rounded-xl overflow-hidden bg-[#F7F8FA] dark:bg-[#15171D] border border-[#E6E8EE] dark:border-[#2A2E3B] p-2 flex items-center justify-center shadow-xs">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover object-center rounded-lg select-none"
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
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-lg bg-white/90 dark:bg-[#15171D]/90 border border-[#E6E8EE] dark:border-[#2A2E3B] text-[#17191F] dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-[#15171D] transition-colors cursor-pointer shadow-xs"
          aria-label="Oldingi slayd"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-lg bg-white/90 dark:bg-[#15171D]/90 border border-[#E6E8EE] dark:border-[#2A2E3B] text-[#17191F] dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-[#15171D] transition-colors cursor-pointer shadow-xs"
          aria-label="Keyingi slayd"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                'h-1.5 rounded-full transition-all cursor-pointer',
                idx === currentSlide ? 'w-5 bg-[#5B5BD6]' : 'w-1.5 bg-[#E6E8EE] dark:bg-[#2A2E3B]'
              )}
              aria-label={`Slayd ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
