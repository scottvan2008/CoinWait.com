import Image from "next/image"
import { LanguageSwitcher } from '../components/LanguageSwitcher'

interface HeaderProps {
  lng: string;
}

const Header = ({ lng }: HeaderProps) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Next.js logo"
            width={50}
            height={50}
            priority
          />

          {/* Language Switcher */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <LanguageSwitcher lng={lng} path="/" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header