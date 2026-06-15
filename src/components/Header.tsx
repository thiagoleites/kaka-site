/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  Menu, 
  X, 
  TrendingUp, 
  ChevronDown, 
  Gift, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Smartphone,
  Shirt,
  Utensils,
  LogOut,
  Sliders,
  History
} from 'lucide-react';
import { Product, CartItem, User, Coupon } from '../types';
import { DEPARTMENTS, SAMPLE_COUPONS } from '../data';

interface HeaderProps {
  cart: CartItem[];
  wishlist: Product[];
  currentUser: User | null;
  onNavigate: (page: string, params?: any) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  products: Product[];
  activePage: string;
}

export default function Header({
  cart,
  wishlist,
  currentUser,
  onNavigate,
  onOpenAuthModal,
  onLogout,
  products,
  activePage
}: HeaderProps) {
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('kaka_search_history');
    return saved ? JSON.parse(saved) : ['iPhone', 'Tênis Nike', 'Perfume', 'Fritadeira'];
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePromoBanner, setActivePromoBanner] = useState(true);

  const announcements = [
    "⚡ COMPRE REALIZANDO PIX E GANHE 10% DE DESCONTO EXCLUSIVO!",
    "🚚 FRETE GRÁTIS para todo o Brasil em compras acima de R$ 150!",
    "💰 COMPRE E GANHE: Receba saldo de cashback creditado na hora real!",
    "🔒 Loja 100% Criptografada - Compra segura com Garantia Extra!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (!searchHistory.includes(searchQuery.trim())) {
        const nextHist = [searchQuery.trim(), ...searchHistory.slice(0, 5)];
        setSearchHistory(nextHist);
        localStorage.setItem('kaka_search_history', JSON.stringify(nextHist));
      }
      onNavigate('search', { query: searchQuery });
      setIsSearchFocused(false);
    }
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory([]);
    localStorage.removeItem('kaka_search_history');
  };

  const handleSuggestClick = (product: Product) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    onNavigate('product', { id: product.id });
  };

  // Filter suggestions based on input
  const suggestions = searchQuery.trim()
    ? products
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     p.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
    : [];

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full bg-white relative z-50 shadow-sm">
      {/* 1. Announcement Bar */}
      <div className="w-full bg-neutral-950 text-white text-xs py-2 px-4 transition-all duration-500 overflow-hidden text-center select-none font-medium">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{announcements[announcementIndex]}</span>
        </div>
      </div>

      {/* 2. Top Minimal Bar */}
      <div className="w-full bg-neutral-50 px-4 md:px-8 py-1.5 border-b border-neutral-200 text-xs text-neutral-500 hidden sm:flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-500" />
            Rastrear meu Pedido
          </span>
          <span className="flex items-center gap-1 border-l border-neutral-300 pl-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Compra 100% Protegida
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Central de Ajuda: <strong>(82) 99682-8405</strong></span>
          {currentUser && (
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              Cashback Acumulado: R$ {currentUser.cashbackBalance.toFixed(2)}
            </span>
          )}
          <span className="text-neutral-700">🇧🇷 PT-BR</span>
        </div>
      </div>

      {/* 3. Main Header Bar (Logo, Intellisearch, Account, Cart, Wishlist) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-neutral-800 p-1 cursor-pointer focus:outline-none"
          id="mobile_menu_trigger"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex flex-col cursor-pointer select-none"
          id="header_logo"
        >
          {/* <div className="flex items-center gap-1.5">
            <span className="bg-neutral-900 text-white text-base md:text-lg font-black px-2 py-1 rounded tracking-widest uppercase">
              KAKÁ
            </span>
            <span className="text-amber-500 text-xs font-semibold tracking-wider uppercase border border-amber-500/30 px-1 rounded">
              PREMIUM
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 font-medium tracking-[0.25em] uppercase text-center mt-0.5">
            Multimarcas
          </span> */}
          <img src="/assets/images/logo.png" alt="Kaká Multimarcas" className="w-28 h-auto object-contain" />
        </div>

        {/* Intellisearch Bar */}
        <div className="flex-1 max-w-2xl relative mx-2 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="flex">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Busque por marcas, smartphones, roupas, calçados..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-neutral-100 focus:bg-white text-sm pl-11 pr-4 py-2.5 rounded-l-lg border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-950 transition-all outline-none text-neutral-800"
                id="search_input_desktop"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button 
              type="submit"
              className="bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold px-6 py-2.5 rounded-r-lg transition-colors cursor-pointer"
              id="search_button_desktop"
            >
              Buscar
            </button>
          </form>

          {/* Autoprompt / History Popover */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 bg-white border border-neutral-200 mt-1.5 rounded-lg shadow-xl z-50 p-4">
              {searchQuery.trim() === '' ? (
                <>
                  <div className="flex justify-between items-center mb-2.5 text-xs font-bold text-neutral-400 tracking-wider">
                    <span className="flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> RECENTES</span>
                    {searchHistory.length > 0 && (
                      <button onClick={clearHistory} className="hover:text-neutral-900 cursor-pointer">Limpar tudo</button>
                    )}
                  </div>
                  {searchHistory.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {searchHistory.map((hist, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchQuery(hist);
                            onNavigate('search', { query: hist });
                          }}
                          className="bg-neutral-50 hover:bg-neutral-150 border border-neutral-200 text-xs text-neutral-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                        >
                          {hist}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 mb-4 italic">Nenhum termo pesquisado recentemente.</p>
                  )}

                  <div className="text-xs font-bold text-neutral-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> MAIS BUSCADOS DA SEMANA
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700">
                    <button onClick={() => { setSearchQuery('iPhone'); onNavigate('search', { query: 'iPhone' }); }} className="text-left py-1.5 px-2 hover:bg-neutral-50 rounded">🔥 iPhone 15 Pro Max</button>
                    <button onClick={() => { setSearchQuery('Nike'); onNavigate('search', { query: 'Nike' }); }} className="text-left py-1.5 px-2 hover:bg-neutral-50 rounded">🔥 Tênis Nike Air Force</button>
                    <button onClick={() => { setSearchQuery('Bleu de Chanel'); onNavigate('search', { query: 'Bleu de Chanel' }); }} className="text-left py-1.5 px-2 hover:bg-neutral-50 rounded">🔥 Bleu de Chanel</button>
                    <button onClick={() => { setSearchQuery('Moletom'); onNavigate('search', { query: 'Moletom' }); }} className="text-left py-1.5 px-2 hover:bg-neutral-50 rounded">🔥 Sobretudo Lã Zara</button>
                  </div>
                </>
              ) : (
                <div>
                  <div className="text-xs font-bold text-neutral-400 tracking-wider mb-2">SUGESTÕES DE PRODUTOS</div>
                  {suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((p) => (
                        <div
                          key={p.id}
                          onMouseDown={() => handleSuggestClick(p)}
                          className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-md cursor-pointer transition-colors"
                        >
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded border border-neutral-200" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-800 truncate">{p.name}</p>
                            <span className="text-xs text-neutral-400">{p.category} | {p.brand}</span>
                          </div>
                          <span className="text-sm font-semibold text-neutral-900">R$ {p.promoPrice ? p.promoPrice.toFixed(2) : p.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500 italic py-2">Nenhum produto correspondente...</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wishlist, Cart and Customer Account actions */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Wishlist trigger */}
          <button
            onClick={() => onNavigate('wishlist')}
            className="relative p-1.5 text-neutral-700 hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
            title="Lista de desejos"
            id="wishlist_header_icon"
          >
            <Heart className={`w-6 h-6 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart trigger */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative p-1.5 text-neutral-700 hover:text-neutral-950 transition-colors focus:outline-none cursor-pointer"
            title="Carrinho de compras"
            id="cart_header_icon"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-neutral-950 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* User Account Account Dropdown */}
          <div className="relative">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-left focus:outline-none cursor-pointer p-1 rounded-full md:rounded-lg md:hover:bg-neutral-50 transition-colors"
                  id="user_menu_logged_trigger"
                >
                  <img
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
                    alt={currentUser.fullName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-neutral-300"
                  />
                  <div className="hidden lg:block text-xs">
                    <p className="font-semibold text-neutral-800 line-clamp-1">Olá, {currentUser.fullName.split(' ')[0]}</p>
                    <p className="text-neutral-400 text-[10px]">Minha Conta</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500 hidden lg:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 py-2">
                    <div className="px-4 py-2.5 border-b border-neutral-100">
                      <p className="text-xs text-neutral-400">Logado como</p>
                      <p className="text-sm font-semibold text-neutral-800 truncate">{currentUser.fullName}</p>
                      <p className="text-xs text-neutral-400 truncate">{currentUser.email}</p>
                    </div>
                    
                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('dashboard'); }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Sliders className="w-4 h-4 text-neutral-500" /> Meu Painel VIP
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('dashboard', { tab: 'orders' }); }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Truck className="w-4 h-4 text-neutral-500" /> Histórico de Pedidos
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('dashboard', { tab: 'coupons' }); }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Gift className="w-4 h-4 text-neutral-500" /> Meus Cupons
                    </button>
                    
                    <div className="border-t border-neutral-100 my-1"></div>
                    <button
                      onClick={() => { setShowUserMenu(false); onLogout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Desconectar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 text-sm font-semibold text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer"
                id="login_header_trigger"
              >
                <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 bg-neutral-50">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block text-xs">
                  <p className="font-semibold text-neutral-700">Entrar / Criar Conta</p>
                  <p className="text-neutral-400 text-[10px]">Benefícios VIP</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="py-2 px-4 border-b border-neutral-200 bg-neutral-50 md:hidden">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="O que você está procurando hoje?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-sm pl-10 pr-4 py-2 rounded-lg border border-neutral-250 focus:border-neutral-900 outline-none"
            id="search_input_mobile"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* 4. Interactive Sticky Department Navbar */}
      <nav className="w-full bg-neutral-950 text-white text-sm relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Menu and scrolling pages flex-container */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Amazon-style Department Trigger (Placed outside of scrollable region) */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowMegaMenu(!showMegaMenu)}
                className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-5 py-3.5 flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap select-none focus:outline-none"
                id="megamenu_trigger"
              >
                <Menu className="w-4 h-4" />
                Todos os Departamentos
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showMegaMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Department Mega Menu Popover */}
              {showMegaMenu && (
                <div className="absolute left-0 top-full w-[280px] sm:w-[680px] bg-white text-neutral-800 border border-neutral-200 shadow-2xl z-50 rounded-b-xl flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 overflow-hidden">
                  {/* Left Column Departments with Icons */}
                  <div className="w-full sm:w-1/2 p-4 bg-neutral-50">
                    <p className="text-xs font-bold text-neutral-400 mb-3 tracking-wider uppercase">DEPARTAMENTOS PREMIUM</p>
                    <div className="space-y-1">
                      {DEPARTMENTS.map((dept) => (
                        <div
                          key={dept.id}
                          className="hover:bg-amber-50 p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all group border border-transparent hover:border-amber-100"
                          onClick={() => {
                            setShowMegaMenu(false);
                            onNavigate('category', { category: dept.categories[0] });
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            {dept.icon === 'Smartphone' && <Smartphone className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />}
                            {dept.icon === 'Shirt' && <Shirt className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />}
                            {dept.icon === 'Sparkles' && <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />}
                            {dept.icon === 'Home' && <Utensils className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />}
                            {dept.icon === 'Dribbble' && <Gift className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />}
                            <span className="font-semibold text-sm text-neutral-800 group-hover:text-amber-600 transition-colors">{dept.name}</span>
                          </div>
                          <span className="text-[10px] text-amber-600 bg-amber-100/50 font-bold px-1.5 py-0.5 rounded group-hover:bg-amber-150 transition-colors">Novo</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column Subcategories & Highlights */}
                  <div className="w-full sm:w-1/2 p-5 flex flex-col justify-between bg-white">
                    <div>
                      <p className="text-xs font-bold text-neutral-400 mb-3 tracking-wider uppercase">CATEGORIAS EM DESTAQUE</p>
                      <div className="grid grid-cols-2 gap-2">
                        {DEPARTMENTS.flatMap(d => d.categories).slice(0, 8).map((cat, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setShowMegaMenu(false);
                              onNavigate('category', { category: cat });
                            }}
                            className="text-left text-xs font-medium text-neutral-600 hover:text-amber-600 py-1.5 px-2 hover:bg-amber-50/50 rounded transition-colors"
                          >
                            ⭐ {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 border-t border-neutral-100 pt-4 flex items-center gap-3 bg-gradient-to-r from-amber-50 to-neutral-50 p-3 rounded-lg border border-amber-100/40">
                      <Gift className="w-8 h-8 text-amber-500 flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="text-[11px] font-extrabold text-neutral-800">Cupom de Boas-vindas</p>
                        <p className="text-[10px] text-neutral-500">Insira <span className="font-bold text-amber-600">BEMVINDO50</span> no checkout.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* General Direct Pages (Safe scrolling container without absolute children) */}
            <div className="flex-1 flex items-center overflow-x-auto no-scrollbar scroll-smooth gap-1 py-1">
              <button 
                onClick={() => onNavigate('promo')}
                className={`px-4 py-3 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer font-medium ${activePage === 'promo' ? 'text-amber-400 border-b-2 border-amber-400' : ''}`}
              >
                ⚡ Ofertas Flash
              </button>
              <button 
                onClick={() => onNavigate('brands')}
                className={`px-4 py-3 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer font-medium ${activePage === 'brands' ? 'text-amber-400 border-b-2 border-amber-400' : ''}`}
              >
                🏆 Marcas Parceiras
              </button>
              <button 
                onClick={() => onNavigate('category', { category: 'Smartphones' })}
                className="px-4 py-3 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer font-medium"
              >
                📱 Smartphones
              </button>
              <button 
                onClick={() => onNavigate('category', { category: 'Moda Masculina' })}
                className="px-4 py-3 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer font-medium"
              >
                👔 Moda Masculina
              </button>
              <button 
                onClick={() => onNavigate('category', { category: 'Moda Feminina' })}
                className="px-4 py-3 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer font-medium"
              >
                👗 Moda Feminina
              </button>
              <button 
                onClick={() => onNavigate('institutional')}
                className={`px-4 py-3 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer font-medium ${activePage === 'institutional' ? 'text-amber-400 border-b-2 border-amber-400' : ''}`}
              >
                 Sobre Nós
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-neutral-400 font-mono">Suporte WhatsApp: <strong>(11) 98765-4321</strong></span>
          </div>
        </div>
      </nav>

      {/* 5. Mobile Drawer Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden flex justify-start">
          <div className="w-[80%] max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
                <span className="text-neutral-900 text-lg font-black tracking-widest uppercase">KAKÁ MENU</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-600 p-1 cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {currentUser && (
                <div className="mb-6 bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center gap-3">
                  <img src={currentUser.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-xs text-neutral-400">Bem-vindo, VIP</p>
                    <p className="text-sm font-bold text-neutral-800">{currentUser.fullName}</p>
                    <p className="text-[10px] text-amber-700 bg-amber-100 inline-block px-1.5 py-0.5 rounded font-mono">
                      Cashback: R$ {currentUser.cashbackBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-[11px] font-extrabold text-neutral-400 mb-3 tracking-widest uppercase">CATEGORIAS</p>
              <div className="space-y-3 mb-8">
                {DEPARTMENTS.flatMap(d => d.categories).slice(0, 10).map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate('category', { category: cat });
                    }}
                    className="w-full text-left text-sm font-medium text-neutral-700 hover:text-amber-500 py-1 border-b border-neutral-50 flex items-center gap-2 cursor-pointer"
                  >
                    📦 {cat}
                  </button>
                ))}
              </div>

              <p className="text-[11px] font-extrabold text-neutral-400 mb-3 tracking-widest uppercase">PÁGINAS</p>
              <div className="space-y-3">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate('promo'); }}
                  className="w-full text-left text-sm font-semibold text-neutral-800 hover:text-amber-500 flex items-center gap-2 cursor-pointer"
                >
                  ⚡ Cupons & Ofertas Flash
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate('brands'); }}
                  className="w-full text-left text-sm font-semibold text-neutral-800 hover:text-amber-500 flex items-center gap-2 cursor-pointer"
                >
                  🏆 Marcas Parceiras
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate('institutional'); }}
                  className="w-full text-left text-sm font-semibold text-neutral-800 hover:text-amber-500 flex items-center gap-2 cursor-pointer"
                >
                  📖 Polícias & Sobre Nós
                </button>
                {currentUser ? (
                  <>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); onNavigate('dashboard'); }}
                      className="w-full text-left text-sm font-semibold text-neutral-800 hover:text-amber-500 flex items-center gap-2 cursor-pointer"
                    >
                      👤 Meu Painel de Cliente
                    </button>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                      className="w-full text-left text-sm font-semibold text-red-600 flex items-center gap-2 pt-2 cursor-pointer"
                    >
                      🚪 Sair do Sistema
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onOpenAuthModal(); }}
                    className="w-full text-left text-sm font-extrabold text-amber-600 flex items-center gap-2 cursor-pointer"
                  >
                    🔐 Entrar na Loja / Cadastrar
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-6">
              <p className="text-xs text-neutral-400 text-center">Kaká Multimarcas &copy; 2026</p>
              <p className="text-[10px] text-neutral-400 text-center mt-1">Imagens meramente ilustrativas.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
