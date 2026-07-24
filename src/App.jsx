import { Routes, Route } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll.jsx'
import Navbar from './components/Navbar.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Success from './pages/Success.jsx'
import Custom from './pages/Custom.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/custom" element={<Custom />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
