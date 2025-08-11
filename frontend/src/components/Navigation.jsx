import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📧' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-orange-500/20 w-full">
      <div className="container mx-auto px-2 sm:px-4 flex items-center h-14 sm:h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent group-hover:animate-pulse transition-all duration-300">
              RoastMe
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex-1 flex justify-end">
          <div className="flex space-x-1 sm:space-x-2 md:space-x-4">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
