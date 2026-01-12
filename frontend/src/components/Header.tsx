import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence for smooth exit
import { Moon, Sun, Menu, X, User, LogOut, Settings } from 'lucide-react';

// ✅ SAFE IMPORTS (Relative paths)
import { useAuth } from '../lib/AuthContext'; 
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate('/signin');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sessions', path: '/sessions' },
    { name: 'Developers', path: '/developers' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    // 💎 ULTRA GLASS EFFECT
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-500/5 transition-all duration-300 supports-[backdrop-filter]:bg-black/10">
      <div className="max-w-[100rem] mx-auto px-8 py-4">
        
        {/* 'relative' allows the absolute nav to center itself perfectly */}
        <div className="flex items-center justify-between relative">
          
          {/* --- LEFT: Logo --- */}
          <Link to="/" className="flex items-center gap-3 group z-20" onClick={() => setMobileMenuOpen(false)}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20"
            >
              <span className="text-white font-bold text-xl">AI</span>
            </motion.div>
            <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
              Intervue.ai
            </span>
          </Link>

          {/* --- CENTER: Desktop Nav (Hidden on Mobile) --- */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2 z-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative py-1 px-2 rounded-md hover:bg-white/5 ${
                  isActive(link.path) 
                    ? 'text-indigo-400 font-semibold' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* --- RIGHT: Actions --- */}
          <div className="flex items-center gap-4 z-20">
            {/* Desktop User Menu (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10 rounded-lg px-4 border border-transparent hover:border-white/5 transition-all">
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30">
                        <User className="w-4 h-4 text-indigo-400" />
                      </div>
                      <span className="text-sm font-medium">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 text-white w-56 shadow-2xl">
                    <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer focus:bg-white/10 my-1">
                      <Link to="/sessions" className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-indigo-400" /> My Sessions
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer my-1">
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-105">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Trigger Button */}
            <Button 
              variant="ghost" 
              className="md:hidden text-white hover:bg-white/10" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE MENU DROPDOWN (The missing part!) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-[#020617]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium py-2 px-4 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-white/10 my-2" />

              {/* Auth Buttons for Mobile */}
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 text-gray-400">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30">
                      <User className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-3 px-2">
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}