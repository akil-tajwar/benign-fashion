'use client'

import { FaFacebookF, FaWhatsapp, FaTiktok, FaInstagram } from 'react-icons/fa'
import { FaThreads } from 'react-icons/fa6'
import { CiYoutube } from 'react-icons/ci'
import Link from 'next/link'

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
            <div className="flex gap-3 items-center mt-6">
              <Link href="https://wa.me/+8801703133275" target="_blank">
                <FaWhatsapp className="w-7 h-7 text-white p-1 rounded-lg border border-[#25D366] bg-[#25D366]" />
              </Link>
              <Link
                href="https://www.facebook.com/benignfashion"
                target="_blank"
              >
                <FaFacebookF className="w-7 h-7 text-white p-1 rounded-lg border border-[#1877F2] bg-[#1877F2]" />
              </Link>

              <Link
                href="https://www.instagram.com/benignfashion25/?hl=en"
                target="_blank"
              >
                <FaInstagram
                  className=" w-7 h-7 p-1 rounded-lg text-white bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]
  "
                />
              </Link>

              <Link
                href="https://www.threads.com/@benignfashion25?hl=en"
                target="_blank"
              >
                <FaThreads className="w-7 h-7 text-white p-1 rounded-lg border border-black bg-black" />
              </Link>

              <Link
                href="https://www.youtube.com/@benignfashion"
                target="_blank"
              >
                <CiYoutube className="w-7 h-7 text-white p-1 rounded-lg border border-[#FF0000] bg-[#FF0000]" />
              </Link>

              <Link
                href="https://www.tiktok.com/@benign.fashion?is_from_webapp=1&sender_device=pc"
                target="_blank"
              >
                <FaTiktok className="w-7 h-7 text-white p-1 rounded-lg border border-[#010101] bg-[#010101]" />
              </Link>
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
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: benignfashion@gmail.com</li>
              <li>Phone: +8801703133275</li>
              <li>
                Outlet-1: Shop no #423,Level 4,Finlay South City, Bahaddarhat
                Circle,Chattagram.
              </li>
              <li>
                Outlet-2: Shop #417-418 (4th Floor) Kohinoor City, Dampara,
                Chattogram
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-10 text-center text-gray-400">
          <p className="text-sm">
            &copy; 2025 Benign Fashion. All rights reserved.
          </p>
          <div className="text-xs text-gray-500">
            site by:{' '}
            <Link
              target="_blank"
              href={'https://akiltajwarchowdhury.netlify.app/'}
              className="text-green-700 hover:text-green-600"
            >
              Akil Tajwar
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
