/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Star, ShoppingCart, Eye, Flame } from 'lucide-react';
import { Product } from '../types';
import { getInstallmentText, getPixValue } from '../data';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onNavigate: (page: string, params?: any) => void;
  onAddToCart: (product: Product, quantity: number, color: string, size?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function ProductCard({
  product,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}: ProductCardProps) {
  const hasDiscount = product.promoPrice && product.promoPrice < product.price;
  const activePrice = product.promoPrice || product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.promoPrice!) / product.price) * 100)
    : 0;

  const handleProductClick = () => {
    onNavigate('product', { id: product.id });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use first available color and size
    const color = product.colors[0];
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    onAddToCart(product, 1, color, size);
  };

  return (
    <div 
      onClick={handleProductClick}
      className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* 1. Header Badges & Actions */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
        {hasDiscount && (
          <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            -{discountPercentage}% OFF
          </span>
        )}
        {product.isNew && (
          <span className="bg-neutral-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            Novo
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-500 text-neutral-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            Destaque
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className="absolute top-3.5 right-3.5 z-10 bg-white/80 backdrop-blur-xs p-1.5 rounded-full hover:bg-white text-neutral-400 hover:text-red-500 border border-neutral-200 shadow-xs transition-colors cursor-pointer"
        title="Favoritar"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* 2. Banner/Product Image */}
      <div className="relative w-full aspect-square bg-neutral-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Dynamic viewing indicator on hover */}
        <div className="absolute bottom-2 left-2 right-2 bg-neutral-900/80 backdrop-blur-md py-1 px-2 rounded text-[10px] text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Flame className="w-3 h-3 text-amber-500 animate-pulse" />
          <span>{product.viewsCount} visualizações este mês</span>
        </div>
      </div>

      {/* 3. Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5 text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
            <span>{product.brand}</span>
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className="font-semibold text-sm text-neutral-800 line-clamp-2 hover:text-neutral-950 transition-colors mb-2.5">
            {product.name}
          </h3>
        </div>

        <div>
          {/* Prices block */}
          <div className="space-y-0.5 mb-3.5">
            {hasDiscount && (
              <p className="text-neutral-400 line-through text-xs font-medium">
                R$ {product.price.toFixed(2)}
              </p>
            )}
            <p className="text-lg font-black text-neutral-900">
              R$ {activePrice.toFixed(2)}
            </p>
            <p className="text-[11px] text-neutral-500">
              ou {getInstallmentText(activePrice)}
            </p>
            <p className="text-xs font-bold text-emerald-600">
              R$ {getPixValue(activePrice)} no PIX <span className="bg-emerald-50 text-emerald-700 text-[9px] px-1 rounded">10% OFF</span>
            </p>
          </div>

          {/* Color previews */}
          <div className="flex gap-1 mb-4 flex-wrap">
            {product.colors.slice(0, 3).map((col, idx) => (
              <span 
                key={idx} 
                className="text-[9px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded uppercase"
                title={col}
              >
                {col.slice(0, 10)}
              </span>
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-200 px-1 py-0.5 rounded">
                +{product.colors.length - 3}
              </span>
            )}
          </div>

          {/* Quick Buy actions */}
          <button
            onClick={handleQuickAdd}
            className="w-full bg-neutral-950 hover:bg-amber-500 group-hover:bg-neutral-900 hover:text-neutral-950 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            id={`quick_buy_${product.id}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Adicionar Rápido
          </button>
        </div>
      </div>
    </div>
  );
}
