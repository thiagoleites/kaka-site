/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  Gift, 
  MapPin, 
  CreditCard as CardIcon, 
  Sliders, 
  Wallet, 
  Plus, 
  Trash2, 
  CheckCircle,
  Truck,
  Eye,
  Settings
} from 'lucide-react';
import { User, Order, Product } from '../types';
import { INITIAL_USER } from '../data';

interface DashboardViewProps {
  currentUser: User | null;
  ordersHistory: Order[];
  wishlist: Product[];
  onNavigate: (page: string, params?: any) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, color: string, size?: string) => void;
  onUpdateUser: (updated: User) => void;
  initialTab?: string;
}

export default function DashboardView({
  currentUser,
  ordersHistory = [],
  wishlist = [],
  onNavigate,
  onRemoveFromWishlist,
  onAddToCart,
  onUpdateUser,
  initialTab = 'profile'
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Editable user state
  const [userFullName, setUserFullName] = useState(currentUser?.fullName || 'Thiago Leite');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '(11) 99876-5432');
  const [userCpf, setUserCpf] = useState(currentUser?.cpf || '123.456.789-00');

  // Address add state
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newNum, setNewNum] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('SP');
  const [newZip, setNewZip] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-6">
        <span className="text-5xl">🔐</span>
        <h2 className="text-xl font-bold text-neutral-800">Faça o login para acessar a área VIP</h2>
        <p className="text-xs text-neutral-550 max-w-sm mx-auto leading-relaxed">
          Sua conta VIP guarda suas preferências, ofertas secretas, cashback real acumulado nas compras e o histórico de entrega de suas mercadorias.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-neutral-950 text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer"
        >
          Voltar para Home Page
        </button>
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      fullName: userFullName,
      phone: userPhone,
      cpf: userCpf
    });
    setProfileSuccess('Dados cadastrais salvos com sucesso!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStreet && newNum && newCity) {
      const updatedAddresses = [
        ...currentUser.savedAddresses,
        {
          id: `addr${Date.now()}`,
          fullName: currentUser.fullName,
          street: newStreet,
          number: newNum,
          neighborhood: newNeighborhood,
          city: newCity,
          state: newState,
          zipCode: newZip,
          isDefault: currentUser.savedAddresses.length === 0
        }
      ];
      onUpdateUser({
        ...currentUser,
        savedAddresses: updatedAddresses
      });
      setShowAddAddr(false);
      setNewStreet('');
      setNewNum('');
      setNewNeighborhood('');
      setNewCity('');
      setNewZip('');
    }
  };

  const handleDeleteAddress = (id: string) => {
    const filtered = currentUser.savedAddresses.filter(a => a.id !== id);
    onUpdateUser({
      ...currentUser,
      savedAddresses: filtered
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner Profile Widget */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-neutral-800 shadow-md">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <img 
            src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} 
            alt={currentUser.fullName} 
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 bg-neutral-800"
          />
          <div className="space-y-1">
            <span className="text-amber-500 text-[10px] bg-amber-500/10 px-2 py-0.5 rounded font-black uppercase tracking-wider">
              CLIENTE VIP TITULAR
            </span>
            <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase">{currentUser.fullName}</h1>
            <p className="text-xs text-neutral-400">{currentUser.email} | Membro de Elite</p>
          </div>
        </div>

        {/* Cashback Counter with high visibility */}
        <div className="bg-neutral-800/80 border border-neutral-700/80 p-5 rounded-2xl flex items-center gap-4 max-w-sm w-full md:w-auto relative overflow-hidden group">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Wallet className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">Meu Cashback Acumulado</p>
            <p className="text-xl font-black text-white">R$ {currentUser.cashbackBalance.toFixed(2)}</p>
            <p className="text-[9px] text-amber-500 font-medium">Use como desconto em qualquer checkout</p>
          </div>
        </div>
      </div>

      {/* 2. Structured split navigation dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Tab Menu */}
        <aside className="lg:col-span-3 bg-white border border-neutral-200 rounded-2xl p-4 space-y-1 z-10 shadow-xs flex-shrink-0">
          {[
            { id: 'profile', label: 'Minha Conta / Perfil', icon: UserIcon },
            { id: 'orders', label: 'Meus Pedidos', icon: ShoppingBag, count: ordersHistory.length },
            { id: 'wishlist', label: 'Lista de Desejos', icon: Heart, count: wishlist.length },
            { id: 'addresses', label: 'Meus Endereços', icon: MapPin },
            { id: 'wallet', label: 'Cartões & Cashback', icon: CardIcon },
            { id: 'config', label: 'Configurações VIP', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${activeTab === tab.id ? 'bg-neutral-950 text-white shadow' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'}`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white text-neutral-950' : 'bg-neutral-100 text-neutral-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Right Side Content Output */}
        <section className="lg:col-span-9 bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
          
          {/* TAB 1: USER DETAILS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-black text-sm text-neutral-900 uppercase">INFORMAÇÕES DE CADASTRO</h3>
                <p className="text-xs text-neutral-400 mt-1">Mantenha seus canais de correspondência atualizados para envio de notas fiscais eletrônicas.</p>
              </div>

              {profileSuccess && (
                <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 leading-none">
                  <CheckCircle className="w-4 h-4" /> {profileSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-2xl text-neutral-750">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Nome Completo do Portador</label>
                  <input
                    type="text"
                    required
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                    className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Telefone Comercial / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Cadastro de Pessoa Física (CPF)</label>
                    <input
                      type="text"
                      required
                      value={userCpf}
                      onChange={(e) => setUserCpf(e.target.value)}
                      className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-950 outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-neutral-950 hover:bg-neutral-850 text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer shadow-sm"
                  >
                    Salvar Dados Cadastrais
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PAST ORDERS WITH ACTIVE TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-black text-sm text-neutral-900 uppercase">HISTÓRICO DE COMPRAS</h3>
                <p className="text-xs text-neutral-400 mt-1">Acompanhe faturas, rastreamentos de cargas e notas fiscais de suas mercadorias ativas.</p>
              </div>

              {ordersHistory.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <span className="text-4xl">📦</span>
                  <h4 className="font-bold text-neutral-800 text-sm">Nenhum pedido faturado ainda</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">Suas compras aparecerão aqui imediatamente após a validação no checkout de faturamento.</p>
                  <button
                    onClick={() => onNavigate('home')}
                    className="bg-neutral-950 text-white font-bold text-xs py-2 px-4 rounded-xl mt-3"
                  >
                    Ir para Catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {ordersHistory.map((order) => (
                    <div key={order.id} className="bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden text-xs">
                      {/* Order Header banner */}
                      <div className="bg-neutral-100 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-200">
                        <div>
                          <p className="font-extrabold text-neutral-800 text-sm">Pedido #{order.id}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">Faturado em {order.date}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase border ${order.status === 'delivered' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 'bg-amber-100 border-amber-200 text-amber-800'}`}>
                            {order.status === 'delivered' ? 'Entregue' : 'Em Transporte'}
                          </span>
                          <span className="font-black text-neutral-900">Total: R$ {order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Timeline status track */}
                      <div className="p-5 border-b border-neutral-150">
                        <p className="font-extrabold text-neutral-500 uppercase text-[9px] mb-4">RASTREAMENTO CARGA: <span className="font-mono text-neutral-800">{order.trackingCode}</span></p>
                        <div className="grid grid-cols-5 gap-2 relative">
                          {[
                            { name: 'Recebido', ok: true },
                            { name: 'Faturado / Pago', ok: true },
                            { name: 'Separação', ok: true },
                            { name: 'Trânsito', ok: order.status === 'delivered' },
                            { name: 'Entregue', ok: order.status === 'delivered' }
                          ].map((step, sIdx) => {
                            return (
                              <div key={sIdx} className="text-center space-y-1.5 flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] border ${step.ok ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-neutral-300 border-neutral-200'}`}>
                                  {step.ok ? '✓' : sIdx + 1}
                                </div>
                                <span className={`text-[9px] font-bold ${step.ok ? 'text-neutral-800' : 'text-neutral-450'}`}>{step.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items details nested */}
                      <div className="p-4 space-y-2">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-neutral-150">
                            <div className="flex items-center gap-2.5">
                              <img src={it.product.images[0]} alt="thumbnail" className="w-10 h-10 object-cover rounded border" />
                              <div>
                                <h4 className="font-bold text-neutral-850 line-clamp-1 max-w-[280px]">{it.product.name}</h4>
                                <p className="text-[10px] text-neutral-400">Quantidade: {it.quantity} | Cor: {it.selectedColor}</p>
                              </div>
                            </div>
                            <span className="font-extrabold text-neutral-900">R$ {((it.product.promoPrice || it.product.price) * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST PORTAL */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-black text-sm text-neutral-900 uppercase">MINHA WISHLIST PRIVADA</h3>
                <p className="text-xs text-neutral-400 mt-1">Sua seleção privada de mimos e novidades tecnológicas salvas para compra posterior.</p>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <span className="text-4xl">❤️</span>
                  <h4 className="font-bold text-neutral-800 text-sm">Sua lista de desejos está vazia</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">Busque produtos nas categorias masculinas ou telefonia e clique no ícone de coração para salvá-los aqui.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((p) => {
                    const price = p.promoPrice || p.price;
                    return (
                      <div key={p.id} className="border border-neutral-200 bg-white rounded-xl overflow-hidden p-4 flex flex-col justify-between relative group shadow-xs hover:shadow-md transition-shadow">
                        <button
                          onClick={() => onRemoveFromWishlist(p)}
                          className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-red-500 p-1.5 rounded-full bg-neutral-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div>
                          <img src={p.images[0]} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                          <p className="text-[9px] text-neutral-400 font-extrabold uppercase">{p.brand}</p>
                          <h4 className="font-extrabold text-xs text-neutral-800 line-clamp-2 min-h-8 mb-2 whitespace-normal">{p.name}</h4>
                          <p className="font-black text-xs text-neutral-900">R$ {price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => onAddToCart(p, 1, p.colors[0], p.sizes?.[0])}
                          className="w-full bg-neutral-950 hover:bg-neutral-850 text-white font-bold text-[10px] py-2 rounded-lg mt-4 cursor-pointer"
                        >
                          Adicionar ao Carrinho
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-sm text-neutral-900 uppercase">ENDEREÇOS DE CORRESPONDÊNCIA</h3>
                  <p className="text-xs text-neutral-400 mt-1">Sua lista de galpões residenciais ou comerciais ativos para faturamentos.</p>
                </div>
                <button
                  onClick={() => setShowAddAddr(!showAddAddr)}
                  className="bg-neutral-950 text-white text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Novo Endereço
                </button>
              </div>

              {showAddAddr && (
                <form onSubmit={handleAddAddress} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs leading-none">
                  <div className="sm:col-span-12 font-black text-neutral-800 uppercase tracking-widest border-b border-neutral-150 pb-2 mb-2">Preencha o Destino</div>
                  <div className="sm:col-span-4">
                    <label className="block mb-1 font-bold text-neutral-500">CEP</label>
                    <input type="text" placeholder="Ex: 01310-100" required value={newZip} onChange={(e) => setNewZip(e.target.value)} className="w-full p-2 bg-white rounded border border-neutral-250 font-bold text-neutral-700 outline-none" />
                  </div>
                  <div className="sm:col-span-8">
                    <label className="block mb-1 font-bold text-neutral-500">Rua / Avenida</label>
                    <input type="text" placeholder="Avenida Paulista" required value={newStreet} onChange={(e) => setNewStreet(e.target.value)} className="w-full p-2 bg-white rounded border border-neutral-250 font-semibold" />
                  </div>
                  
                  <div className="sm:col-span-4">
                    <label className="block mb-1 font-bold text-neutral-500">Número</label>
                    <input type="text" placeholder="1000" required value={newNum} onChange={(e) => setNewNum(e.target.value)} className="w-full p-2 bg-white rounded border border-neutral-250 font-semibold" />
                  </div>
                  <div className="sm:col-span-8">
                    <label className="block mb-1 font-bold text-neutral-500">Bairro</label>
                    <input type="text" placeholder="Bela Vista" required value={newNeighborhood} onChange={(e) => setNewNeighborhood(e.target.value)} className="w-full p-2 bg-white rounded border border-neutral-250" />
                  </div>

                  <div className="sm:col-span-8">
                    <label className="block mb-1 font-bold text-neutral-500">Cidade</label>
                    <input type="text" placeholder="São Paulo" required value={newCity} onChange={(e) => setNewCity(e.target.value)} className="w-full p-2 bg-white rounded border border-neutral-250" />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block mb-1 font-bold text-neutral-500">Estado / UF</label>
                    <input type="text" placeholder="SP" required value={newState} onChange={(e) => setNewState(e.target.value)} className="w-full p-2 bg-white rounded border border-neutral-250" />
                  </div>

                  <div className="sm:col-span-12 pt-3 flex gap-2">
                    <button type="submit" className="bg-neutral-900 text-white px-4 py-2 rounded font-bold cursor-pointer">Cadastrar Endereço</button>
                    <button type="button" onClick={() => setShowAddAddr(false)} className="bg-neutral-200 text-neutral-700 px-4 py-2 rounded font-bold cursor-pointer">Cancelar</button>
                  </div>
                </form>
              )}

              {currentUser.savedAddresses.length === 0 ? (
                <p className="text-xs text-neutral-500 italic">Nenhum endereço faturado cadastrado na base ainda.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentUser.savedAddresses.map((addr) => (
                    <div key={addr.id} className="border border-neutral-200 p-4 rounded-xl space-y-3 relative bg-neutral-50/50">
                      <button 
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="absolute top-3.5 right-3.5 text-neutral-400 hover:text-red-550 transition-colors p-1 rounded hover:bg-neutral-150 cursor-pointer"
                        title="Deletar endereço"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-1 text-xs">
                        {addr.isDefault && (
                          <span className="text-[9px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded uppercase">Principal</span>
                        )}
                        <h4 className="font-extrabold text-neutral-800 pt-1">Casa de {addr.fullName}</h4>
                        <p className="text-neutral-500 font-medium">{addr.street}, {addr.number} {addr.complement && `- ${addr.complement}`}</p>
                        <p className="text-neutral-500 font-medium">{addr.neighborhood}, {addr.city} - {addr.state}</p>
                        <p className="text-neutral-400 font-mono text-[10px]">CEP: {addr.zipCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CARDS & BONUS CASHBACK CODES */}
          {activeTab === 'wallet' && (
            <div className="space-y-8">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-black text-sm text-neutral-900 uppercase">CARTEIRA E CRÉDITO SALVO</h3>
                <p className="text-xs text-neutral-400 mt-1">Gerencie chaves Pix corporativas recorrentes, faturas rápidas e cartões de crédito integrados.</p>
              </div>

              {/* Cards row listing */}
              <div className="space-y-4">
                <p className="text-xs font-black text-neutral-800 uppercase tracking-wide">Meus cartões salvos para 1 clique:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentUser.savedCards.map((c) => (
                    <div key={c.id} className="bg-gradient-to-tr from-neutral-800 to-neutral-950 p-5 rounded-2xl text-white border border-neutral-700/50 space-y-4 relative overflow-hidden">
                      {/* Chip visual ornament */}
                      <span className="text-3xl filter saturate-100">🖨️</span>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[9px] text-neutral-400 uppercase font-mono tracking-widest">Cartão Registrado</p>
                          <p className="text-sm font-bold font-mono">•••• •••• •••• {c.lastFour}</p>
                        </div>
                        <span className="bg-white/10 text-[9px] font-bold px-2 py-1 rounded select-none uppercase font-mono">{c.brand}</span>
                      </div>

                      <div className="flex justify-between items-end text-neutral-300 font-mono">
                        <div>
                          <p className="text-[8.5px] text-neutral-400 uppercase font-mono tracking-widest">Titular</p>
                          <p className="text-[10px] font-bold uppercase truncate max-w-[120px]">{c.holderName}</p>
                        </div>
                        <div>
                          <p className="text-[8.5px] text-neutral-400 uppercase font-mono tracking-widest">Validade</p>
                          <p className="text-[10px] font-bold">{c.expiry}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: VIP SETTINGS */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-black text-sm text-neutral-900 uppercase">CONFIGURAÇÕES VIP</h3>
                <p className="text-xs text-neutral-400 mt-1">Personalize canais preferenciais para faturamento rápido e resgates automatizados do cashback.</p>
              </div>

              <div className="space-y-4 text-xs font-bold text-neutral-600">
                <label className="flex items-center gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-neutral-900" />
                  <div>
                    <p className="text-neutral-800 font-extrabold">Autorizar Faturamento PIX Express automatizado</p>
                    <p className="text-[10px] text-neutral-400 font-medium">Os boletos ou chaves Pix de suas faturas serão enviadas diretamente no seu número de WhatsApp de faturamento.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-neutral-900" />
                  <div>
                    <p className="text-neutral-800 font-extrabold">Receber boletins e cupons secretos de madrugada</p>
                    <p className="text-[10px] text-neutral-400 font-medium">E-mails promocionais enviados sob auditoria contendo cupons relâmpago de curta validade.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 cursor-pointer">
                  <input type="checkbox" className="accent-neutral-900" />
                  <div>
                    <p className="text-neutral-800 font-extrabold">Exigir autenticação dupla 2FA para resgatar Cashback</p>
                    <p className="text-[10px] text-neutral-400 font-medium">Incrementa as barreiras de segurança para prevenir invasões indesejadas de saldo em carteira.</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
