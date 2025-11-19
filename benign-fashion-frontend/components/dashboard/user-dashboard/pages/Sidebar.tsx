'use client'

import React from 'react'

type SidebarProps = {
  activePage: 'profile' | 'orders' | 'carts'
  setActivePage: React.Dispatch<React.SetStateAction<'profile' | 'orders' | 'carts'>>
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <aside className="w-64 bg-white shadow-md p-5 flex flex-col">
      <h2 className="text-xl font-bold text-blue-600 mb-6">User Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        {['profile', 'orders', 'carts'].map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page as 'profile' | 'orders' | 'carts')}
            className={`px-4 py-2 rounded-md text-left transition-colors ${
              activePage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-blue-50'
            }`}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
