import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, Download, Search, Filter, Calendar } from 'lucide-react';
import axios from 'axios';

const OrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/orders/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { icon: CheckCircle, text: 'Доставлен', color: 'text-green-400', bg: 'bg-green-400/20' },
      shipped: { icon: Truck, text: 'В пути', color: 'text-blue-400', bg: 'bg-blue-400/20' },
      processing: { icon: Clock, text: 'Обрабатывается', color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
      cancelled: { icon: XCircle, text: 'Отменен', color: 'text-red-400', bg: 'bg-red-400/20' }
    };
    return configs[status] || configs.processing;
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const OrderModal = ({ order, onClose }) => {
    if (!order) return null;

    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Детали заказа</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Информация о заказе */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Номер заказа</p>
                <p className="text-white font-semibold">{order.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Дата заказа</p>
                <p className="text-white font-semibold">{new Date(order.created_at).toLocaleDateString('ru-RU')}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Статус</p>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                  <span className={`${statusConfig.color} font-medium`}>{statusConfig.text}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Общая сумма</p>
                <p className="text-white font-bold text-lg">{order.total_price}</p>
              </div>
            </div>

            {/* Товары */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Товары ({order.total_quantity})</h3>
              <div className="space-y-3">
                {order.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-700/50 rounded-xl p-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{product.name}</h4>
                      <p className="text-gray-400 text-sm">Количество: {product.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{new Intl.NumberFormat('ru-RU').format(product.price * product.quantity)} ₸</p>
                      <p className="text-gray-400 text-sm">{new Intl.NumberFormat('ru-RU').format(product.price)} ₸ за шт.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Доставка */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Информация о доставке</h3>
              <div className="bg-gray-700/50 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Адрес доставки</p>
                  <p className="text-white">{order.address}</p>
                </div>
              </div>
            </div>

            {/* Действия */}
            <div className="flex gap-3 pt-4">
              <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Скачать чек
              </button>
              {order.status === 'shipped' && (
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4" />
                  Отследить
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Мои заказы</h1>
          <p className="text-gray-400">История ваших покупок и текущие заказы</p>
        </div>

        {/* Фильтры и поиск */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по номеру заказа или товару..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="all">Все статусы</option>
              <option value="processing">Обрабатывается</option>
              <option value="shipped">В пути</option>
              <option value="delivered">Доставлен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>
        </div>

        {/* Список заказов */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Заказы не найдены</h3>
              <p className="text-gray-400">Попробуйте изменить фильтры поиска</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={order.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-white">{order.id}</h3>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                          <span className={`text-sm font-medium ${statusConfig.color}`}>
                            {statusConfig.text}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Дата заказа</p>
                          <p className="text-white font-medium">
                            {new Date(order.created_at).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Товаров</p>
                          <p className="text-white font-medium">{order.total_quantity} шт.</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Сумма</p>
                          <p className="text-white font-bold text-lg">{order.total_price}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Подробнее
                      </button>
                      
                      {order.status === 'delivered' && (
                        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Чек
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Превью товаров */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-3 overflow-x-auto">
                      {order.products.slice(0, 3).map((product, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-700/50 rounded-lg p-2 min-w-fit">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="text-sm text-gray-300 whitespace-nowrap">{product.name}</span>
                        </div>
                      ))}
                      {order.products.length > 3 && (
                        <span className="text-sm text-gray-400 whitespace-nowrap">
                          +{order.products.length - 3} еще
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <OrderModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
};

export default OrdersPage;