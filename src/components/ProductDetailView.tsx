/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Truck, 
  ShieldCheck, 
  CircleDot, 
  HelpCircle, 
  MessageSquare, 
  Award, 
  ChevronRight, 
  Check, 
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';
import { Product, Review } from '../types';
import { getInstallmentText, getPixValue, MOCK_REVIEWS_POOL } from '../data';
import ProductCard from './ProductCard';

interface ProductDetailViewProps {
  productId: string;
  products: Product[];
  onNavigate: (page: string, params?: any) => void;
  onAddToCart: (product: Product, quantity: number, color: string, size?: string) => void;
  onInstantBuy: (product: Product, quantity: number, color: string, size?: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
}

export default function ProductDetailView({
  productId,
  products,
  onNavigate,
  onAddToCart,
  onInstantBuy,
  onToggleWishlist,
  wishlist
}: ProductDetailViewProps) {
  // Find current product
  const product = useMemo(() => {
    return products.find(p => p.id === productId) || products[0];
  }, [products, productId]);

  // Gallery view State
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });

  // Buy Options State
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : undefined);
  const [quantity, setQuantity] = useState(1);

  // Tabs layout Section
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'faq'>('desc');

  // Interactive Question State
  const [faqInput, setFaqInput] = useState('');
  const [faqList, setFaqList] = useState<Array<{ q: string; a: string; date: string }>>([
    { q: 'O produto é original de fábrica?', a: 'Sim, todos os produtos comercializados na Kaká Multimarcas são originais, adquiridos diretamente de representantes homologados e enviados com NF-e original.', date: '04/06/2026' },
    { q: 'Qual o prazo médio de despacho?', a: 'Para pedidos fechados em cartão ou Pix até as 14h, garantimos envio no mesmo dia útil via transportadora aérea expressa.', date: '25/05/2026' }
  ]);
  const [faqStatus, setFaqStatus] = useState(false);

  // shipping calculator mockup
  const [cep, setCep] = useState('');
  const [shippingResult, setShippingResult] = useState<Array<{ name: string; price: number; days: number }> | null>(null);

  // related items
  const relatedProducts = useMemo(() => {
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${product.images[activeImageIdx]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (faqInput.trim()) {
      const q = faqInput.trim();
      setFaqStatus(true);
      setTimeout(() => {
        setFaqList(prev => [
          { q, a: 'Agradecemos sua pergunta! Nosso consultor VIP Kaká analisará sua dúvida e a responderá em instantes. Por favor, acompanhe seu e-mail cadastrado.', date: 'Hoje' },
          ...prev
        ]);
        setFaqInput('');
        setFaqStatus(false);
      }, 1000);
    }
  };

  const calculateShipping = () => {
    if (cep.replace(/\D/g, '').length === 8) {
      setShippingResult([
        { name: 'Entrega Expressa Kaká Logística', price: 0, days: 2 },
        { name: 'Transportadora Sedex Aéreo', price: 24.90, days: 1 },
        { name: 'PAC Econômico Correios', price: 9.90, days: 5 }
      ]);
    }
  };

  const isWishlisted = wishlist.some(item => item.id === product.id);
  const activePrice = product.promoPrice || product.price;
  const savingAmount = product.promoPrice ? product.price - product.promoPrice : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs trail */}
      <div className="text-xs font-semibold text-neutral-400 flex flex-wrap items-center gap-1.5 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
        <span className="hover:text-neutral-700 cursor-pointer" onClick={() => onNavigate('home')}>Início</span>
        <span>/</span>
        <span className="hover:text-neutral-700 cursor-pointer" onClick={() => onNavigate('category', { category: product.category })}>{product.category}</span>
        <span>/</span>
        <span className="text-neutral-900 font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Primary single-shelf layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-white border border-neutral-200 rounded-3xl p-6 md:p-10 shadow-sm">
        
        {/* Left Side: Product Gallery Zoom */}
        <div className="space-y-4">
          <div 
            className="relative bg-neutral-100 rounded-2xl overflow-hidden aspect-square border border-neutral-200 cursor-zoom-in"
            onMouseMove={handleZoom}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={product.images[activeImageIdx]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Magnifying Glass Overlay */}
            <div 
              style={zoomStyle} 
              className="absolute inset-0 pointer-events-none bg-no-repeat transition-opacity"
            />
          </div>

          {/* Thumbnails list */}
          <div className="flex gap-3">
            {product.images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-neutral-50 cursor-pointer transition-colors ${idx === activeImageIdx ? 'border-amber-500' : 'border-neutral-200 hover:border-neutral-400'}`}
              >
                <img src={imgUrl} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details info shelf */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-amber-600 bg-amber-50 rounded font-black text-[10px] tracking-wide px-2.5 py-1 uppercase">
                🏷️ {product.brand} Oficial
              </span>
              <span className="text-xs text-neutral-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-905 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-neutral-200'}`} />
                ))}
              </div>
              <span className="font-bold text-neutral-800">{product.rating}</span>
              <span>•</span>
              <span className="underline hover:text-neutral-800 cursor-pointer">{product.reviewsCount} Avaliações de Clientes</span>
            </div>
          </div>

          {/* Price breakdown and checkout metrics */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-150 space-y-3.5">
            <div className="space-y-0.5">
              {product.promoPrice && (
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span className="line-through">De R$ {product.price.toFixed(2)}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">Economize R$ {savingAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl md:text-3xl font-black text-neutral-900">R$ {activePrice.toFixed(2)}</span>
                <span className="text-xs text-neutral-500 font-medium">no cartão em até 10x</span>
              </div>
              <p className="text-xs text-neutral-500">{getInstallmentText(activePrice)}</p>
            </div>

            {/* PIX promotion highlight card */}
            <div className="border-t border-neutral-200/80 pt-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-emerald-700 flex items-center gap-1">
                  <span>⚡</span> R$ {getPixValue(activePrice)} no PIX
                </p>
                <p className="text-[10px] text-neutral-400">Mais 10% de cashback VIP extra imediato creditado em carteira.</p>
              </div>
              <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-1 rounded tracking-wide uppercase">
                10% OFF EXTRA
              </span>
            </div>
          </div>

          {/* Interactive variant selections */}
          <div className="space-y-4">
            {/* Color variable matches circles */}
            <div>
              <p className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Selecione a Cor: <strong className="text-neutral-800">{selectedColor}</strong></p>
              <div className="flex gap-2">
                {product.colors.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedColor(col); }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${selectedColor === col ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200'}`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes variable capsules */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Tamanho Elegível: <strong className="text-neutral-800">{selectedSize}</strong></p>
                <div className="flex gap-2.5">
                  {product.sizes.map((sz, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedSize(sz); }}
                      className={`w-11 h-11 rounded-lg border flex items-center justify-center text-xs font-black cursor-pointer transition-all ${selectedSize === sz ? 'bg-neutral-950 text-white border-white' : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity select inputs */}
            <div>
              <p className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Quantidade de itens</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-300 rounded-lg bg-neutral-50 overflow-hidden">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2.5 hover:bg-neutral-100 cursor-pointer text-neutral-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-5 text-sm font-black text-neutral-800 tracking-wider font-mono">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="p-2.5 hover:bg-neutral-100 cursor-pointer text-neutral-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-neutral-400 font-medium">Apenas {product.stock} unidades em estoque de pronta entrega.</span>
              </div>
            </div>
          </div>

          {/* Action purchase CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
            <button
              onClick={() => onAddToCart(product, quantity, selectedColor, selectedSize)}
              className="w-full bg-white hover:bg-neutral-50 text-neutral-950 font-black tracking-wide border-2 border-neutral-950 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              Adicionar ao Carrinho
            </button>
            <button
              onClick={() => onInstantBuy(product, quantity, selectedColor, selectedSize)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black tracking-wide py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              🚀 Comprar Agora (Pix/Crd)
            </button>
          </div>

          <button
            onClick={() => onToggleWishlist(product)}
            className="w-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-200"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            {isWishlisted ? 'Remover dos meus Favoritos' : 'Gravar na minha Lista de Desejos'}
          </button>

          {/* Shipping simulation box */}
          <div className="pt-4 border-t border-neutral-100 space-y-2.5">
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest">Simular Custos de Entrega</label>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Ex: 01310-100"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="flex-1 bg-neutral-50 text-xs px-3.5 py-2 rounded-lg border border-neutral-250 font-semibold outline-none focus:border-neutral-900"
              />
              <button
                onClick={calculateShipping}
                className="bg-neutral-950 hover:bg-neutral-850 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
              >
                Calcular
              </button>
            </div>
            {shippingResult && (
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-1.5">
                {shippingResult.map((sh, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-neutral-600 font-medium">{sh.name}</span>
                    <span className="font-extrabold text-neutral-800">
                      {sh.price === 0 ? 'GRÁTIS' : `R$ ${sh.price.toFixed(2)}`}{' '}
                      <span className="text-[10px] text-neutral-400 font-normal">({sh.days} {sh.days === 1 ? 'dia' : 'dias'})</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail / Specs / reviews Tabs segment */}
      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="flex border-b border-neutral-200 bg-neutral-50 font-bold text-xs sm:text-sm text-neutral-500 select-none overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-6 py-4 border-r border-neutral-200 cursor-pointer whitespace-nowrap ${activeTab === 'desc' ? 'bg-white text-neutral-950 font-black border-b-2 border-b-amber-500' : 'hover:bg-neutral-100/50 hover:text-neutral-800'}`}
          >
            Descrição Geral
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 border-r border-neutral-200 cursor-pointer whitespace-nowrap ${activeTab === 'specs' ? 'bg-white text-neutral-950 font-black border-b-2 border-b-amber-500' : 'hover:bg-neutral-100/50 hover:text-neutral-800'}`}
          >
            Especificações Técnicas
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 border-r border-neutral-200 cursor-pointer whitespace-nowrap ${activeTab === 'reviews' ? 'bg-white text-neutral-950 font-black border-b-2 border-b-amber-500' : 'hover:bg-neutral-100/50 hover:text-neutral-800'}`}
          >
            Avaliações do Produto ({product.reviewsCount})
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-4 cursor-pointer whitespace-nowrap ${activeTab === 'faq' ? 'bg-white text-neutral-950 font-black border-b-2 border-b-amber-500' : 'hover:bg-neutral-100/50 hover:text-neutral-800'}`}
          >
            Fórum de Dúvidas ({faqList.length})
          </button>
        </div>

        <div className="p-6 md:p-8">
          {/* Tab 1: Description */}
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-4xl text-sm text-neutral-600 leading-relaxed font-medium">
              <p>{product.description}</p>
              <p>Adquirir um item {product.brand} na Kaká Multimarcas é garantia de adquirir elegância em cada costura ou circuito eletrônico. Oferecemos suporte VIP estendido para sanar quaisquer dúvidas pós-venda, além de fornecer códigos reversos automáticos de devolução em até 7 dias úteis de teste prático sem compromisso do usuário.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-neutral-800">100% Legítimo de Fábrica</span>
                </div>
                <div className="flex items-center gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-neutral-800">Suporte VIP via Telefone ou Zap</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Technical Specifications table */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200">
              {Object.entries(product.specs).map(([key, val], idx) => (
                <div key={idx} className="grid grid-cols-3 text-xs p-3.5 hover:bg-neutral-50 transition-colors">
                  <span className="font-bold text-neutral-400 capitalize">{key}</span>
                  <span className="col-span-2 font-semibold text-neutral-700">{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Detailed customer reviews pool */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-neutral-100">
                <div className="bg-neutral-50 rounded-2xl p-5 text-center flex flex-col justify-center items-center">
                  <span className="text-4xl font-extrabold text-neutral-900">{product.rating}</span>
                  <div className="flex text-amber-500 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-500' : 'text-neutral-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400 mt-2">Média da Loja baseada em {product.reviewsCount} notas reais</span>
                </div>

                <div className="col-span-2 flex flex-col justify-center space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-bold text-neutral-500">5 estrelas</span>
                    <div className="flex-1 bg-neutral-100 h-2 rounded overflow-hidden">
                      <div className="bg-amber-500 h-full w-[85%]"></div>
                    </div>
                    <span className="w-8 font-bold text-neutral-600 text-right">85%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-bold text-neutral-500">4 estrelas</span>
                    <div className="flex-1 bg-neutral-100 h-2 rounded overflow-hidden">
                      <div className="bg-amber-500 h-full w-[10%]"></div>
                    </div>
                    <span className="w-8 font-bold text-neutral-600 text-right">10%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-bold text-neutral-500">3 estrelas</span>
                    <div className="flex-1 bg-neutral-100 h-2 rounded overflow-hidden">
                      <div className="bg-amber-500 h-full w-[5%]"></div>
                    </div>
                    <span className="w-8 font-bold text-neutral-600 text-right">5%</span>
                  </div>
                </div>
              </div>

              {/* Show individual reviews */}
              <div className="space-y-4">
                {MOCK_REVIEWS_POOL.map((r, idx) => (
                  <div key={idx} className="bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-150 p-5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-extrabold text-neutral-800">{r.userName}</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-2 font-bold uppercase">Cliente Titular</span>
                      </div>
                      <span className="text-neutral-400">{r.date}</span>
                    </div>
                    <div className="flex text-amber-500 text-[10px]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-500' : ''}`} />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Forum FAQ & Active Interactions widget */}
          {activeTab === 'faq' && (
            <div className="space-y-8">
              {/* Form to submit question */}
              <form onSubmit={handleAddQuestion} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 max-w-2xl space-y-3">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">TEM ALGUMA DÚVIDA? PERGUNTE AGORA AO ESPECIALISTA</p>
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Ex: O carregador do smartphone possui padrão de tomada brasileiro de pinagem dupla?"
                    value={faqInput}
                    onChange={(e) => setFaqInput(e.target.value)}
                    className="flex-1 bg-white text-xs px-4 py-2.5 border border-neutral-255 rounded-xl outline-none focus:border-neutral-900"
                  />
                  <button
                    type="submit"
                    disabled={faqStatus}
                    className="bg-neutral-950 hover:bg-neutral-850 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    {faqStatus ? 'Enviando...' : 'Enviar Pergunta'}
                  </button>
                </div>
              </form>

              {/* FAQ Lists */}
              <div className="space-y-5 max-w-4xl">
                {faqList.map((f, idx) => (
                  <div key={idx} className="border-l-4 border-amber-500 pl-4 space-y-1.5 bg-neutral-50/50 p-3 rounded-r-xl border border-l-0 border-neutral-100">
                    <p className="text-xs font-bold text-neutral-850">❓ Pergunta: {f.q}</p>
                    <p className="text-xs text-neutral-600 font-medium">✨ Resposta Kaká: <span className="font-semibold text-neutral-850">{f.a}</span></p>
                    <p className="text-[10px] text-neutral-400 font-mono text-right">Postado em {f.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-lg font-black text-neutral-950 uppercase tracking-wider border-l-4 border-amber-500 pl-3">
            QUEM COMPROU ESTE ITEM, TAMBÉM SE INTERESSOU POR:
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => {
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
        </section>
      )}
    </div>
  );
}
