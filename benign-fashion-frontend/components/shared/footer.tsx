import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Footer() {
  const [hovered, setHovered] = useState(false)

  const links = [
    'https://www.facebook.com',
    'https://www.facebook.com',
    'https://www.facebook.com',
  ]

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 mb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="font-bold text-blue-700 flex items-center space-x-2">
                  {/* Bengali text first */}

                  {/* Inline image beside the word “Anuka” */}
                  <span className="flex items-center space-x-1">
                    <Image
                      src="/logo.jpg" // ✅ replace with your image path
                      alt="Anuka Logo"
                      width={80}
                      height={100}
                      className="object-contain rounded-md"
                    />
                  </span>
                </span>
              </div>
            </Link>

            <div className="flex space-x-3 mt-10">
              <div
                className="relative flex items-center justify-center"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {/* ✅ Parent (Main Facebook Icon — Normal) */}
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 text-gray-600 hover:text-blue-600 bg-transparent"
                >
                  <Facebook className="w-5 h-5" />
                </Button>

                {/* ✅ Child Icons (Only these become big + blue on hover) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={
                    hovered
                      ? {
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          transition: { staggerChildren: 0.1 },
                        }
                      : { opacity: 0, scale: 0.8, y: 10 }
                  }
                  className="absolute top-8 flex gap-3 bg-white p-2 rounded-xl shadow-lg"
                >
                  {links.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <motion.div whileHover={{ scale: 1.15 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-11 h-11 text-blue-600 border-blue-400 hover:shadow-md hover:shadow-blue-200 bg-transparent transition-all duration-300 rounded-full"
                        >
                          <Facebook className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </motion.a>
                  ))}
                </motion.div>
              </div>

              <a
                href="https://www.youtube.com/" // replace with your actual YouTube link
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 text-gray-600 hover:text-blue-600 bg-transparent"
                >
                  <Youtube className="w-4 h-4" />
                </Button>
              </a>

              <a
                href="https://wa.me/+8801721811197"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 text-gray-600 hover:text-blue-600 bg-transparent"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Fresh Produce
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Dairy Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Meat & Poultry
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Spices & Condiments
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-8 h-8" />
                <span>
                  House # 64, Road # 04, Block # B, Chandgaon Residential Area,
                  Chittagong.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>01333-727648</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>benignfashion@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Benign Fashion. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
