import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Github } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';


const Registration = () => {
  const [message, setMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    username: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from.pathname  || '/';


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const handleSubmit = async e => {
  e.preventDefault();
  setFormErrors({});
  setMessage('');

  const url = isLogin
    ? 'http://localhost:8000/api/accounts/login/'
    : 'http://localhost:8000/api/accounts/register/';

  // Подготовка данных
  const payload = {
    email: formData.email,
    password: formData.password,
  };

  if (!isLogin) {
    payload.username = formData.username;
    payload.confirm_password = formData.confirm_password;
  }

  try {
    const res = await axios.post(url, payload);

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    if (isLogin) {
      setMessage('Вы вошли! Токен: ' + res.data.token);
    } else {
      setMessage('Успешно зарегистрированы! Токен: ' + res.data.token);
    }
    navigate(from, { replace: true });

  } catch (err) {
    if (err.response?.data) {
      const rawErrors = err.response.data;
      const fieldErrors = {};

      for (const key in rawErrors) {
        fieldErrors[key] = rawErrors[key];
      }

      setFormErrors(fieldErrors);
      setMessage(isLogin ? 'Ошибка при входе' : 'Ошибка при регистрации');
    } else {
      setMessage('Произошла неизвестная ошибка');
    }
  }
};


  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
    email: '',
    password: '',
    confirm_password: '',
    username: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Логотип */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Войдите в свой аккаунт' : 'Создать аккаунт'}
            </h1>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
            {formErrors.non_field_errors && (
              <div className="text-red-500 text-sm mt-2">
                {formErrors.non_field_errors.map((msg, i) => (
                  <p key={i}>{msg}</p>
                ))}
              </div>
            )}
            {/* Поля для регистрации */}
            {!isLogin && (
              <div className="grid">
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Имя"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                   {formErrors.username && (
                    <p className="text-red-500 text-sm mt-2">
                      {formErrors.username}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {formErrors.email && (
                    <p className="text-red-500 text-sm mt-2">
                      {formErrors.email}
                    </p>
                  )}
            </div>

            {/* Пароль */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Пароль"
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {formErrors.password && Array.isArray(formErrors.password) && (
                <ul className="text-red-500 text-sm mt-2 space-y-1 list-disc pl-5">
                  {formErrors.password.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
              {formErrors.password && typeof formErrors.password === 'string' && (
                <p className="text-red-500 text-sm mt-2">{formErrors.password}</p>
              )}
            </div>

            {/* Подтверждение пароля */}
            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  placeholder="Подтвердите пароль"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formErrors.confirm_password && (
                    <p className="text-red-500 text-sm mt-2">
                      {formErrors.confirm_password}
                    </p>
                  )}
              </div>
            )}

            {/* Запомнить меня */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Запомнить меня</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Забыли пароль?
                </button>
              </div>
            )}

            {/* Кнопка входа/регистрации */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
            >
              {isLogin ? 'Войти' : 'Создать аккаунт'}
            </button>

            {/* Разделитель */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">или</span>
              </div>
            </div>

            {/* Социальные кнопки */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>
            </form>
          </div>

          {/* Переключение режима */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button
                onClick={toggleMode}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;