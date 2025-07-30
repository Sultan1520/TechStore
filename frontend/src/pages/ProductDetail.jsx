import React, { useEffect, useState } from 'react';
import { Star, Heart, ShoppingCart, MessageCircle, Truck, Share2, Plus, Minus, RefreshCw} from 'lucide-react';
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

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:8000/api/cart/',
        {
          product_id: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      alert('Товар добавлен в корзину!');
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      if (error.response?.status === 401) {
        alert('Пожалуйста, войдите в аккаунт.');
      }
    }
  };

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
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Хлебные крошки */}
        <nav className="mb-8 text-sm text-gray-400">
          <span>Главная</span> <span className="mx-2">/</span>
          <span>Каталог</span> <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Верхняя часть: фото + инфо */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-800 rounded-2xl p-6 shadow-lg">
          {/* Фото */}
          <div className="flex justify-center items-center bg-gray-900 rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md object-cover rounded-xl"
            />
          </div>

          {/* Описание */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            <p className="text-gray-400">от {product.company}</p>
            <div className="flex items-center space-x-2">
              {renderStars(product.rating || 0)}
              <span className="text-yellow-400 ml-1">{product.rating}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-blue-400">
                {new Intl.NumberFormat('ru-RU').format(product.price)}₸
              </span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {new Intl.NumberFormat('ru-RU').format(product.original_price)}₸
                    </span>
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                    -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2 mb-6">
                {product.in_stock ? (
                <span className="text-green-400">В наличии</span>
                ) : (
                <span className="text-red-400">Нет наличии</span>
                )
                }
            </div>

            <div>
              <div className="flex space-x-3">
                <h3 className="text-lg font-semibold mb-3">Цвет:</h3>
                  <button
                    className={'px-4 py-2 rounded-lg border border-blue-500 bg-gradient-to-br from-purple-500 to-pink-500'}
                  >
                    {product.color}
                  </button>
              </div>
            </div>

            <div>
              <div className="flex space-x-3">
                <h3 className="text-lg font-semibold mb-3">Память:</h3>
                  <button
                    className={'px-4 py-2 rounded-lg border border-blue-500 bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20'}
                  >
                    {product.storage}
                  </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                <Minus />
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                <Plus />
              </button>
            </div>

            <div className="flex gap-4">
              <button onClick={addToCart} className="bg-gradient-to-br from-purple-500 to-pink-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center gap-2">
                <ShoppingCart /> В корзину
              </button>
              <button onClick={() => setIsFavorite(!isFavorite)} className="p-3 rounded-lg border border-gray-600 hover:border-gray-500">
                <Heart className={`${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
              </button>
              <button className="p-3 rounded-lg border border-gray-600 hover:border-gray-500">
                <Share2 className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-1 text-sm text-gray-300 pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>В наличии: {product.count} шт.</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-red-400" />
                <span>Бесплатная доставка от 10 000₸</span>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-blue-400" />
                <span>Гарантия возврата 30 дней</span>
              </div>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="mt-10">
          <div className="flex space-x-8 mb-6">
            {['description', 'specs', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 font-semibold ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                {tab === 'description' && 'Описание'}
                {tab === 'specs' && 'Характеристики'}
                {tab === 'reviews' && 'Отзывы'}
              </button>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            {activeTab === 'description' && (
              <p className="text-gray-300 leading-relaxed">{product.description || 'Нет описания.'}</p>
            )}

            {activeTab === 'specs' && product.specifications?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                <div>
                  <h4 className="font-semibold mb-4">Основные характеристики</h4>
                  <div className="space-y-2">
                     {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between"><span>{spec.name}</span><span>{spec.value}</span></div>
                     ))}
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