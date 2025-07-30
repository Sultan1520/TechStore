import React, { useEffect, useState } from 'react';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, MessageCircle, Share2, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedStorage, setSelectedStorage] = useState('128GB');
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>Загрузка...</p>;

  const reviews = [
    {
      id: 1,
      user: 'Александр К.',
      rating: 5,
      date: '15 янв 2024',
      text: 'Отличный телефон, камера супер! Очень быстрый и качественный.',
      helpful: 12
    },
    {
      id: 2,
      user: 'Мария С.',
      rating: 4,
      date: '10 янв 2024',
      text: 'Хороший телефон, но цена кусается. В целом доволен покупкой.',
      helpful: 8
    },
    {
      id: 3,
      user: 'Дмитрий П.',
      rating: 5,
      date: '5 янв 2024',
      text: 'Лучший iPhone который у меня был. Рекомендую всем!',
      helpful: 15
    }
  ];

  const handleImageChange = (direction) => {
    if (direction === 'next') {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    } else {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleRatingSubmit = (rating) => {
    setUserRating(rating);
    console.log('Оценка отправлена:', rating);
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      storage: selectedStorage,
      quantity: quantity
    };
    console.log('Добавлено в корзину:', cartItem);
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-400'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Хлебные крошки */}
        <nav className="mb-8 text-sm text-gray-400">
          <span>Главная</span>
          <span className="mx-2">/</span>
          <span>Смартфоны</span>
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Галерея изображений */}
          <div className="flex-1 flex justify-center items-center bg-gray-900 rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md object-cover rounded-xl"
            />
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-400 mb-4">{product.company}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {/* {renderStars(Math.floor(product.rating))}
                  <span className="text-yellow-400 ml-1">{product.rating}</span> */}
                </div>
                {/* <span className="text-gray-400">({product.reviewCount} отзывов)</span> */}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-green-400">${product.price}</span>
                <span className="text-xl text-gray-400 line-through">${product.original_price}</span>
                <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                  -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </span>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-400">В наличии</span>
              </div>
            </div>

            {/* Выбор памяти */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Память:</h3>
              <div className="flex space-x-3">
                  <button
                    className={'px-4 py-2 rounded-lg border border-blue-500 bg-blue-500 bg-opacity-20'}
                  >
                    {product.storage}
                  </button>
              </div>
            </div>

            {/* Количество */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Количество:</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>В корзину</span>
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-lg border ${
                  isFavorite 
                    ? 'border-red-500 bg-red-500 bg-opacity-20' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
              </button>
              <button className="p-3 rounded-lg border border-gray-600 hover:border-gray-500">
                <Share2 className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Преимущества */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Быстрая доставка</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">Гарантия 2 года</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Возврат 30 дней</span>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Табы с информацией */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex space-x-8 mb-8">
            {['description', 'specs', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 font-semibold ${
                  activeTab === tab 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'description' && 'Описание'}
                {tab === 'specs' && 'Характеристики'}
                {tab === 'reviews' && 'Отзывы'}
              </button>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  iPhone 15 Pro представляет собой новую эру инноваций с революционным процессором A17 Pro, 
                  созданным по 3-нанометровой технологии. Титановый корпус делает устройство невероятно 
                  прочным и легким одновременно.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-4">Ключевые особенности:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-300">{product.text}</span>
                    </li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Основные характеристики</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Процессор</span>
                      <span>A17 Pro</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Экран</span>
                      <span>6.1" Super Retina XDR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Камера</span>
                      <span>48MP основная</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Батарея</span>
                      <span>До 23 часов видео</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Дополнительно</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Операционная система</span>
                      <span>iOS 17</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Вес</span>
                      <span>187 г</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Водозащита</span>
                      <span>IP68</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Зарядка</span>
                      <span>USB-C, беспроводная</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Оценить товар */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Оцените этот товар</h4>
                  <div className="flex items-center space-x-2 mb-4">
                    {renderStars(userRating, true, handleRatingSubmit)}
                    <span className="text-gray-400 ml-2">
                      {userRating > 0 ? `Ваша оценка: ${userRating}` : 'Нажмите на звезду'}
                    </span>
                  </div>
                  <textarea
                    placeholder="Напишите отзыв..."
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                    Отправить отзыв
                  </button>
                </div>

                {/* Отзывы */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-700 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">{review.user}</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm">{review.date}</span>
                      </div>
                      <p className="text-gray-300 mb-2">{review.text}</p>
                      <div className="flex items-center space-x-4">
                        <button className="text-gray-400 hover:text-white text-sm flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>Ответить</span>
                        </button>
                        <span className="text-gray-400 text-sm">Полезно: {review.helpful}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;