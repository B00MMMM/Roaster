import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📧' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-orange-500/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent group-hover:animate-pulse transition-all duration-300">
                RoastMe
              </span>
            </div>
          </Link>
          
          <div className="flex space-x-1 ml-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                  location.pathname === item.path
                    ? 'text-orange-300'
                    : 'text-slate-300 hover:text-orange-300'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                
                {/* Illuminated underline */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 transition-all duration-300 ${
                  location.pathname === item.path 
                    ? 'opacity-100 scale-x-100' 
                    : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`}></div>
                
                {/* Glow effect for the underline */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 blur-sm transition-all duration-300 ${
                  location.pathname === item.path 
                    ? 'opacity-60 scale-x-100' 
                    : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'
                }`}></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
