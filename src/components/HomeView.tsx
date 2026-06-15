/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Bookmark, 
  Gift, 
  Check, 
  ArrowRight, 
  Star, 
  Package, 
  Volume2, 
  Sparkles,
  Award,
  BadgePercent
} from 'lucide-react';
import { Product, Coupon } from '../types';
import { SAMPLE_COUPONS, MOCK_CURATED_BRANDS, MOCK_REVIEWS_POOL } from '../data';
import ProductCard from './ProductCard';

interface HomeViewProps {
  products: Product[];
  onNavigate: (page: string, params?: any) => void;
  onAddToCart: (product: Product, quantity: number, color: string, size?: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
}

export default function HomeView({
  products,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlist
}: HomeViewProps) {
  // 1. Fullscreen Slider Banner
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
      tag: 'OUTONO - INVERNO 2026',
      title: 'Moda Premium & Tecidos Nobres',
      desc: 'Coleção inteiramente elaborada na Europa e inspirada em cortes limpos e minimalistas. Ganhe até R$ 200 de cashback na primeira peça.',
      cta: 'Ver Coleção de Moda',
      category: 'Moda Masculina'
    },
    {
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
      tag: 'SISTEMAS GAMER & PERIFÉRICOS',
      title: 'Potência Máxima Próxima Geração',
      desc: 'Sinta cada batida e movimento com monitores 240Hz, teclados LightSpeed e consoles PS5 Slim à pronta entrega com cupom exclusivo.',
      cta: 'Ver Linha Gamer',
      category: 'Games & Consoles'
    },
    {
      image: 'https://images.unsplash.com/photo-1512303500391-74e5b8c4c07f?auto=format&fit=crop&q=80&w=1200',
      tag: 'TECNOLOGIA MOBILE TITANIUM',
      title: 'iPhone 15 Pro Max Titanium',
      desc: 'Estoque recém-abastecido com valores imbatíveis no PIX. Atendimento prioritário pós-compra e seguro residencial grátis por um ano.',
      cta: 'Desbravar iPhones',
      category: 'Smartphones'
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  // 2. Countdown Timer for Flash Sale (counts down to 5h 00m 00s)
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 59, seconds: 59 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 59, seconds: 59 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Coupon Caching & Clipboard Copier state
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => {
      setCopiedCoupon(null);
    }, 2500);
  };

  // Curate product lists
  const flashSaleProducts = products.filter(p => p.isFlashSale);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="w-full space-y-12">
      {/* 1. Fullscreen Slider Hero Banner */}
      <section className="relative h-[420px] md:h-[500px] w-full overflow-hidden bg-neutral-900 text-white">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Slide background with dark overlay */}
            <div className="absolute inset-0 bg-black/45 z-10"></div>
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover"
            />
            
            {/* Slide Information */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-8 sm:px-16 md:px-24 max-w-4xl space-y-3 md:space-y-4 animate-fade-in">
              <span className="bg-amber-500 text-neutral-950 font-black text-[10px] md:text-xs tracking-widest px-3 py-1 rounded">
                {slide.tag}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
                {slide.title}
              </h1>
              <p className="text-sm md:text-base text-neutral-200 font-medium">
                {slide.desc}
              </p>
              <button
                onClick={() => onNavigate('category', { category: slide.category })}
                className="bg-white hover:bg-amber-500 text-neutral-950 hover:text-neutral-950 font-extrabold text-xs md:text-sm px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md group cursor-pointer"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}

        {/* Manual Slides Controllers */}
        <button
          onClick={() => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </section>

      {/* 2. Interactive Coupons list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 p-6 md:p-8 rounded-2xl border border-neutral-800 text-white flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Inner details accent */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>

          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-amber-500 text-xs font-bold uppercase tracking-wider flex items-center justify-center lg:justify-start gap-1">
              <Gift className="w-4 h-4" /> RECOMPENSAS EXCLUSIVAS ATIVAS
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">CUPONS ESPECIAIS KAKÁ MULTIMARCAS</h2>
            <p className="text-xs text-neutral-400">Copie o código abaixo e insira na tela de faturamento para destravar bônus extras e frete grátis.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
            {SAMPLE_COUPONS.map((cp) => (
              <div 
                key={cp.code} 
                className="bg-neutral-800/60 border border-neutral-700 p-3.5 rounded-xl flex flex-col justify-between text-center relative group"
              >
                <div className="border-b border-dashed border-neutral-700 pb-2 mb-2">
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase bg-amber-500/10 px-2 py-0.5 rounded">
                    {cp.type === 'percentage' ? `${cp.discountValue}% OFF` : `R$ ${cp.discountValue} OFF`}
                  </span>
                  <p className="text-xs font-bold text-neutral-100 mt-1.5">{cp.code}</p>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium mb-3 min-h-6">{cp.description}</p>
                <button
                  onClick={() => handleCopyCoupon(cp.code)}
                  className={`w-full py-1.5 rounded text-[10px] font-extrabold tracking-wide uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${copiedCoupon === cp.code ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-amber-500 text-neutral-950'}`}
                >
                  {copiedCoupon === cp.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copiado!
                    </>
                  ) : (
                    'Copiar Cupom'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Flash Sales (Ofertas do Dia) with visual layout & interactive timer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-neutral-200 mb-6 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-500 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-neutral-900 uppercase">OFERTAS FLASH DO DIA</h2>
              <p className="text-xs text-neutral-500">As ofertas mais desejadas do Brasil com margens esmagadas por tempo limitado.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-900 text-white px-4 py-2 rounded-xl text-xs font-bold font-mono">
            <span>OFERTA TERMINA EM:</span>
            <span className="bg-red-600 px-1.5 py-0.5 rounded text-white animate-pulse">{String(countdown.hours).padStart(2, '0')}h</span>
            <span>:</span>
            <span className="bg-neutral-800 px-1.5 py-0.5 rounded">{String(countdown.minutes).padStart(2, '0')}m</span>
            <span>:</span>
            <span className="bg-neutral-800 px-1.5 py-0.5 rounded">{String(countdown.seconds).padStart(2, '0')}s</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {flashSaleProducts.length > 0 ? (
            flashSaleProducts.map((p) => {
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
            })
          ) : (
            <p className="text-sm italic text-neutral-500 col-span-4 text-center py-8">Nenhuma oferta flash ativa no momento...</p>
          )}
        </div>
      </section>

      {/* 4. Visual Promo Banner Bento Banner Duo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner Left */}
        <div className="relative h-64 rounded-2xl overflow-hidden group bg-neutral-950">
          <img
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=700"
            alt="Moda calçados"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent p-6 flex flex-col justify-end space-y-1.5">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">LINHA URBAN CASUAL</span>
            <h3 className="text-xl font-extrabold text-white">Calçados & Tênis Nike Icônicos</h3>
            <p className="text-xs text-neutral-300 max-w-sm">Destaques esportivos e casuais que unem tecnologia de absorção de impacto com couro premium.</p>
            <button 
              onClick={() => onNavigate('category', { category: 'Calçados' })}
              className="mt-3 bg-white text-neutral-950 hover:bg-amber-500 hover:text-neutral-950 font-bold text-[11px] px-4 py-2 rounded-lg w-fit transition-colors cursor-pointer"
            >
              Comprar Calçados
            </button>
          </div>
        </div>

        {/* Banner Right */}
        <div className="relative h-64 rounded-2xl overflow-hidden group bg-neutral-950">
          <img
            src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=700"
            alt="Perfumes rarificados"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent p-6 flex flex-col justify-end space-y-1.5">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">AROMAS & ELEGÂNCIA</span>
            <h3 className="text-xl font-extrabold text-white">Fragrâncias & Perfumaria Fina</h3>
            <p className="text-xs text-neutral-300 max-w-sm">Essências legítimas e importados de grifes de alta costura com garantia de procedência.</p>
            <button 
              onClick={() => onNavigate('category', { category: 'Perfumes Importados' })}
              className="mt-3 bg-white text-neutral-950 hover:bg-amber-500 hover:text-neutral-950 font-bold text-[11px] px-4 py-2 rounded-lg w-fit transition-colors cursor-pointer"
            >
              Comprar Essências
            </button>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers & New Arrivals Category Tabs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-black text-neutral-900 uppercase mb-6 tracking-wide border-l-4 border-amber-500 pl-3">
          OS MAIS VENDIDOS DA PLATAFORMA
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map((p) => {
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
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-black text-neutral-900 uppercase mb-6 tracking-wide border-l-4 border-neutral-950 pl-3">
          RECONHECIMENTO EM PRIMEIRA MÃO (LANÇAMENTOS)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((p) => {
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
      </section>

      {/* 6. Partner Brands Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-neutral-50 rounded-2xl border border-neutral-100">
        <div className="text-center space-y-1.5 mb-8">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">NOSSOS PARCEIROS</span>
          <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase tracking-tight">MARCAS MUNDIAIS COBERTAS</h2>
          <p className="text-xs text-neutral-400 max-w-lg mx-auto">Parceria estratégica estreita com as maiores multinacionais de vestuário, dispositivos eletrônicos e perfumaria fina.</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-7 gap-4 items-center justify-center">
          {MOCK_CURATED_BRANDS.map((b, idx) => (
            <div 
              key={idx} 
              onClick={() => onNavigate('brands')}
              className="bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl p-4 flex flex-col justify-center items-center h-24 cursor-pointer transition-all shadow-xs group"
            >
              <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{b.logo}</span>
              <span className="text-[11px] font-extrabold text-neutral-700 mt-2 group-hover:text-neutral-950">{b.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Customers Feedback Showcase Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-1 mb-10">
          <span className="text-emerald-600 text-xs font-extrabold uppercase bg-emerald-50 px-2.5 py-1 rounded-full">✓ COMPRADORES REAIS SATISFEITOS</span>
          <h2 className="text-xl font-black text-neutral-900 uppercase mt-2">AVALIAÇÕES DE QUEM ADQUIRIU CONOSCO</h2>
          <p className="text-xs text-neutral-400">Total transparência. Leia opiniões e feedbacks reais auditados por canais independentes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_REVIEWS_POOL.slice(0, 3).map((r, idx) => (
            <div key={idx} className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3.5 mb-3.5">
                  <div>
                    <h4 className="font-extrabold text-xs text-neutral-800">{r.userName}</h4>
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Comprador Verificado</span>
                  </div>
                  <div className="flex text-amber-500 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-500' : 'text-neutral-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed italic">"{r.comment}"</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] text-neutral-400">
                <span>Avaliado em {r.date}</span>
                <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">👍 Útil ({r.likes})</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
