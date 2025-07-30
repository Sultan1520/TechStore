import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('https://techstore-psov.onrender.com/api/cart/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setCartItems(res.data);
      } catch (error) {
        console.error('Ошибка загрузки корзины', error);
      }
    };

    fetchCart();
  }, []);

  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await axios.post('https://techstore-psov.onrender.com/checkout/', {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      localStorage.removeItem('cart'); 
      
      navigate('/orders');
    } catch (error) {
      console.error(error);
      alert('Ошибка при оформлении заказа');
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = async (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
    try {
      await axios.delete(`https://techstore-psov.onrender.com/api/cart/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      // Обновляем локальный стейт, убирая удалённый элемент
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Ошибка при удалении позиции', err);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="mx-auto w-16 h-16 text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Корзина пуста</h2>
          <p className="text-gray-400 mb-6">Добавьте товары для продолжения покупок</p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
            Перейти к покупкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Корзина товаров</h1>
          <p className="text-gray-400">
            {getTotalItems()} {getTotalItems() === 1 ? 'товар' : getTotalItems() < 5 ? 'товара' : 'товаров'} в корзине
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <div className="flex gap-4">
                  {/* Изображение товара */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product_image}
                      alt={item.product_title}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  </div>

                  {/* Информация о товаре */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm text-gray-400">{item.category}</p>
                        <h3 className="text-lg font-semibold text-white truncate">{item.product_title}</h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Управление количеством */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Цена */}
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{new Intl.NumberFormat('ru-RU').format(item.product_price)}₸ за шт.</p>
                        <p className="text-lg font-bold text-white">{new Intl.NumberFormat('ru-RU').format(item.product_price * item.quantity)}₸</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Итого и оформление заказа */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Итого</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Товары ({getTotalItems()})</span>
                  <span>{new Intl.NumberFormat('ru-RU').format(getTotalPrice())}₸</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Доставка</span>
                  <span className="text-green-400">Бесплатно</span>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>К оплате</span>
                    <span>{new Intl.NumberFormat('ru-RU').format(getTotalPrice())}₸</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 mb-4">
                Оформить заказ
              </button>

              <button onClick={handleCheckout} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-colors duration-200">
                Продолжить покупки
              </button>

              {/* Преимущества */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Бесплатная доставка</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Гарантия возврата 30 дней</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Поддержка 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;