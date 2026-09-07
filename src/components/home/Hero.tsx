import { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export function Hero() {
  const { settings } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  // We fall back to the default paths if they are somehow missing
  const banner1 = settings.siteContent?.heroBanners?.banner1 || '/images/japastorebanner1.jpeg';
  const banner2 = settings.siteContent?.heroBanners?.banner2 || '/images/japastorebanner2.jpeg';
  const images = [banner1, banner2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full overflow-hidden bg-zinc-900">
      {/* Placeholder invisível para ditar a altura do container mantendo o aspect ratio original da imagem */}
      <img src={images[0]} alt="" aria-hidden="true" className="w-full h-auto invisible block pointer-events-none" />
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={img}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Dots for navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
