'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const sliderImages = [
  {
    id: 1,
    src: '/men1.jpg',
    alt: "Elegant Men's Formal Shirt",
    title: 'Premium Cotton Collection',
    subtitle:
      'Discover our tailored formal shirts, crafted from breathable premium cotton for all-day comfort and a sharp, professional look.',
  },
  {
    id: 2,
    src: '/men2.jpg',
    alt: "Men's Embroidered Panjabi",
    title: 'Traditional Elegance',
    subtitle:
      'Embrace heritage with our hand-embroidered panjabis, featuring intricate designs and luxurious fabrics perfect for festive occasions.',
  },
  {
    id: 3,
    src: '/kids1.jpg',
    alt: "Colorful Kids' Shirts",
    title: 'Playful & Durable',
    subtitle:
      'Vibrant and soft shirts for kids, designed with fun patterns and stretchable fabric to keep up with their active adventures.',
  },
  {
    id: 4,
    src: '/kids2.jpg',
    alt: "Kids' Traditional Panjabi Set",
    title: 'Festive Little Ones',
    subtitle:
      'Adorable matching panjabi sets for children, combining traditional charm with comfortable fits for family celebrations and Eid festivities.',
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [isHovered])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
    )
  }

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Remove your max-w-11/12 wrapper — slider must be full width */}
      <div className="w-full">
        <div className="relative w-full h-[90vh] overflow-hidden">
          {/* SLIDER TRACK */}
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderImages.map((slide) => (
              <div
                key={slide.id}
                className="w-full h-full flex-shrink-0 relative"
                style={{ minWidth: '100%' }} // <-- IMPORTANT
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-xl mb-8">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 
          bg-white/80 hover:bg-white rounded-full p-2 shadow-lg
          transition-all duration-500
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 
          bg-white/80 hover:bg-white rounded-full p-2 shadow-lg
          transition-all duration-500
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all
            ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
