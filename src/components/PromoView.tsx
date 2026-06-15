/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BadgePercent, Clock, ShieldCheck, Tag, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { SAMPLE_COUPONS } from '../data';
import ProductCard from './ProductCard';

interface PromoViewProps {
  products: Product[];
  onNavigate: (page: string, params?: any) => void;
  onAddToCart: (product: Product, quantity: number, color: string, size?: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
}

export default function PromoView({
  products,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlist
}: PromoViewProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const promoProducts = products.filter(p => p.promoPrice || p.isFlashSale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Promo Header Banner */}
      <div className="bg-linear-to-r from-red-600 via-amber-500 to-red-600 text-white rounded-3xl p-8 text-center space-y-3 relative overflow-hidden shadow-lg">
        <span className="bg-white/20 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider animate-pulse">
          ⚡ QUEIMA DE ESTOQUE KAKÁ 2026
        </span>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">OFERTAS & CUPONS EXTRAORDINÁRIOS</h1>
        <p className="text-xs md:text-sm text-amber-50 font-medium max-w-2xl mx-auto">
          Mantenha seus olhos bem abertos. Separamos nesta listagem todos os smartphones, calçados e perfumes com margens com desconto. Ative cupons para baratear ainda mais o Pix!
        </p>
      </div>

      {/* Grid of Coupons card */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-neutral-900 uppercase">CUPONS SECRETOS LIBERADOS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_COUPONS.map((cp) => (
            <div 
              key={cp.code} 
              className="bg-white border-2 border-dashed border-neutral-300 p-5 rounded-2xl text-center space-y-4 relative group hover:border-amber-500 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-amber-600 bg-amber-50 px-2.5 py-1 text-[10px] rounded-full font-black uppercase font-mono">
                  {cp.type === 'percentage' ? `${cp.discountValue}% De desconto` : `R$ ${cp.discountValue} OFF`}
                </span>
                <p className="text-sm font-black text-neutral-850 mt-1.5">{cp.code}</p>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium min-h-8">{cp.description}</p>
              <button
                onClick={() => handleCopy(cp.code)}
                className={`w-full py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${copiedCode === cp.code ? 'bg-emerald-600 text-white' : 'bg-neutral-950 text-white hover:bg-amber-500 hover:text-neutral-950'}`}
              >
                {copiedCode === cp.code ? (
                  <>
                    <Check className="w-4 h-4" /> Resgatado!
                  </>
                ) : (
                  'Resgatar Código'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of promo items catalog */}
      <div className="space-y-6">
        <h2 className="text-lg font-black text-neutral-900 uppercase border-l-4 border-red-500 pl-3">
          PRODUTOS EM OFERTA / SMARTPHONES E VESTUÁRIOS
        </h2>

        {promoProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {promoProducts.map((p) => {
              const itemWishlisted = wishlist.some(item => item.id === p.id);
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  onNavigate={onNavigate}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={itemWishlisted}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-xs italic text-neutral-520">Procurando promoções ativas adicionais...</p>
        )}
      </div>
    </div>
  );
}
