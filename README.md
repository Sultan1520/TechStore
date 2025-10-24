###Интернет-магазин (Django + React)

Это pet-проект интернет-магазина, в котором используется Django REST Framework на стороне сервера и React на стороне клиента. Приложение поддерживает регистрацию и авторизацию через JWT, работу с товарами, корзиной и историей заказов. Интерфейс разработан с помощью Tailwind CSS, а база данных реализована на PostgreSQL. Проект развернут на Render (backend) и Vercel (frontend).

Используемые технологии

• Backend: Python, Django, Django REST Framework, Simple JWT, PostgreSQL
• Frontend: React, React Router, Axios, Tailwind CSS
• Deployment: Render (backend), Vercel (frontend)

###Как запустить проект локально

Сначала необходимо клонировать репозиторий:

git clone https://github.com/your-username/online-store.git
cd online-store

###Настройка и запуск backend (Django)

Перейдите в папку config, создайте виртуальное окружение и установите зависимости:

cd config
python -m venv venv
source venv/bin/activate        # для Windows используйте venv\Scripts\activate
pip install -r requirements.txt


Создайте файл .env в папке config/config/ и добавьте туда настройки:

SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=postgres://postgres:password@localhost:5432/shop_db
ALLOWED_HOSTS=*


После этого примените миграции и запустите сервер командой:

python manage.py migrate
python manage.py runserver


Бэкенд будет доступен по адресу http://127.0.0.1:8000/

Настройка и запуск frontend (React)

После запуска backend перейдите в папку frontend и установите зависимости:

cd ../frontend
npm install
npm start


Фронтенд запустится по адресу http://localhost:5173/
 или http://localhost:3000/
, в зависимости от настроек.

Аутентификация

Проект использует JWT (JSON Web Token) для авторизации пользователей. После регистрации и входа пользователь получает два токена: access и refresh. Access-токен хранится в LocalStorage или в защищённой cookie.

Основные эндпоинты для аутентификации:

• POST /api/users/register/ — регистрация нового пользователя
• POST /api/token/ — получение JWT токена
• POST /api/token/refresh/ — обновление access токена

REST API
Товары (/api/products/)

• GET /api/products/ — получить список всех товаров
• GET /api/products/{id}/ — получить информацию о конкретном товаре
• POST /api/products/ — добавить новый товар (только для администратора)
• PUT/PATCH /api/products/{id}/ — редактировать товар (только для администратора)
• DELETE /api/products/{id}/ — удалить товар (только для администратора)

Корзина (/api/cart/)

• GET /api/cart/ — просмотреть корзину текущего пользователя
• POST /api/cart/add/ — добавить товар в корзину
• DELETE /api/cart/remove/{product_id}/ — удалить товар из корзины

История заказов (/api/orders/)

• GET /api/orders/ — получить все заказы текущего пользователя
• POST /api/orders/create/ — оформить новый заказ на основе корзины

Интерфейс (Frontend)

На клиентской части реализованы следующие страницы:

• Главная страница с каталогом товаров
• Страница детальной информации о товаре
• Корзина с возможностью добавления и удаления товаров
• История заказов пользователя
• Регистрация и вход с использованием JWT
• Профиль пользователя

Интерфейс разработан с помощью библиотеки Tailwind CSS и адаптирован под разные устройства.

Деплой

Backend развернут на Render. В проекте используется база данных PostgreSQL.
Команда запуска на Render:

gunicorn config.wsgi:application

Возможные улучшения

• Добавить онлайн-оплату (например, Stripe или Kaspi API)
• Реализовать поиск и фильтрацию товаров
• Добавить панель администратора на фронтенде
• Оптимизировать SEO и производительность
