/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Grid, 
  List, 
  ChevronDown, 
  Sparkles, 
  X, 
  HelpCircle,
  TrendingDown,
  ArrowUpDown
} from 'lucide-react';
import { Product } from '../types';
import { getInstallmentText, getPixValue } from '../data';
import ProductCard from './ProductCard';

interface CategoryViewProps {
  initialCategory?: string;
  products: Product[];
  onNavigate: (page: string, params?: any) => void;
  onAddToCart: (product: Product, quantity: number, color: string, size?: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
}

export default function CategoryView({
  initialCategory = 'Smartphones',
  products,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlist
}: CategoryViewProps) {
  // States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('relevance');
  
  // Sidebar Filters
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [priceMax, setPriceMax] = useState<number>(15000);
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedMinRating, setSelectedMinRating] = useState<number>(0);
  const [onlyPromos, setOnlyPromos] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Pagination simulation
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [isAppending, setIsAppending] = useState<boolean>(false);

  // All unique brands and colors in current selection for dynamic filters
  const uniqueBrands = useMemo(() => {
    const list = products.filter(p => p.category === selectedCategory).map(p => p.brand);
    return ['All', ...Array.from(new Set(list))];
  }, [products, selectedCategory]);

  const uniqueColors = useMemo(() => {
    const list = products.filter(p => p.category === selectedCategory).flatMap(p => p.colors);
    return ['All', ...Array.from(new Set(list))];
  }, [products, selectedCategory]);

  // Reset pagination on category or filter change
  const resetPagination = () => {
    setVisibleCount(8);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedBrand('All');
    setSelectedColor('All');
    setSelectedMinRating(0);
    setOnlyPromos(false);
    setInStockOnly(false);
    setPriceMax(15000);
    resetPagination();
  };

  // Filter and Sort Computing
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Match specific category
        if (p.category !== selectedCategory) return false;
        
        // Brand filter
        if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
        
        // Colors filter
        if (selectedColor !== 'All' && !p.colors.includes(selectedColor)) return false;
        
        // Rating filter
        if (selectedMinRating > 0 && p.rating < selectedMinRating) return false;
        
        // Promos only filter
        if (onlyPromos && !p.promoPrice) return false;
        
        // Stock status
        if (inStockOnly && p.stock <= 0) return false;

        // Price range
        const actualPrice = p.promoPrice || p.price;
        if (actualPrice > priceMax) return false;

