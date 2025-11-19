'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
// import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const sliderImages = [
  {
    id: 1,
    src: '/organic-vegetables-and-fruits-banner.jpg',
    alt: 'Fresh Organic Produce',
    title: '100% Natural & Organic',
    subtitle:
      'Discover the finest selection of organic spices, natural products, and healthy foods delivered fresh to your doorstep.',
  },
  {
    id: 2,
    src: '/organic-spices-and-herbs-banner.jpg',
    alt: 'Organic Spices & Herbs',
    title: 'Premium Organic Spices',
    subtitle:
      'Enhance your cooking with our collection of authentic, organic spices sourced directly from farmers.',
  },
  {
    id: 3,
    src: '/organic-dairy-banner.png',
    alt: 'Organic Dairy Products',
    title: 'Farm Fresh Dairy',
    subtitle:
      'Pure, organic dairy products from grass-fed cows, delivered fresh to maintain quality and taste.',
  },
  {
    id: 4,
    src: '/organic-meat-and-poultry-banner.jpg',
    alt: 'Organic Meat & Poultry',
    title: 'Free-Range & Organic',
    subtitle:
      'Ethically sourced, hormone-free meat and poultry from certified organic farms.',
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
      className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-2 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-11/12 mx-auto px-4">
        <div className="relative h-[90vh] rounded-lg overflow-hidden">
          {/* Slider Images */}
          <div className="relative w-full h-full">
            {sliderImages.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={slide.src || '/placeholder.svg'}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-xl mb-8">{slide.subtitle}</p>
                    {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                      Shop Organic Now
                    </Button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 
              bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg
              transition-all duration-500 ease-in-out
              ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 
              bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg
              transition-all duration-500 ease-in-out
              ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
