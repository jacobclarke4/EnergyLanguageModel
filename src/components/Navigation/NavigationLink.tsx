interface NavigationLinkProps {
  href: string
  children: React.ReactNode
}

const NavigationLink = ({ href, children }: NavigationLinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <a
    
      href={href}
      onClick={handleClick}
      className="text-white font-bold px-4 py-2"

    >
      {children}
    </a>
  )
}

export default NavigationLink