        return true;
      })
      .sort((a, b) => {
        const pA = a.promoPrice || a.price;
        const pB = b.promoPrice || b.price;

        if (sortOption === 'low_to_high') return pA - pB;
        if (sortOption === 'high_to_low') return pB - pA;
        if (sortOption === 'ratings') return b.rating - a.rating;
        if (sortOption === 'views') return b.viewsCount - a.viewsCount;
        return 0; // Default relevance / no sorting
      });
  }, [products, selectedCategory, selectedBrand, priceMax, selectedColor, selectedMinRating, onlyPromos, inStockOnly, sortOption]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const triggerLoadMore = () => {
    if (visibleCount >= filteredProducts.length) return;
    setIsAppending(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsAppending(false);
    }, 1200);
  };

  // List of all categories to show on top breadcrumb bar or choices
  const allAvailableCategories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Category Banner & Breadcrumbs info */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -translate-y-6 translate-x-12 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl"></div>
        <div className="space-y-1 z-10">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-wider">DEPARTAMENTO PREMIUM / CATALOGO</p>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{selectedCategory}</h1>
          <p className="text-xs text-neutral-400">Exibindo {filteredProducts.length} produtos sofisticados certificados com garantia extendida.</p>
        </div>
        <span className="text-sm font-mono bg-neutral-800 text-amber-500 border border-neutral-700 px-3 py-1.5 rounded-lg hidden sm:block">
          🚚 Frete Grátis Ativo
        </span>
      </div>

      {/* Breadcrumbs trail */}
      <div className="text-xs font-medium text-neutral-400 flex flex-wrap items-center gap-1.5 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
        <span className="hover:text-neutral-700 cursor-pointer" onClick={() => onNavigate('home')}>Início</span>
        <span>/</span>
        <span className="hover:text-neutral-700 cursor-pointer">Catálogo</span>
        <span>/</span>
        <span className="text-neutral-900 font-bold">{selectedCategory}</span>
      </div>

      {/* Category selector capsules */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto no-scrollbar border-b border-neutral-100">
        {allAvailableCategories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2. Primary layout grids */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Filter Menu */}
        <aside className="w-full lg:w-64 bg-white border border-neutral-200 rounded-xl p-5 space-y-6 flex-shrink-0">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-black tracking-widest text-neutral-800 uppercase flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" /> FILTROS AVANÇADOS
            </span>
            <button 
              onClick={() => {
                setSelectedBrand('All');
                setSelectedColor('All');
                setSelectedMinRating(0);
                setOnlyPromos(false);
                setInStockOnly(false);
                setPriceMax(15000);
                resetPagination();
              }}
              className="text-[10px] font-bold text-amber-600 hover:underline cursor-pointer"
            >
              Resetar Tudo
            </button>
          </div>

          {/* Price Maximizer slider */}
          <div className="space-y-2">
            <label className="block text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">Preço Máximo</label>
            <div className="text-sm font-black text-neutral-800">R$ {priceMax.toFixed(2)}</div>
            <input
              type="range"
              min="100"
              max="15000"
              step="100"
              value={priceMax}
              onChange={(e) => { setPriceMax(Number(e.target.value)); resetPagination(); }}
              className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-neutral-950 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>R$ 100</span>
              <span>R$ 15.000</span>
            </div>
          </div>

          {/* Brand Filter */}
          {uniqueBrands.length > 2 && (
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">Marca</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {uniqueBrands.map((brand, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-950 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="brand_filter"
                      checked={selectedBrand === brand}
                      onChange={() => { setSelectedBrand(brand); resetPagination(); }}
                      className="accent-neutral-900"
                    />
                    <span>{brand === 'All' ? 'Todas as marcas' : brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Color filter capsules */}
          {uniqueColors.length > 2 && (
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">Cores Elegíveis</label>
              <div className="flex flex-wrap gap-1.5">
                {uniqueColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedColor(color); resetPagination(); }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${selectedColor === color ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200'}`}
                  >
                    {color === 'All' ? 'Todas' : color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Promos Checkmarks */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-100 text-xs">
            <label className="flex items-center gap-2.5 text-neutral-600 font-bold hover:text-neutral-950 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyPromos}
                onChange={(e) => { setOnlyPromos(e.target.checked); resetPagination(); }}
                className="accent-neutral-900 h-3.5 w-3.5 rounded"
              />
              <span>Apenas Ofertas & Promos</span>
            </label>

            <label className="flex items-center gap-2.5 text-neutral-600 font-bold hover:text-neutral-950 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => { setInStockOnly(e.target.checked); resetPagination(); }}
                className="accent-neutral-900 h-3.5 w-3.5 rounded"
              />
              <span>Estoque Imediato</span>
            </label>
          </div>

          {/* Support widget inside filter */}
          <div className="bg-amber-50/65 border border-amber-500/20 p-3.5 rounded-lg space-y-1.5">
            <p className="text-[11px] font-black text-amber-900 uppercase">Suporte de Tamanho</p>
            <p className="text-[10px] text-amber-700 leading-relaxed">Em caso de dúvidas sobre fitting ou dimensões de nossos calçados e fardamentos Zara, chame um especialista.</p>
            <button className="text-[10px] text-amber-950 font-black underline hover:text-amber-800 cursor-pointer block">WhatsApp Direto</button>
          </div>
        </aside>

        {/* Dynamic products list panel */}
        <section className="flex-1 w-full space-y-6">
          {/* Top Sort and layout controllers */}
          <div className="bg-white border border-neutral-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-neutral-500 font-medium">
              Encontrados <strong className="text-neutral-800">{filteredProducts.length}</strong> itens luxo neste departamento.
            </p>

            <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end">
              {/* SortDropdown */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-neutral-50 border border-neutral-250 rounded px-2.5 py-1.5 outline-none font-bold text-neutral-800 focus:border-neutral-900 cursor-pointer"
                >
                  <option value="relevance">Mais Relevantes</option>
                  <option value="low_to_high">Menor Preço</option>
                  <option value="high_to_low">Maior Preço</option>
                  <option value="ratings">Melhor Avaliados</option>
                  <option value="views">Produtos Populares</option>
                </select>
              </div>

              {/* View layout modes */}
              <div className="flex border border-neutral-200 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 cursor-pointer ${viewMode === 'grid' ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-400 hover:text-neutral-700'}`}
                  title="Grelha de Cards"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 cursor-pointer ${viewMode === 'list' ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-400 hover:text-neutral-700'}`}
                  title="Listagem de Linha"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Items Output and Layout Switcher */}
          {displayedProducts.length > 0 ? (
            viewMode === 'grid' ? (
              /* Grid Layout */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {displayedProducts.map((p) => {
                  const isWishlisted = wishlist.some(item => item.id === p.id);
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onNavigate={onNavigate}
                      onAddToCart={onAddToCart}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={isWishlisted}
                    />
                  );
                })}
              </div>
            ) : (
              /* List Layout style with wider details */
              <div className="space-y-4">
                {displayedProducts.map((p) => {
                  const isWishlisted = wishlist.some(item => item.id === p.id);
                  const hasDiscount = p.promoPrice && p.promoPrice < p.price;
                  const activePrice = p.promoPrice || p.price;

                  return (
                    <div 
                      key={p.id}
                      onClick={() => onNavigate('product', { id: p.id })}
                      className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg p-4 flex flex-col sm:flex-row gap-5 cursor-pointer transition-shadow"
                    >
                      <div className="w-full sm:w-44 h-44 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {hasDiscount && (
                          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            PROMO
                          </span>
                        )}
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest">
                            <span>{p.brand}</span>
                            <span>•</span>
                            <span className="text-amber-500">★ {p.rating} ({p.reviewsCount})</span>
                          </div>
                          <h3 className="text-base font-bold text-neutral-800 hover:text-neutral-950 transition-colors">{p.name}</h3>
                          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{p.description}</p>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3.5">
                          <div className="space-y-0.5">
                            {hasDiscount && <p className="text-xs text-neutral-400 line-through">R$ {p.price.toFixed(2)}</p>}
                            <p className="text-lg font-black text-neutral-900">R$ {activePrice.toFixed(2)}</p>
                            <p className="text-[10px] text-neutral-500">{getInstallmentText(activePrice)}</p>
                            <p className="text-xs font-bold text-emerald-600">R$ {getPixValue(activePrice)} no PIX</p>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={(e) => { e.stopPropagation(); onToggleWishlist(p); }}
                              className="px-3 py-2 border border-neutral-200 rounded-lg text-neutral-500 hover:text-red-500 hover:bg-neutral-50 cursor-pointer"
                            >
                              ❤️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(p, 1, p.colors[0], p.sizes?.[0]);
                              }}
                              className="flex-1 sm:flex-initial bg-neutral-950 hover:bg-neutral-850 text-white font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer"
                            >
                              Adicionar ao Carrinho
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center max-w-lg mx-auto space-y-4">
              <span className="text-4xl text-neutral-400">🔍</span>
              <h3 className="text-base font-bold text-neutral-800">Nenhum produto correspondente</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Tente relaxar os filtros laterais selecionados ou escolha uma faixa de preço com maior espectro para ver os produtos.
              </p>
            </div>
          )}

          {/* 4. Infinite Pagination simulation */}
          {filteredProducts.length > displayedProducts.length && (
            <div className="text-center pt-4">
              <button
                onClick={triggerLoadMore}
                disabled={isAppending}
                className="bg-white hover:bg-neutral-50 border border-neutral-250 text-xs font-bold px-6 py-3 rounded-lg transition-all inline-flex items-center gap-2 cursor-pointer outline-none select-none disabled:opacity-50"
              >
                {isAppending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
                    Carregando mais produtos elegíveis...
                  </>
                ) : (
                  'Carregar mais Produtos'
                )}
              </button>
              <p className="text-[10px] text-neutral-400 mt-2 font-mono">Exibindo {displayedProducts.length} de {filteredProducts.length} itens totais</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
