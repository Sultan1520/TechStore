import React, { useState, useRef } from 'react';
import { ShoppingCart, Search, Menu, X, Heart, Smartphone } from 'lucide-react';

const Header = ({ cartCount = 0, onCartUpdate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(() => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Ошибка чтения пользователя из localStorage", error);
    return null;
  }
});

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Здесь будет логика поиска
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TechStore</span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
              Главная
            </a>
            <a href="/products" className="text-gray-300 hover:text-blue-400 transition-colors">
              Товары
            </a>
              {user && user.username ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setOpen(!open)} className="text-gray-300 hover:text-blue-400 transition-colors">Привет, {user.username}!</button>
                  {open && (
                    <div className="absolute right-0 mt-2 bg-gray-800 rounded shadow-md z-50 w-32">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
                      >
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a href="/registration" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Войти
                </a>
              )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Favorites */}
            <button className="relative p-2 text-gray-300 hover:text-blue-400 transition-colors">
              <Heart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* Cart */}
            <a href="/cart" className="relative p-2 text-gray-300 hover:text-blue-400 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
              
              {/* Mobile Navigation */}
              <a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
              Главная
            </a>
            <a href="/products" className="text-gray-300 hover:text-blue-400 transition-colors">
              Товары
            </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;