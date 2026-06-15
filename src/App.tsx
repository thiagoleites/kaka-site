/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Sparkles, 
  ShieldCheck, 
  Share2, 
  Check, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Product, CartItem, User, Order } from './types';
import { ALL_PRODUCTS, INITIAL_USER } from './data';

// Import all subviews
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import CategoryView from './components/CategoryView';
import ProductDetailView from './components/ProductDetailView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import DashboardView from './components/DashboardView';
import AuthModal from './components/AuthModal';
import PromoView from './components/PromoView';
import BrandsView from './components/BrandsView';
import InstitutionalView from './components/InstitutionalView';

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState<string>('home');
  const [navigationParams, setNavigationParams] = useState<any>(null);

  // Cart State (stored in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kaka_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kaka_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Logged User State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kaka_user');
    return saved ? JSON.parse(saved) : INITIAL_USER; // Default VIP user logged in for a richer demo initially
  });

  // Orders History State
  const [ordersHistory, setOrdersHistory] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kaka_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Auth Portal Modal Toggle
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Global Interactive Toasts Alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  // Synchronizers
  useEffect(() => {
    localStorage.setItem('kaka_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kaka_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kaka_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kaka_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kaka_orders', JSON.stringify(ordersHistory));
  }, [ordersHistory]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // State modifiers
  const handleAddToCart = (product: Product, quantity: number, color: string, size?: string) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && 
                  item.selectedColor === color && 
                  item.selectedSize === size
      );

      if (existingIdx > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIdx].quantity += quantity;
        showToast(`Adicionados mais + ${quantity} itens ao carrinho!`);
        return nextCart;
      } else {
        showToast(`"${product.name}" adicionado com sucesso!`);
        return [...prevCart, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });
  };

  const handleInstantBuy = (product: Product, quantity: number, color: string, size?: string) => {
    // Add to cart first, then route directly to checkout
    const exists = cart.some(
      (item) => item.product.id === product.id && 
                item.selectedColor === color && 
                item.selectedSize === size
    );
    if (!exists) {
      setCart((prev) => [...prev, { product, quantity, selectedColor: color, selectedSize: size }]);
    }
    setActivePage('checkout');
    setNavigationParams({ couponApplied: undefined, discountVal: 0, shippingVal: 0 });
  };

  const handleUpdateCartQuantity = (productId: string, qty: number, color: string, size?: string) => {
    setCart((prevCart) => {
      const next = prevCart.map((item) => {
        if (item.product.id === productId && 
            item.selectedColor === color && 
            item.selectedSize === size) {
          return { ...item, quantity: qty };
        }
        return item;
      });
      return next;
    });
  };

  const handleRemoveCartItem = (productId: string, color: string, size?: string) => {
    setCart((prevCart) => {
      const next = prevCart.filter(
        (item) => !(item.product.id === productId && 
                    item.selectedColor === color && 
                    item.selectedSize === size)
      );
      showToast('Item removido do seu carrinho com sucesso.', 'info');
      return next;
    });
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prevList) => {
      const exists = prevList.some((p) => p.id === product.id);
      if (exists) {
        showToast('Produto removido da lista de desejos.', 'info');
        return prevList.filter((p) => p.id !== product.id);
      } else {
        showToast('Salvo em seus Favoritos! ❤️');
        return [...prevList, product];
      }
    });
  };

  const handleAddOrderToHistory = (order: Order) => {
    setOrdersHistory((prev) => [order, ...prev]);
    // Optionally increase cashback balance by 10% of total
    if (currentUser) {
      const cashbackBonus = order.total * 0.10;
      setCurrentUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          cashbackBalance: prevUser.cashbackBalance + cashbackBonus
        };
      });
      showToast(`Parabéns! Você acumulou + R$ ${cashbackBonus.toFixed(2)} de Cashback VIP!`, 'success');
    }
  };

  const handleNavigate = (page: string, params: any = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePage(page);
    setNavigationParams(params);
  };

  // Filter products for Search queries
  const searchedProducts = React.useMemo(() => {
    if (activePage === 'search' && navigationParams?.query) {
      const term = navigationParams.query.toLowerCase();
      return ALL_PRODUCTS.filter(
        p => p.name.toLowerCase().includes(term) || 
             p.category.toLowerCase().includes(term) || 
             p.brand.toLowerCase().includes(term)
      );
    }
    return ALL_PRODUCTS;
  }, [activePage, navigationParams]);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans select-none antialiased text-neutral-900 leading-normal">
      {/* 1. Global Announcement / Action Popups */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-55 max-w-sm p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all duration-300 transform translate-x-0 ${toastType === 'success' ? 'bg-neutral-900 text-white border-white' : 'bg-white text-neutral-800 border-neutral-250 animate-bounce'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${toastType === 'success' ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-100 text-neutral-800'}`}>
            {toastType === 'success' ? <Check className="w-4 h-4 text-neutral-950" /> : <AlertCircle className="w-4 h-4" />}
          </div>
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* 2. Top Header and departments mega menus */}
      <Header
        cart={cart}
        wishlist={wishlist}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Desconectado com sucesso absoluto do portal VIP.', 'info');
        }}
        products={ALL_PRODUCTS}
        activePage={activePage}
      />

      {/* 3. Main Views router wrapper */}
      <main className="flex-1 w-full bg-neutral-50/50 py-4">
        {activePage === 'home' && (
          <HomeView
            products={ALL_PRODUCTS}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        )}

        {activePage === 'category' && (
          <CategoryView
            initialCategory={navigationParams?.category}
            products={ALL_PRODUCTS}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        )}

        {activePage === 'search' && (
          <CategoryView
            initialCategory={searchedProducts[0]?.category || 'Smartphones'}
            products={searchedProducts}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        )}

        {activePage === 'product' && (
          <ProductDetailView
            productId={navigationParams?.id}
            products={ALL_PRODUCTS}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onInstantBuy={handleInstantBuy}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        )}

        {activePage === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onNavigate={handleNavigate}
            onToggleWishlist={handleToggleWishlist}
            products={ALL_PRODUCTS}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutView
            cart={cart}
            couponApplied={navigationParams?.couponApplied}
            discountVal={navigationParams?.discountVal || 0}
            shippingVal={navigationParams?.shippingVal || 15.00}
            onClearCart={() => setCart([])}
            onNavigate={handleNavigate}
            onAddOrderToHistory={handleAddOrderToHistory}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            ordersHistory={ordersHistory}
            wishlist={wishlist}
            onNavigate={handleNavigate}
            onRemoveFromWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onUpdateUser={setCurrentUser}
            initialTab={navigationParams?.tab}
          />
        )}

        {activePage === 'wishlist' && (
          <DashboardView
            currentUser={currentUser}
            ordersHistory={ordersHistory}
            wishlist={wishlist}
            onNavigate={handleNavigate}
            onRemoveFromWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onUpdateUser={setCurrentUser}
            initialTab="wishlist"
          />
        )}

        {activePage === 'promo' && (
          <PromoView
            products={ALL_PRODUCTS}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        )}

        {activePage === 'brands' && (
          <BrandsView
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'institutional' && (
          <InstitutionalView />
        )}
      </main>

      {/* 4. Complete Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 5. Social/Direct Register & Login Portal Popover */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Seja muito bem-vindo, ${user.fullName.split(' ')[0]}! Portal VIP liberado.`, 'success');
        }}
      />
    </div>
  );
}
