import React from 'react'

const HeaderButton = ({ children }: { children: React.ReactNode }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a 
      href="#contact"
      onClick={handleClick}
      className="px-4 py-1.5 rounded-full font-bold text-black bg-white text-base cursor-pointer inline-block"
      style={{
        mixBlendMode: 'screen',
      }}
    >
      {children}
    </a>
  )
}

export default HeaderButton