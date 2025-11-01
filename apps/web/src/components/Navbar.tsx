'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="/assets/logo/sosyal-konut-app-logo.png"
              alt="Sosyal Konut App"
              className="h-14 md:h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={`/${locale}`}
              className="text-gray-700 hover:text-brand-teal transition-all duration-200 font-semibold text-base hover:scale-105"
            >
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/calculator`}
              className="text-gray-700 hover:text-brand-teal transition-all duration-200 font-semibold text-base hover:scale-105"
            >
              {t('calculator')}
            </Link>
            <Link
              href={`/${locale}/faq`}
              className="text-gray-700 hover:text-brand-teal transition-all duration-200 font-semibold text-base hover:scale-105"
            >
              {t('faq')}
            </Link>
          </nav>

          {/* Right Side Icons + Hamburger */}
          <div className="flex items-center space-x-4">
            {/* Social Icons - Always Visible */}
            <a
              href="https://github.com/measses/TokiCheck"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-brand-teal transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://buymeacoffee.com/mertaraz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-brand-coral transition-colors"
              aria-label="Buy Me a Coffee"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.174 1.736.24 2.391.27 4.815.332 7.21.068.897-.1 1.724-.37 2.276-1.035.407-.487.71-1.115.781-1.778a1.663 1.663 0 00-.498-1.371c-.325-.288-.75-.474-1.18-.572-1.06-.244-2.165-.338-3.267-.398a33.846 33.846 0 00-3.421.03c-.915.043-1.846.12-2.745.29-.614.116-1.278.293-1.632.81-.258.377-.187.847-.042 1.255.133.375.357.733.673.996.474.393 1.094.554 1.693.65 1.39.223 2.802.335 4.209.394 2.416.101 4.855-.002 7.25-.289.26-.032.517-.067.772-.107.434-.067.697-.426.693-.853-.003-.397-.333-.736-.677-.772z" />
              </svg>
            </a>

            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-brand-teal transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                // X Icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-slide-down">
            <div className="flex flex-col space-y-3">
              <Link
                href={`/${locale}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-brand-teal hover:bg-gray-50 transition-all duration-200 font-semibold text-base py-3 px-4 rounded-lg"
              >
                {t('home')}
              </Link>
              <Link
                href={`/${locale}/calculator`}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-brand-teal hover:bg-gray-50 transition-all duration-200 font-semibold text-base py-3 px-4 rounded-lg"
              >
                {t('calculator')}
              </Link>
              <Link
                href={`/${locale}/faq`}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-brand-teal hover:bg-gray-50 transition-all duration-200 font-semibold text-base py-3 px-4 rounded-lg"
              >
                {t('faq')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
