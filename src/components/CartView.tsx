/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Trash2, 
  ShoppingCart, 
  Gift, 
  Truck, 
  Plus, 
  Minus, 
  ChevronRight, 
  ArrowLeft,
  BadgePercent,
  Check
} from 'lucide-react';
import { Product, CartItem, Coupon } from '../types';
import { SAMPLE_COUPONS, getInstallmentText, getPixValue } from '../data';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, qty: number, color: string, size?: string) => void;
  onRemoveItem: (productId: string, color: string, size?: string) => void;
  onNavigate: (page: string, params?: any) => void;
  onToggleWishlist: (product: Product) => void;
  products: Product[];
}

export default function CartView({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  onToggleWishlist,
  products
}: CartViewProps) {
  // Coupon applied code
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Shipping mockup
  const [cartCep, setCartCep] = useState('');
  const [simulatedShipping, setSimulatedShipping] = useState<number | null>(null);

  // Financial calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const activePrice = item.product.promoPrice || item.product.price;
      return acc + (activePrice * item.quantity);
    }, 0);
  }, [cart]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (cart.length === 0) {
      setCouponError('Adicione pelo menos um produto no carrinho para validar cupons.');
      return;
    }

    const matched = SAMPLE_COUPONS.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (matched) {
      if (subtotal < matched.minPurchase) {
        setCouponError(`Esse cupom requer valor mínimo de R$ ${matched.minPurchase.toFixed(2)} em produtos.`);
        return;
      }
      setAppliedCoupon(matched);
      setCouponSuccess(`Cupom "${matched.code}" ativado com sucesso!`);
      setCouponInput('');
    } else {
      setCouponError('Este cupom não existe ou já expirou.');
    }
  };

  const discountValue = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      return appliedCoupon.discountValue; // fixed
    }
  }, [appliedCoupon, subtotal]);

  const activeShipping = useMemo(() => {
    if (subtotal > 150) return 0; // free shipping above R$ 150
    return simulatedShipping !== null ? simulatedShipping : 15.00;
  }, [subtotal, simulatedShipping]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal + activeShipping - discountValue);
  }, [subtotal, activeShipping, discountValue]);

  // Simulate cep entries
  const handleCalculateShipping = () => {
    if (cartCep.replace(/\D/g, '').length === 8) {
      const parsed = Math.min(25, Math.max(0, (subtotal > 150 ? 0 : 15.00)));
      setSimulatedShipping(parsed);
    }
  };

  // Cross Sell / Recommended Small Products that are not currently in the cart
  const crossSellProducts = useMemo(() => {
    return products
      .filter(p => !cart.some(c => c.product.id === p.id))
      .slice(0, 3);
  }, [products, cart]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-neutral-900" />
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight">MEU CARRINHO DE COMPRAS</h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-neutral-50 border border-neutral-200 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-bold text-neutral-800">Seu carrinho de compras está vazio</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Parece que você ainda não adicionou nenhum item do nosso catálogo premium ao seu carrinho. Que tal voltar e desbravar nossos perfumes importados ou smartphones?
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-neutral-950 hover:bg-neutral-850 text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer"
          >
            Voltar para a Página Inicial
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Cart items listing Column */}
          <div className="flex-1 w-full space-y-4">
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 text-neutral-400 font-extrabold uppercase text-[10px] tracking-wider hidden sm:grid grid-cols-12 gap-4">
                <span className="col-span-6">PRODUTO SELECIONADO</span>
                <span className="col-span-3 text-center">QUANTIDADE</span>
                <span className="col-span-3 text-right">TOTAL</span>
              </div>

              <div className="divide-y divide-neutral-200">
                {cart.map((item, idx) => {
                  const activePrice = item.product.promoPrice || item.product.price;
                  const itemTotal = activePrice * item.quantity;
                  
                  return (
                    <div 
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center hover:bg-neutral-50/50 transition-colors"
                    >
                      {/* Thumbnail & Description */}
                      <div className="col-span-1 sm:col-span-6 flex gap-4">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 object-cover rounded-xl border border-neutral-200 bg-neutral-100 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <p className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wide">{item.product.brand}</p>
                          <h4 
                            onClick={() => onNavigate('product', { id: item.product.id })}
                            className="font-bold text-xs text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer line-clamp-2"
                          >
                            {item.product.name}
                          </h4>
                          <div className="flex flex-wrap gap-1.5 text-[9px] font-bold text-neutral-500 uppercase pt-0.5">
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">C: {item.selectedColor}</span>
                            {item.selectedSize && (
                              <span className="bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">T: {item.selectedSize}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity select */}
                      <div className="col-span-1 sm:col-span-3 flex justify-center">
                        <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden text-xs">
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.selectedColor, item.selectedSize)}
                            className="p-1.5 hover:bg-neutral-50 cursor-pointer text-neutral-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3.5 font-bold text-neutral-800 font-mono">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1), item.selectedColor, item.selectedSize)}
                            className="p-1.5 hover:bg-neutral-50 cursor-pointer text-neutral-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Total cost + remove actions */}
                      <div className="col-span-1 sm:col-span-3 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <p className="font-extrabold text-sm text-neutral-900">R$ {itemTotal.toFixed(2)}</p>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                          className="text-neutral-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                          title="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Cross-sell add-on container */}
            {crossSellProducts.length > 0 && (
              <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-2xl space-y-4">
                <p className="text-xs font-black text-neutral-800 uppercase tracking-wide">APROVEITE E COMPRE JUNTO COM DESCONTO:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {crossSellProducts.map((p) => (
                    <div 
                      key={p.id} 
                      className="bg-white border border-neutral-200 p-3.5 rounded-xl shadow-xs flex flex-row sm:flex-col justify-between items-center text-center gap-3"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-14 h-14 object-cover rounded border" />
                      <div className="flex-1 sm:flex-initial text-left sm:text-center">
                        <h4 className="font-bold text-[11px] text-neutral-800 truncate max-w-[130px]">{p.name}</h4>
                        <p className="font-black text-xs text-neutral-900 mt-1">R$ {(p.promoPrice || p.price).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => onUpdateQuantity(p.id, 1, p.colors[0], p.sizes?.[0])}
                        className="bg-neutral-950 hover:bg-amber-500 text-white hover:text-neutral-950 font-bold text-[10px] py-1 px-2.5 rounded cursor-pointer"
                      >
                        + Adicionar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checkout Financial summary Column */}
          <aside className="w-full lg:w-96 space-y-4">
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-black text-xs text-neutral-800 tracking-wider uppercase border-b border-neutral-100 pb-3">RESUMO FINANCEIRO</h3>

              {/* Pricing breakdown */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal dos itens</span>
                  <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-neutral-600">
                  <span>Entrega estimada</span>
                  <span className="font-semibold">
                    {subtotal > 150 ? (
                      <span className="text-emerald-600">GRÁTIS</span>
                    ) : (
                      `R$ ${activeShipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded border border-emerald-200">
                    <span className="flex items-center gap-1">🎟️ Cupom ({appliedCoupon.code})</span>
                    <span>- R$ {discountValue.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-black text-neutral-900">Total a pagar</span>
                  <span className="text-xl font-black text-neutral-950">R$ {finalTotal.toFixed(2)}</span>
                </div>

                {/* Subsidized PIX calculations */}
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg border border-emerald-250 text-[11px] font-bold">
                  <p className="flex items-center gap-1">⚡ Preço para pagamento no PIX:</p>
                  <p className="text-base font-black mt-1">R$ {getPixValue(finalTotal)} <span className="text-xs font-normal text-emerald-600">(Economize instantâneo 10%)</span></p>
                </div>
              </div>

              {/* Coupon activation form */}
              <div className="border-t border-neutral-200 pt-4">
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="block text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest">Aplicar Cupom VIP</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: KAKA10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-neutral-50 text-xs px-3 py-2 rounded-lg border border-neutral-250 outline-none focus:border-neutral-950 font-bold"
                    />
                    <button
                      type="submit"
                      className="bg-neutral-950 hover:bg-neutral-850 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Validar
                    </button>
                  </div>
                </form>
                {couponError && <p className="text-[10px] text-red-600 font-black mt-2 leading-tight">❌ {couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-600 font-black mt-2 leading-tight">✓ {couponSuccess}</p>}
              </div>

              {/* Shipping simulator inside summary box */}
              {subtotal <= 150 && (
                <div className="border-t border-neutral-200 pt-4 space-y-2">
                  <label className="block text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest">Calcular Envio</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: 01420-000"
                      value={cartCep}
                      onChange={(e) => setCartCep(e.target.value)}
                      className="flex-1 bg-neutral-50 text-xs px-3 py-2 rounded-lg border border-neutral-250 outline-none focus:border-neutral-950 font-semibold"
                    />
                    <button
                      onClick={handleCalculateShipping}
                      className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Calcular
                    </button>
                  </div>
                </div>
              )}

              {/* Checkout dynamic trigger button */}
              <button
                onClick={() => onNavigate('checkout', { 
                  couponApplied: appliedCoupon ? appliedCoupon.code : undefined,
                  discountVal: discountValue,
                  shippingVal: activeShipping
                })}
                className="w-full bg-neutral-950 hover:bg-amber-500 text-white hover:text-neutral-950 font-black text-xs py-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                id="cart_checkout_proceed_btn"
              >
                Prosseguir para o Checkout
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="w-full text-center text-xs text-neutral-500 hover:text-neutral-900 font-bold flex items-center justify-center gap-1.5 py-2 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao catálogo e ver mais
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
