/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Check, 
  ChevronRight, 
  CreditCard, 
  FileText, 
  MapPin, 
  Truck, 
  User as UserIcon, 
  Lock, 
  AlertTriangle, 
  ExternalLink,
  ChevronLeft,
  QrCode,
  Download,
  Award,
  CircleDot
} from 'lucide-react';
import { Product, CartItem, Order } from '../types';
import { getPixValue } from '../data';

interface CheckoutViewProps {
  cart: CartItem[];
  couponApplied?: string;
  discountVal: number;
  shippingVal: number;
  onClearCart: () => void;
  onNavigate: (page: string, params?: any) => void;
  onAddOrderToHistory: (order: Order) => void;
}

export default function CheckoutView({
  cart,
  couponApplied = '',
  discountVal = 0,
  shippingVal = 15.00,
  onClearCart,
  onNavigate,
  onAddOrderToHistory
}: CheckoutViewProps) {
  // Current active stage
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [errorMessage, setErrorMessage] = useState('');

  // Etapa 1: Dados Pessoais
  const [personalName, setPersonalName] = useState('Thiago Leite');
  const [personalEmail, setPersonalEmail] = useState('thiagoleites@gmail.com');
  const [personalCpf, setPersonalCpf] = useState('123.456.789-00');
  const [personalPhone, setPersonalPhone] = useState('(11) 99876-5432');

  // Etapa 2: Endereço
  const [addrZip, setAddrZip] = useState('01310-100');
  const [addrStreet, setAddrStreet] = useState('Avenida Paulista');
  const [addrNum, setAddrNum] = useState('1000');
  const [addrComp, setAddrComp] = useState('Apto 152B');
  const [addrNeighborhood, setAddrNeighborhood] = useState('Bela Vista');
  const [addrCity, setAddrCity] = useState('São Paulo');
  const [addrState, setAddrState] = useState('SP');

  // Etapa 3: Entrega
  const [deliveryType, setDeliveryType] = useState<'express' | 'sedex' | 'pac'>('express');
  const deliveryOptions = {
    express: { name: 'Entrega Expressa Kaká Logística', price: 0, days: '2 dias úteis' },
    sedex: { name: 'Sedex Aéreo Federal', price: 24.90, days: '1 dia útil' },
    pac: { name: 'PAC Econômico Nacional', price: 9.90, days: '5 dias úteis' }
  };

  // Etapa 4: Pagamento
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [creditNum, setCreditNum] = useState('');
  const [creditHolder, setCreditHolder] = useState('THIAGO LEITE');
  const [creditExpiry, setCreditExpiry] = useState('');
  const [creditCvv, setCreditCvv] = useState('');
  const [creditInstallments, setCreditInstallments] = useState('1');

  // Temporary simulation timer for Pix or generated barcode
  const [pixPaidSimulated, setPixPaidSimulated] = useState(false);
  const [checkoutCompletedOrder, setCheckoutCompletedOrder] = useState<Order | null>(null);

  // Financial values
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const p = item.product.promoPrice || item.product.price;
      return acc + (p * item.quantity);
    }, 0);
  }, [cart]);

  const activeShippingPrice = useMemo(() => {
    if (subtotal > 150) return 0; // free shipping above R$ 150
    return deliveryOptions[deliveryType].price;
  }, [subtotal, deliveryType]);

  const totalPayable = useMemo(() => {
    return Math.max(0, subtotal + activeShippingPrice - discountVal);
  }, [subtotal, activeShippingPrice, discountVal]);

  const pixPayable = useMemo(() => {
    return getPixValue(totalPayable);
  }, [totalPayable]);

  const handleStageOneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (personalName.trim().length < 4) {
      setErrorMessage('Por favor, informe seu nome e sobrenome completo.');
      return;
    }
    if (!personalEmail.includes('@')) {
      setErrorMessage('Digite seu endereço de e-mail comercial.');
      return;
    }
    if (personalCpf.length < 11) {
      setErrorMessage('CPF inválido.');
      return;
    }
    setActiveStage(2);
  };

  const handleStageTwoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!addrZip || !addrStreet || !addrNum || !addrNeighborhood || !addrCity) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios do endereço.');
      return;
    }
    setActiveStage(3);
  };

  const handleStageThreeSubmit = () => {
    setActiveStage(4);
  };

  const handleFinishPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (paymentMethod === 'credit_card') {
      if (creditNum.length < 14 || !creditCvv || !creditExpiry) {
        setErrorMessage('Por favor, verifique se todos os campos do cartão foram devidamente inseridos.');
        return;
      }
    }

    // Prepare complete simulated active order payload
    const finalOrder: Order = {
      id: `KAKA-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('pt-BR'),
      items: [...cart],
      subtotal,
      shipping: activeShippingPrice,
      discount: discountVal,
      total: paymentMethod === 'pix' ? Number(pixPayable) : totalPayable,
      paymentMethod,
      status: paymentMethod === 'pix' ? 'processing' : 'pending',
      couponCode: couponApplied || undefined,
      shippingAddress: {
        fullName: personalName,
        street: addrStreet,
        number: addrNum,
        complement: addrComp || undefined,
        neighborhood: addrNeighborhood,
        city: addrCity,
        state: addrState,
        zipCode: addrZip
      },
      trackingCode: `TR-KAKA${Math.floor(10000000 + Math.random() * 90000000)}BR`
    };

    setCheckoutCompletedOrder(finalOrder);
    onAddOrderToHistory(finalOrder);
    
    // Auto pay simulation for Pix
    if (paymentMethod === 'pix') {
      setTimeout(() => {
        setPixPaidSimulated(true);
      }, 5000);
    }

    onClearCart();
    setActiveStage(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Step Tracker Bar */}
      <div className="flex justify-between items-center bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 shadow-xs select-none">
        {[
          { icon: UserIcon, label: 'Identificação', step: 1 },
          { icon: MapPin, label: 'Endereço', step: 2 },
          { icon: Truck, label: 'Expedição', step: 3 },
          { icon: CreditCard, label: 'Pagamento', step: 4 },
          { icon: Check, label: 'Confirmação', step: 5 }
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${activeStage === item.step ? 'bg-neutral-950 text-white border-neutral-950' : activeStage > item.step ? 'bg-emerald-100 text-emerald-800 border-emerald-250' : 'bg-neutral-50 text-neutral-400 border-neutral-200'}`}
            >
              {activeStage > item.step ? <Check className="w-4 h-4" /> : item.step}
            </div>
            <span className={`text-xs font-bold hidden md:inline ${activeStage === item.step ? 'text-neutral-900 font-black' : 'text-neutral-400'}`}>
              {item.label}
            </span>
            {item.step < 5 && <ChevronRight className="w-3.5 h-3.5 text-neutral-300 hidden md:block" />}
          </div>
        ))}
      </div>

      {/* 2. Secondary content panel wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main information col */}
        <div className="lg:col-span-8 space-y-6">
          {errorMessage && (
            <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-4 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STAGE 1: PERSONAL CREDENTIALS */}
          {activeStage === 1 && (
            <form onSubmit={handleStageOneSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
              <h2 className="text-sm font-black tracking-widest text-neutral-800 uppercase pb-3 border-b border-neutral-100 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-amber-500" /> ETAPA 1: DADOS COMPRADOR TITULAR
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Nome e Sobrenome Completo</label>
                  <input
                    type="text"
                    required
                    value={personalName}
                    onChange={(e) => setPersonalName(e.target.value)}
                    placeholder="Ex: Gabriel Barbosa"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold text-neutral-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Endereço de E-mail</label>
                    <input
                      type="email"
                      required
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                      placeholder="seuemail@email.com"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold text-neutral-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Telefone Comercial / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={personalPhone}
                      onChange={(e) => setPersonalPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold text-neutral-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Cadastro de Pessoa Física (CPF)</label>
                  <input
                    type="text"
                    required
                    value={personalCpf}
                    onChange={(e) => setPersonalCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold text-neutral-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-neutral-950 hover:bg-neutral-850 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  Confirmar Comprador <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STAGE 2: SHIPPING ADDRESS */}
          {activeStage === 2 && (
            <form onSubmit={handleStageTwoSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm overflow-hidden">
              <h2 className="text-sm font-black tracking-widest text-neutral-800 uppercase pb-3 border-b border-neutral-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" /> ETAPA 2: COORDENADAS DE EXPEDIÇÃO
              </h2>

              <div className="space-y-4 text-neutral-700">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">CEP Destino</label>
                    <input
                      type="text"
                      required
                      value={addrZip}
                      onChange={(e) => setAddrZip(e.target.value)}
                      placeholder="01310-100"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold text-neutral-855"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Logradouro / Avenida / Rua</label>
                    <input
                      type="text"
                      required
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      placeholder="Avenida Paulista"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold text-neutral-855"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Número Residencial</label>
                    <input
                      type="text"
                      required
                      value={addrNum}
                      onChange={(e) => setAddrNum(e.target.value)}
                      placeholder="Ex: 1000"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold text-neutral-855"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Complemento (Opcional)</label>
                    <input
                      type="text"
                      value={addrComp}
                      onChange={(e) => setAddrComp(e.target.value)}
                      placeholder="Ex: Bloco A, Apartamento 15"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold text-neutral-855"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Bairro</label>
                    <input
                      type="text"
                      required
                      value={addrNeighborhood}
                      onChange={(e) => setAddrNeighborhood(e.target.value)}
                      placeholder="Bela Vista"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Cidade</label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Estado / UF</label>
                    <input
                      type="text"
                      required
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      placeholder="SP"
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStage(1)}
                  className="bg-neutral-100 hover:bg-neutral-150 text-neutral-700 font-bold text-xs py-3 px-5 rounded-xl transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="bg-neutral-950 hover:bg-neutral-850 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  Confirmar Endereço <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STAGE 3: SHIPPING SPEED METHOD */}
          {activeStage === 3 && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-sm font-black tracking-widest text-neutral-800 uppercase pb-3 border-b border-neutral-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" /> ETAPA 3: MODALIDADES DE CORRIDA
              </h2>

              <div className="space-y-3">
                {Object.entries(deliveryOptions).map(([key, opt]) => (
                  <label
                    key={key}
                    onClick={() => setDeliveryType(key as any)}
                    className={`p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${deliveryType === key ? 'border-neutral-950 bg-neutral-50/50' : 'border-neutral-200 hover:border-neutral-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery_option"
                        checked={deliveryType === key}
                        onChange={() => {}}
                        className="accent-neutral-950"
                      />
                      <div>
                        <p className="text-xs font-extrabold text-neutral-800">{opt.name}</p>
                        <p className="text-[10px] text-neutral-400">Tempo estimado de viagem de {opt.days}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-neutral-900">
                      {subtotal > 150 ? 'GRÁTIS' : `R$ ${opt.price.toFixed(2)}`}
                    </span>
                  </label>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStage(2)}
                  className="bg-neutral-100 hover:bg-neutral-150 text-neutral-750 font-bold text-xs py-3 px-5 rounded-xl transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={handleStageThreeSubmit}
                  className="bg-neutral-950 hover:bg-neutral-850 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  Confirmar Frete <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: MEIOS DE FATURAMENTO */}
          {activeStage === 4 && (
            <form onSubmit={handleFinishPurchase} className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-sm font-black tracking-widest text-neutral-800 uppercase pb-3 border-b border-neutral-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-500" /> ETAPA 4: CANAL DE COBRANÇA SEGURO
              </h2>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'pix', title: 'Pix (10% Off)', desc: 'Desconto Imediato' },
                  { id: 'credit_card', title: 'Cartão de Crédito', desc: 'Em até 10x sem juros' },
                  { id: 'boleto', title: 'Boleto Bancário', desc: 'Processamento 2h' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setPaymentMethod(item.id as any); setErrorMessage(''); }}
                    className={`p-3.5 border-2 rounded-xl text-center select-none cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${paymentMethod === item.id ? 'border-neutral-950 bg-neutral-50/50 text-neutral-950' : 'border-neutral-200 hover:border-neutral-300 text-neutral-500'}`}
                  >
                    <span className="text-xs font-extrabold">{item.title}</span>
                    <span className="text-[9px] font-bold text-neutral-400">{item.desc}</span>
                  </button>
                ))}
              </div>

              {/* Form inputs depending on toggle */}
              {paymentMethod === 'pix' && (
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 border-dashed text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <span>⚡</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-800">Você selecionou pagamento via PIX!</p>
                    <p className="text-[11px] text-neutral-500 max-w-md mx-auto leading-relaxed mt-1">
                      Destranque preços esmagados. Na confirmação, geraremos um QR Code exclusivo dinâmico para você escanear com seu app bancário nacional.
                    </p>
                  </div>
                  <div className="text-sm font-black text-emerald-700 bg-white inline-block px-4 py-2 border border-emerald-200 rounded-lg">
                    Valor no PIX: R$ {pixPayable}
                  </div>
                </div>
              )}

              {paymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Numeração Impressa no Plástico</label>
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      value={creditNum}
                      onChange={(e) => setCreditNum(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Nome do Titular (Como impresso)</label>
                    <input
                      type="text"
                      required
                      placeholder="THIAGO LEITE"
                      value={creditHolder}
                      onChange={(e) => setCreditHolder(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-bold uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Vencimento (MM/AA)</label>
                      <input
                        type="text"
                        required
                        placeholder="12/32"
                        value={creditExpiry}
                        onChange={(e) => setCreditExpiry(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Código CVV Traseiro</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={creditCvv}
                        onChange={(e) => setCreditCvv(e.target.value)}
                        maxLength={4}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Opções de Parcelamento</label>
                    <select
                      value={creditInstallments}
                      onChange={(e) => setCreditInstallments(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl outline-none font-bold focus:border-neutral-950"
                    >
                      <option value="1">1x de R$ {totalPayable.toFixed(2)} sem juros</option>
                      <option value="2">2x de R$ {(totalPayable / 2).toFixed(2)} sem juros</option>
                      <option value="3">3x de R$ {(totalPayable / 3).toFixed(2)} sem juros</option>
                      <option value="5">5x de R$ {(totalPayable / 5).toFixed(2)} sem juros</option>
                      <option value="10">10x de R$ {(totalPayable / 10).toFixed(2)} sem juros</option>
                    </select>
                  </div>
                </div>
              )}

              {paymentMethod === 'boleto' && (
                <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-xl space-y-2 text-center">
                  <span className="text-3xl">📄</span>
                  <p className="text-xs font-bold text-neutral-800">Boleto Bancário Gerado Automático</p>
                  <p className="text-[10px] text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Você poderá baixar ou copiar o código de barras digitado no final da compra. A compensação bancária ocorre em nosso portal entre 1 a 2 horas úteis.
                  </p>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStage(3)}
                  className="bg-neutral-100 hover:bg-neutral-150 text-neutral-700 font-bold text-xs py-3 px-5 rounded-xl transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="bg-neutral-950 hover:bg-neutral-850 text-white font-extrabold text-xs py-3 px-6 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  Fechar Transação Segura <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STAGE 5: DANFE CONFIRMATION */}
          {activeStage === 5 && checkoutCompletedOrder && (
            <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 md:p-10 shadow-xl space-y-8 animate-fade-in">
              {/* Status Header */}
              <div className="text-center space-y-3.5 pb-6 border-b border-neutral-100">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black tracking-widest text-emerald-600 uppercase">✓ TRANSAÇÃO AUTORIZADA COM SUCESSO</p>
                  <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">CUPOM E FATURA KAKÁ COM NOTA EMITIDA!</h1>
                  <p className="text-xs text-neutral-400">Seu número de pedido exclusivo para acompanhamento e suporte comercial é <strong>{checkoutCompletedOrder.id}</strong>.</p>
                </div>
                
                {paymentMethod === 'pix' && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 inline-block text-center space-y-3 mt-4">
                    <p className="text-xs font-bold text-amber-900 flex items-center justify-center gap-1.5">
                      <QrCode className="w-4 h-4" /> QR CODE DE PAGAMENTO DO PIX
                    </p>
                    <div className="w-28 h-28 bg-neutral-900 text-white flex items-center justify-center mx-auto text-xs font-mono font-black border-2 border-white rounded shadow">
                      [[ QR CODE ]]
                    </div>
                    <div>
                      {pixPaidSimulated ? (
                        <p className="text-xs text-emerald-600 font-extrabold flex items-center justify-center gap-1 animate-pulse">
                          ✓ PAGAMENTO RECONHECIDO NO WHATSAPP!
                        </p>
                      ) : (
                        <p className="text-[10px] text-amber-800 animate-pulse">
                          Aguardando liquidação do banco... (Simulando em 5 segundos)
                        </p>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => alert('Código Pix Copiado com Sucesso!')}
                      className="bg-neutral-950 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg w-full"
                    >
                      Copiar Chave Copia e Cola
                    </button>
                  </div>
                )}
              </div>

              {/* RASTREAMENTO TIMELINE VISUAL */}
              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <h3 className="text-xs font-black text-neutral-800 tracking-wider uppercase mb-5">RASTREAMENTO DA CARGA</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                  {[
                    { title: 'Pedido Recebido', done: true, desc: 'Aguardando validações' },
                    { title: 'Aprovado / Pago', done: paymentMethod === 'pix' ? pixPaidSimulated : true, desc: 'NF-e em de faturamento' },
                    { title: 'Preparação / Pack', done: false, desc: 'Separação estoque' },
                    { title: 'Transito Aéreo', done: false, desc: 'Destino base' },
                    { title: 'Entregue VIP', done: false, desc: 'Para o comprador' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex md:flex-col items-start gap-3 md:gap-1 text-xs">
                      <div className="flex flex-row md:flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border ${step.done ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-neutral-300 border-neutral-200'}`}>
                          {step.done ? '✓' : idx + 1}
                        </div>
                      </div>
                      <div className="md:mt-2 text-left">
                        <p className={`font-black text-xs ${step.done ? 'text-emerald-700' : 'text-neutral-400'}`}>{step.title}</p>
                        <p className="text-[9px] text-neutral-400 font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DANFE / NF-e Visual Receipt */}
              <div className="bg-neutral-50 rounded-2xl border border-neutral-250 p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                  <span className="text-xs font-black text-neutral-800 tracking-wider uppercase">NOTA FISCAL CONSUMIDOR (DANFE MOCKUP)</span>
                  <button 
                    onClick={() => alert('PDF da NF-e baixado na pasta virtual downloads!')}
                    className="text-[10px] font-black text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Baixar PDF Legítimo
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">REMETENTE EMISSOR</p>
                    <p className="font-extrabold text-neutral-800">Kaká Multimarcas S.A.</p>
                    <p className="text-neutral-500 font-medium">CNPJ: 12.345.678/0001-90</p>
                    <p className="text-neutral-500 font-medium">Avenida Paulista, 1000 - São Paulo, SP</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">DESTINATÁRIO CONSUMIDOR</p>
                    <p className="font-extrabold text-neutral-800">{checkoutCompletedOrder.shippingAddress.fullName}</p>
                    <p className="text-neutral-500 font-medium">CPF: {personalCpf}</p>
                    <p className="text-neutral-500 font-medium">CEP: {checkoutCompletedOrder.shippingAddress.zipCode} | {checkoutCompletedOrder.shippingAddress.city} - {checkoutCompletedOrder.shippingAddress.state}</p>
                  </div>
                </div>

                {/* Products detail in invoice */}
                <div className="border-t border-neutral-200 pt-4 space-y-3 text-xs">
                  <p className="text-neutral-400 font-bold uppercase text-[9px]">ITENS DA DECLARAÇÃO</p>
                  {checkoutCompletedOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-dashed border-neutral-200 pb-2.5">
                      <div>
                        <p className="font-bold text-neutral-800">{it.product.name}</p>
                        <p className="text-[10px] text-neutral-400">Quantidade: {it.quantity} | Cor: {it.selectedColor}</p>
                      </div>
                      <span className="font-extrabold text-neutral-900">R$ {((it.product.promoPrice || it.product.price) * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="flex flex-col items-end gap-1.5 pt-2 text-xs">
                  <div className="flex justify-between w-full max-w-xs text-neutral-500 font-medium">
                    <span>Subtotal de Produtos:</span>
                    <span>R$ {checkoutCompletedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs text-neutral-500 font-medium">
                    <span>Taxa de Carga / Frete:</span>
                    <span>{checkoutCompletedOrder.shipping === 0 ? 'GRÁTIS' : `R$ ${checkoutCompletedOrder.shipping.toFixed(2)}`}</span>
                  </div>
                  {checkoutCompletedOrder.discount > 0 && (
                    <div className="flex justify-between w-full max-w-xs text-emerald-600 font-bold">
                      <span>Voucher / Desconto:</span>
                      <span>- R$ {checkoutCompletedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between w-full max-w-xs text-sm font-black border-t border-neutral-300 pt-3 text-neutral-900">
                    <span>Valor total faturado:</span>
                    <span>R$ {checkoutCompletedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="bg-neutral-950 hover:bg-neutral-850 text-white font-extrabold text-xs px-8 py-4 rounded-xl cursor-pointer shadow-md"
                >
                  Ir para Meu Painel VIP
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs px-8 py-4 rounded-xl cursor-pointer"
                >
                  Continuar Navegando
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right side static products sum-up bar (Only shown when not completed page 5) */}
        {activeStage < 5 && (
          <aside className="lg:col-span-4 bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-black text-xs text-neutral-800 tracking-wider uppercase border-b border-neutral-100 pb-3">REVISÃO DA COMPRA</h3>
            <div className="divide-y divide-neutral-150 max-h-64 overflow-y-auto pr-1">
              {cart.map((it) => (
                <div key={`${it.product.id}-${it.selectedColor}`} className="py-2.5 flex items-center gap-3">
                  <img src={it.product.images[0]} alt="thumbnail" className="w-10 h-10 object-cover rounded border" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[10px] text-neutral-800 truncate">{it.product.name}</h4>
                    <p className="text-[9px] text-neutral-400">Qtd: {it.quantity} | Cor: {it.selectedColor}</p>
                  </div>
                  <span className="font-extrabold text-xs text-neutral-900">R$ {((it.product.promoPrice || it.product.price) * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal dos itens</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Carga de envio</span>
                <span>{subtotal > 150 ? 'GRÁTIS' : `R$ ${activeShippingPrice.toFixed(2)}`}</span>
              </div>
              {discountVal > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Desconto Aplicado</span>
                  <span>- R$ {discountVal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline font-black border-t border-neutral-100 pt-3 text-neutral-900">
                <span>Total Estimado</span>
                <span className="text-base text-neutral-950">R$ {totalPayable.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-neutral-50/70 p-3 rounded-xl border text-[10px] text-neutral-400 leading-relaxed text-center">
              🔒 <strong>Criptografia Ativa</strong>: Todos os seus dados serão anonimizados via canais bancários homologados pelo Banco Central do Brasil.
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
