import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users, AlertCircle, MessageSquare } from 'lucide-react';

const Navbar = ({ children }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: 'Menu', path: '/', icon: Home },
    { name: 'Employee', path: '/employee', icon: Users },
    { name: 'Out of Stock', path: '/out-of-stock', icon: AlertCircle },
    { name: 'Comments', path: '/comments', icon: MessageSquare },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 
          text-white shadow-2xl z-40 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/images.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Akaka Coffee
              </h1>
            </div>
          )}
          
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
          
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-3 rounded-xl
                      transition-all duration-200 ease-in-out group relative
                      ${isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                    )}
                    
                    <Icon 
                      size={20} 
                      className={`
                        transition-transform duration-200 min-w-5
                        ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                      `}
                    />
                    
                    {!isCollapsed && (
                      <span className="font-medium transition-all duration-200">
                        {item.name}
                      </span>
                    )}
                    
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45" />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div 
        className={`
          flex-1 min-h-screen transition-all duration-300
          ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
          pt-16 lg:pt-4 px-4 lg:px-6
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default Navbar;
