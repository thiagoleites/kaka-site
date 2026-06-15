/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Mail, MapPin, Phone, HelpCircle, FileText, Globe } from 'lucide-react';

export default function InstitutionalView() {
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState('Dúvida sobre Cashback');
  const [ticketText, setTicketText] = useState('');
  const [ticketStatus, setTicketStatus] = useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketName && ticketEmail && ticketText) {
      setTicketStatus(true);
      setTimeout(() => {
        setTicketStatus(false);
        setTicketName('');
        setTicketEmail('');
        setTicketText('');
        alert('Mensagem registrada com sucesso! Nossa central VIP retornará seu e-mail em até 2 horas úteis.');
      }, 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 text-white rounded-3xl p-8 text-center space-y-2 border border-neutral-800">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">SOBRE NÓS & QUEM SOMOS KAKÁ</h1>
        <p className="text-xs text-neutral-450 max-w-sm mx-auto uppercase tracking-widest mt-1">Transparência, Pós-compra VIP & Auditoria Segura.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Policy Documents */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: History */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest border-l-4 border-amber-500 pl-3">1. NOSSA HISTÓRIA RELEVANTE</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-semibold">
              Nascida no seio paulista, a Kaká Multimarcas consolidou sua atuação no cenário nacional de vestuário e produtos eletrônicos importados prezando sempre por transparência fiscal total, produtos 100% de origem licenciada e entrega a jato. Conquistamos os selos de auditorias mais rígidos do ReclameAQUI (RA1000) e do Google Safe Browsing, mantendo as barreiras de proteção de dados dos compradores em conformidade estrita com a LGPD.
            </p>
          </div>

          {/* Section 2: Exchange & Refund Policies */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest border-l-4 border-amber-500 pl-3">2. REGULAMENTO DE TROCA & DEVOLUÇÃO DESCOMPLICADO</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-semibold">
              Sua satisfação ou seu dinheiro rapidamente estornado na carteira virtual ou Pix em até 2 horas. Oferecemos o prazo legal de 7 dias de arrependimento integral. Em caso de insatisfação, nossa central VIP gera um Código de Postagem Reverso dos Correios sem burocracias. Para mercadorias com defeito oculto de engenharia, oferecemos cobertura e suporte por 90 dias inteiros.
            </p>
          </div>

          {/* Section 3: Cashback program */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest border-l-4 border-amber-500 pl-3">3. PROGRAMA DE CASHBACK REAL ACUMULADO</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-semibold">
              Cada transação bem-sucedida fechada através de nosso Pix ou faturamentos tradicionais gera cashback creditado instantaneamente na assinatura do cliente, que pode ser aplicado como desconto em qualquer outra compra subsequente da Kaká Multimarcas, sem expirabilidade ou barreiras de resgate.
            </p>
          </div>
        </div>

        {/* Right Side: Contact form / Ticket creation */}
        <form onSubmit={handleCreateTicket} className="lg:col-span-4 bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-black text-xs text-neutral-800 tracking-wider uppercase border-b border-neutral-100 pb-3">FALE CONOSCO (SAC VIP)</h3>
          
          <div className="space-y-3.5 text-xs text-neutral-700">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Nome Completo</label>
              <input 
                type="text" 
                required 
                value={ticketName} 
                onChange={(e) => setTicketName(e.target.value)} 
                placeholder="Ex: Gabriel Barbosa" 
                className="w-full p-2.5 bg-neutral-50 rounded border border-neutral-200 outline-none focus:border-neutral-950 font-semibold" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">E-mail para resposta comercial</label>
              <input 
                type="email" 
                required 
                value={ticketEmail} 
                onChange={(e) => setTicketEmail(e.target.value)} 
                placeholder="gabriel@email.com" 
                className="w-full p-2.5 bg-neutral-50 rounded border border-neutral-200 outline-none focus:border-neutral-950 font-semibold" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Assunto do Contato</label>
              <select 
                value={ticketSubject} 
                onChange={(e) => setTicketSubject(e.target.value)} 
                className="w-full p-2.5 bg-neutral-50 rounded border border-neutral-200 outline-none font-bold"
              >
                <option value="Dúvida sobre Cashback">Dúvida sobre Cashback</option>
                <option value="Problema no Faturamento">Problema no Faturamento</option>
                <option value="Suporte de Medidas Zara">Suporte de Medidas Zara</option>
                <option value="Parceria Comercial">Parceria Comercial / Franquias</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Mensagem ou dúvida detalhada</label>
              <textarea 
                required 
                rows={4} 
                value={ticketText} 
                onChange={(e) => setTicketText(e.target.value)} 
                placeholder="Descreva aqui sua necessidade comercial de suporte..." 
                className="w-full p-2.5 bg-neutral-50 rounded border border-neutral-200 outline-none focus:border-neutral-950 font-semibold" 
              />
            </div>

            <button 
              type="submit" 
              disabled={ticketStatus} 
              className="w-full bg-neutral-950 hover:bg-neutral-850 text-white font-extrabold text-xs py-3 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              {ticketStatus ? 'Registrando Mensagem...' : 'Protocolar Contato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
