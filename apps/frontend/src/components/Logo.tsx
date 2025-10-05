import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
}

const sizeMap = {
  sm: { width: 80, height: 27 },
  md: { width: 120, height: 40 },
  lg: { width: 160, height: 53 },
}

export default function Logo({ size = 'md', className = '', href = '/' }: LogoProps) {
  const { width, height } = sizeMap[size]

  const logoContent = (
    <div className={`relative ${className}`}>
      {/* Logo PNG */}
      <Image
        src="/EvolucaoFit.png"
        alt="EvolucaoFit"
        width={width}
        height={height}
        priority
        className="object-contain hover:scale-105 transition-transform duration-300"
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="group">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
