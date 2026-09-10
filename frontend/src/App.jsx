import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import WishlistPage from './pages/WishlistPage';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('aura_theme') || 'dark');
  
  // Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('aura_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('aura_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Cart Drawer open state
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aura_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCart(prev => {
      const qtyToAdd = product.quantity || 1;
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qtyToAdd;
        return updated;
      }
      return [...prev, { ...product, quantity: qtyToAdd }];
    });
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(w => w.id === product.id);
      if (exists) {
        return prev.filter(w => w.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar 
          cart={cart}
          wishlist={wishlist}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenCart={() => setCartOpen(true)}
        />

        <CartDrawer 
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
        />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={
              <HomePage 
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            } />

            <Route path="/shop" element={
              <ShopPage 
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            } />

            <Route path="/product/:id" element={
              <ProductDetailPage 
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            } />

            <Route path="/cart" element={
              <CartPage 
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onClearCart={handleClearCart}
              />
            } />

            <Route path="/checkout" element={
              <CheckoutPage 
                cart={cart}
                onClearCart={handleClearCart}
              />
            } />

            <Route path="/track" element={<OrderTrackingPage />} />

            <Route path="/wishlist" element={
              <WishlistPage 
                wishlist={wishlist}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
