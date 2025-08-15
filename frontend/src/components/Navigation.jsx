import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import LoginButton from './LoginButton';

export default function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📧' },
    { path: '/add-person', label: 'Add Person', icon: '👥' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav ref={menuRef} className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-orange-500/20 w-full relative">
      <div className="container mx-auto px-2 sm:px-4 flex items-center h-14 sm:h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent group-hover:animate-pulse transition-all duration-300">
              RoastMe
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (1473px and above) */}
        <div className="hidden xl:flex flex-1 justify-end items-center">
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center space-x-1 sm:space-x-2 md:space-x-3 
                  px-2 sm:px-4 md:px-5 
                  py-1 sm:py-2 md:py-3 
                  text-xs sm:text-sm md:text-base lg:text-lg 
                  font-medium transition-all duration-300 group 
                  ${
                    location.pathname === item.path
                      ? 'text-orange-300'
                      : 'text-slate-300 hover:text-orange-300'
                  }`}
              >
                <span className="text-sm sm:text-base md:text-lg lg:text-xl">{item.icon}</span>
                <span>{item.label}</span>

                {/* Underline effect */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 transition-all duration-300 
                    ${
                      location.pathname === item.path
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                    }`}
                ></div>

                {/* Glow effect */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 blur-sm transition-all duration-300 
                    ${
                      location.pathname === item.path
                        ? 'opacity-60 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'
                    }`}
                ></div>
              </Link>
            ))}
            
            {/* Desktop Login Button */}
            <div className="ml-2 sm:ml-4">
              <LoginButton />
            </div>
          </div>
        </div>

        {/* Medium Screen Layout (781px-1472px) - Three Lines with Login */}
        <div className="hidden md:flex xl:hidden flex-1 justify-end items-center gap-4">
          {/* Login Button positioned close to the left of hamburger */}
          <div>
            <LoginButton />
          </div>
          
          {/* Three-line hamburger menu */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-slate-300 hover:text-orange-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 rounded-md"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Hamburger Menu (below 781px) */}
        <div className="md:hidden flex-1 flex justify-end items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-slate-300 hover:text-orange-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 rounded-md"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </div>

      </div>

      {/* Mobile & Medium Screen Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm border-b border-orange-500/20 shadow-2xl z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 
                    ${
                      location.pathname === item.path
                        ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20'
                        : 'text-slate-300 hover:text-orange-300 hover:bg-slate-700/30'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {location.pathname === item.path && (
                    <div className="ml-auto w-2 h-2 bg-orange-400 rounded-full"></div>
                  )}
                </Link>
              ))}
              
              {/* Mobile Login Button */}
              <div className="pt-2 pb-2 border-t border-slate-700/50">
                <div className="px-4">
                  <LoginButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Overlay - Works for all screen sizes */}
      {isMobileMenuOpen && (
        <div 
          className="xl:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        ></div>
      )}
    </nav>
  );
}
