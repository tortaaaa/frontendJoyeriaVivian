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
import Orfebreria from './presentation/components/Orfebreria';

import TransbankLogin from './presentation/screens/transbankLogin/TransbankLogin';
import PrivateRoute from './presentation/components/PrivateRoute';

import CmsLogin from './presentation/screens/cms/LoginCMS/CmsLogin';
import PrivateRouteCMS from './presentation/components/PrivateRouteCMS';
import CmsLayout from './presentation/layouts/CmsLayout';
import Dashboard from './presentation/screens/cms/Dashboard/Dashboard';
import ViewProducts from './presentation/screens/cms/Products/View/ViewProducts';
import CreateProduct from './presentation/screens/cms/Products/Create/CreateProduct';
import EditProduct from './presentation/screens/cms/Products/Edit/EditProduct';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login Transbank (página pública) */}
        <Route path="/transbank-login" element={<TransbankLogin />} />

        {/* Login CMS (página pública) */}
        <Route path="/cms/login" element={<CmsLogin />} />

        {/* RUTAS PRIVADAS CMS */}
        <Route path="/cms/*" element={
          <PrivateRouteCMS>
            <CmsLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ViewProducts />} />
                <Route path="/products/create" element={<CreateProduct />} />
                <Route path="/products/edit/:product_code" element={<EditProduct />} />
              </Routes>
            </CmsLayout>
          </PrivateRouteCMS>
        } />

        {/* RUTAS PRIVADAS TRANSBANK */}
        <Route path="/*" element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/information" element={<Information />} />
                <Route path="/orfebreria" element={<Orfebreria />} />
                <Route path="/product/:product_code" element={<ProductDetail />} />
                <Route path="/products/:category" element={<ProductList />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment-data" element={<PaymentData />} />
                <Route path="/payment-voucher" element={<PaymentVoucher />} />
                <Route path="/payment-fail" element={<PaymentFail />} />
              </Routes>
            </MainLayout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
