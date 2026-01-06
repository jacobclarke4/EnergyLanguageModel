import { useState } from 'react'
import HeaderButton from './HeaderButton'
import NavigationLink from './NavigationLink'

const navLinks = [
  { href: '#challenge', label: 'Challenge' },
  { href: '#data', label: 'Data' },
  { href: '#users', label: 'Users' },
  { href: '#team', label: 'Team' },

]

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="top-0 relative z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4 gap-6 flex items-center relative z-50">
        <a href="#home" className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-white hover:text-white/80 transition-colors">
          ELM
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1">
          {navLinks.map((link) => (
            <NavigationLink key={link.href} href={link.href}>
              {link.label}
            </NavigationLink>
          ))}
        </div>
        
        {/* Desktop CTA */}
        <div className="hidden md:block ml-auto">
          <HeaderButton>Get Started</HeaderButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden ml-auto p-2 text-white"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Full Screen Overlay */}
      <div
        className={`
          md:hidden fixed inset-0 z-40
          bg-black/98 backdrop-blur-md
          transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white text-2xl font-medium transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 mt-4">
            <HeaderButton>Get Started</HeaderButton>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header