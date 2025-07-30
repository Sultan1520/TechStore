import React, { useEffect, useState } from 'react';
import { Search, Filter, Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const url = selectedCategory
      ? `https://techstore-psov.onrender.com/api/products/?category=${selectedCategory}`
      : "https://techstore-psov.onrender.com/api/products/";

      fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Ошибка при загрузке продуктов:', err));
  }, []);

  useEffect(() => {
    fetch("https://techstore-psov.onrender.com/api/categories/")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-6 border-r border-gray-700">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Категории</h2>
            <nav className="space-y-2">
              <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex justify-between items-center ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span>Все товары</span>
                </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex justify-between items-center ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">
                    {category.product_count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">По названию</option>
                  <option value="price-low">Цена: по возрастанию</option>
                  <option value="price-high">Цена: по убыванию</option>
                  <option value="rating">По рейтингу</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {selectedCategory === 'all' 
                  ? 'Все товары' 
                  : categories.find(cat => cat.id === selectedCategory)?.name
                }
              </h1>
              <span className="text-gray-400">
                {sortedProducts.length} товаров найдено
              </span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <Link to={`/products/${product.id}`} className="block w-full h-full">
                <div className="relative w-full h-48 bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full h-48 object-contain"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.tags.map(tag => (
                      <span className={`${tag.color} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-gray-900 bg-opacity-80 p-2 rounded-full hover:bg-opacity-100">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-300 ml-1">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      ({product.reviews} отзывов)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-blue-400">
                        {new Intl.NumberFormat('ru-RU').format(product.price)}₸
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-gray-400 line-through">
                          {new Intl.NumberFormat('ru-RU').format(product.original_price)}₸
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    В корзину
                  </button>
                </div>
                </Link>
              </div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">
                Товары не найдены
              </div>
              <p className="text-gray-500 mt-2">
                Попробуйте изменить параметры поиска или выбрать другую категорию
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;