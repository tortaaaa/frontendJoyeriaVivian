// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './presentation/layouts/MainLayout';
import Home from './presentation/screens/home/Home';
import Contact from './presentation/screens/contact/Contact';
import Information from './presentation/screens/information/Information';
import ProductDetail from './presentation/screens/product/productDetail/ProductDetail';
import ProductList from './presentation/screens/product/productList/ProductList';
import Cart from './presentation/screens/cart/Cart';
import PaymentData from './presentation/screens/payment/paymentData/PaymentData';
import PaymentVoucher from './presentation/screens/payment/paymentSuccess/PaymentVoucher';
import PaymentFail from './presentation/screens/payment/paymentFail/PaymentFail';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/information" element={<Information />} />
          <Route path="/product/:product_code" element={<ProductDetail />} />
          <Route path="/products/:category" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment-data" element={<PaymentData />} />
          <Route path="/payment-voucher" element={<PaymentVoucher />} /> {/* Ruta para PaymentVoucher */}
          <Route path="/payment-fail" element={<PaymentFail />} /> {/* Ruta para PaymentFail */}
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
