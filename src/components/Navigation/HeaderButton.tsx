import React from 'react'

const HeaderButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button 
      className="px-4 py-1.5 rounded-full font-bold text-black bg-white text-base"
      style={{
        mixBlendMode: 'screen',
      }}
    >
      {children}
    </button>
  )
}

export default HeaderButton