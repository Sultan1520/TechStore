import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Registration from './pages/Registration';
import OrdersPage from './pages/Orders';

import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import { CartProvider } from './context/CartContext';

function AppContent() {
  const location = useLocation();
  const hideLayout = ['/registration'].includes(location.pathname);
  const token = localStorage.getItem("token")
  
  return (
    <>

      {!hideLayout && <Header />}
      <CartProvider>
      <Routes>  
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage token={token}/></PrivateRoute>} />
      </Routes>
      </CartProvider>
      {!hideLayout && <Footer />}
      </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
