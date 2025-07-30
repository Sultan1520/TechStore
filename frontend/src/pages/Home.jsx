import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Star, Heart, Eye, ChevronLeft, ChevronRight, Smartphone, Headphones, Watch, Laptop, Camera, Gamepad2 } from 'lucide-react';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Данные для слайдера
  const slides = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      subtitle: "Титан. Настолько Pro.",
      price: "от 134 990 ₽",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      gradient: "from-purple-600 to-blue-600"
    },
    {
      id: 2,
      title: "Samsung Galaxy S24 Ultra",
      subtitle: "Искусственный интеллект нового поколения",
      price: "от 119 990 ₽",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      id: 3,
      title: "Google Pixel 8 Pro",
      subtitle: "Магия ИИ в каждом кадре",
      price: "от 89 990 ₽",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
      gradient: "from-green-600 to-teal-600"
    }
  ];

  // Популярные товары
  const featuredProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: "129 990 ₽",
      originalPrice: "139 990 ₽",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 1247,
      isNew: true
    },
    {
      id: 2,
      name: "Samsung Galaxy Buds Pro",
      price: "14 990 ₽",
      originalPrice: "19 990 ₽",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 856,
      isHot: true
    },
    {
      id: 3,
      name: "Apple Watch Series 9",
      price: "42 990 ₽",
      originalPrice: "49 990 ₽",
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 632,
      isNew: true
    },
    {
      id: 4,
      name: "MacBook Air M3",
      price: "134 990 ₽",
      originalPrice: "149 990 ₽",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 423,
      isHot: true
    }
  ];

  // Категории
  const categories = [
    { icon: Smartphone, name: "Смартфоны", count: 245, color: "bg-blue-100 text-blue-600" },
    { icon: Headphones, name: "Наушники", count: 186, color: "bg-purple-100 text-purple-600" },
    { icon: Watch, name: "Умные часы", count: 97, color: "bg-green-100 text-green-600" },
    { icon: Laptop, name: "Ноутбуки", count: 156, color: "bg-orange-100 text-orange-600" },
    { icon: Camera, name: "Фототехника", count: 78, color: "bg-red-100 text-red-600" },
    { icon: Gamepad2, name: "Игры", count: 234, color: "bg-indigo-100 text-indigo-600" }
  ];

  // Автоматическое переключение слайдов
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const addToCart = (product) => {
    setCartCount(prev => prev + 1);
    // Здесь будет логика добавления в корзину
  };


  return (
    <div className="min-h-screen bg-gray-900">
      

      {/* Hero Slider */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${slide.gradient} flex items-center`}>
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-xl md:text-2xl mb-6 opacity-90">{slide.subtitle}</p>
                    <p className="text-2xl md:text-3xl font-bold mb-8">{slide.price}</p>
                    <div className="flex space-x-4">
                      <button className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Купить сейчас
                      </button>
                      <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors">
                        Подробнее
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-80 object-cover rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Категории товаров</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-600 hover:border-blue-500"
              >
                <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.count} товаров</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Популярные товары</h2>
            <button className="text-blue-400 hover:text-blue-300 font-semibold">
              Смотреть все →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-700 hover:border-blue-500"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex space-x-2">
                    {product.isNew && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Новинка
                      </span>
                    )}
                    {product.isHot && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Хит
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400 ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-white">{product.price}</span>
                      <span className="text-sm text-gray-400 line-through ml-2">{product.originalPrice}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
                  >
                    В корзину
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Подпишитесь на новости</h2>
          <p className="text-xl text-white/90 mb-8">
            Получайте первыми информацию о новинках и специальных предложениях
          </p>
          <div className="max-w-md mx-auto flex space-x-4">
            <input
              type="email"
              placeholder="Ваш email"
              className="flex-1 px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder-gray-300 backdrop-blur-sm"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Подписаться
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

  export default Home;
  