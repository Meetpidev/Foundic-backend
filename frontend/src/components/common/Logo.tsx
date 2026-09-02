import { Link } from 'react-router-dom'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  clickable?: boolean
  variant?: 'dark' | 'light'
}

export default function Logo({ size = 'md', className = '', clickable = true, variant = 'light' }: LogoProps) {
  const isLight = variant === 'light'
  const textColor = isLight ? 'text-gray-900' : 'text-white'
  const networkColor = isLight ? 'text-[#2597a3]' : 'text-[#38b2bf]'

  const fontSizes = {
    sm: 'text-lg md:text-xl',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
  }

  const subtextSizes = {
    sm: 'text-[0.55rem] md:text-[0.6rem]',
    md: 'text-[0.6rem] md:text-[0.68rem]',
    lg: 'text-[0.68rem] md:text-[0.75rem]',
  }

  const content = (
    <div className={`inline-flex flex-col items-start leading-none group cursor-pointer ${className}`}>
      <div className="flex items-center font-bold tracking-tight select-none">
        <span className={`${fontSizes[size]} font-extrabold ${textColor} tracking-tight`}>F</span>
        {/* Custom 'o' Globe/Rocket Icon */}
        <div className="relative inline-flex items-center justify-center mx-[1px] w-[1.15em] h-[1.15em]">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* Outer Teal Globe Circle */}
            <path
              d="M 50 10 A 40 40 0 1 1 10 50 A 40 40 0 0 1 50 10"
              fill="none"
              stroke="#2597a3"
              strokeWidth="11"
            />
            {/* Filled Teal Globe Top Arc with Rocket Arrow */}
            <path
              d="M 22 58 C 22 35, 38 20, 62 20 L 78 20 L 78 36 C 78 60, 63 76, 40 76"
              fill="none"
              stroke="#2597a3"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Rocket Growth Arrow Inside 'o' */}
            <path
              d="M 28 62 L 52 38 M 52 38 L 38 38 M 52 38 L 52 52"
              fill="none"
              stroke="#2597a3"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bottom Dark Blue Pin / Wedge */}
            <polygon
              points="34,74 66,74 50,94"
              fill="#2e6d8a"
            />
          </svg>
        </div>
        <span className={`${fontSizes[size]} font-extrabold ${textColor} tracking-tight`}>und</span>
        {/* Custom 'i' with Teal Dot */}
        <span className="relative font-extrabold tracking-tight">
          <span className={`${fontSizes[size]} ${textColor}`}>i</span>
          <span className="absolute -top-[0.18em] left-1/2 -translate-x-1/2 w-[0.25em] h-[0.25em] bg-[#2597a3] rounded-full" />
        </span>
        <span className={`${fontSizes[size]} font-extrabold ${textColor} tracking-tight`}>c</span>
      </div>
      {/* Subtitle NETWORK */}
      <span className={`${subtextSizes[size]} font-bold tracking-[0.35em] uppercase ${networkColor} pl-[2px] mt-[1px]`}>
        NETWORK
      </span>
    </div>
  )

  if (clickable) {
    return <Link to="/" className="inline-block">{content}</Link>
  }

  return content
}
