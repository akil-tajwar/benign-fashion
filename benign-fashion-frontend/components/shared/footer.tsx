'use client'

import { FaFacebookF, FaWhatsapp, FaTiktok, FaInstagram } from 'react-icons/fa'
import { FaThreads } from "react-icons/fa6";
import { CiYoutube } from "react-icons/ci";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 mt-12 sm:mt-16">
      <div className="w-4/5 mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-gray-400">
              Your trusted online store for quality fashion and kids clothing.
            </p>
            <div className='flex gap-3 items-center mt-6'>
              <Link href={'https://www.facebook.com/benignfashion'} target='_blank'><FaFacebookF className='border border-white w-7 h-7 p-1 rounded-lg'/></Link>
              <Link href={'https://www.instagram.com/benignfashion25/?hl=en'} target='_blank'><FaInstagram className='border border-white w-7 h-7 p-1 rounded-lg'/></Link>
              <Link href={'https://wa.me/+7701703133275'} target='_blank'><FaWhatsapp className='border border-white w-7 h-7 p-1 rounded-lg'/></Link>
              <Link href={'https://www.threads.com/@benignfashion25?hl=en'} target='_blank'><FaThreads className='border border-white w-7 h-7 p-1 rounded-lg'/></Link>
              <Link href={'https://www.youtube.com/@benignfashion'} target='_blank'><CiYoutube className='border border-white w-7 h-7 p-1 rounded-lg'/></Link>
              <Link href={'https://www.tiktok.com/@benign.fashion?is_from_webapp=1&sender_device=pc'} target='_blank'><FaTiktok className='border border-white w-7 h-7 p-1 rounded-lg'/></Link>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@store.com</li>
              <li>Phone: +880 1700 000000</li>
              <li>Address: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Your Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
