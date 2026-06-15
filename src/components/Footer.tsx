/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  ShieldAlert, 
  Lock, 
  Award, 
  RotateCcw,
  Star
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-neutral-900 text-white mt-16 pt-12 max-w-full overflow-hidden">
      {/* 1. Trust & Benefit Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-neutral-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl hover:bg-neutral-800/40 transition-colors">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide text-neutral-100">COMPRA 100% SEGURA</h4>
            <p className="text-xs text-neutral-400 mt-1">Seus dados pessoais e de pagamento protegidos sob criptografia SSL militar de ponta.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl hover:bg-neutral-800/40 transition-colors">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide text-neutral-100">TROCA & DEVOLUÇÃO DESCOMPLICADA</h4>
            <p className="text-xs text-neutral-400 mt-1">Até 7 dias úteis para devolver sem burocracias. Código Reverso gratuito gerado na hora.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl hover:bg-neutral-800/40 transition-colors">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide text-neutral-100">LOJA CONFIÁVEL DE ALTO NÍVEL</h4>
            <p className="text-xs text-neutral-400 mt-1">Selo RA1000 no ReclameAQUI. Classificação de 4.9⭐ baseada em mais de 10.000 avaliações de clientes.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl hover:bg-neutral-800/40 transition-colors">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide text-neutral-100">GARANTIA DE PROCEDÊNCIA</h4>
            <p className="text-xs text-neutral-400 mt-1">Todos os produtos acompanham Nota Fiscal eletrônica original de fábrica e garantia oficial da marca.</p>
          </div>
        </div>
      </div>

      {/* 2. Newsletter Signup with premium styling */}
      <div className="bg-neutral-950 py-10 px-4 md:px-8 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-extrabold text-lg sm:text-xl text-neutral-100 tracking-tight">FAÇA PARTE DO NOSSO CLUBE VIP KAKÁ</h3>
            <p className="text-xs text-neutral-400 mt-1">Cadastre seu e-mail para receber ofertas secretas de madrugada, cupons VIP e dicas de moda premium.</p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Insira seu melhor e-mail comercial"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="w-full sm:w-64 bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:border-amber-500 text-white outline-none"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Inscrever Grátis
            </button>
          </form>
        </div>
        {newsletterSubscribed && (
          <p className="text-center text-xs text-emerald-400 font-semibold mt-3 animate-fade-in">
            ✓ Inscrição confirmada! Você receberá nosso cupom secreto de 15% OFF nas próximas horas no seu e-mail!
          </p>
        )}
      </div>

      {/* 3. Corporate Links Menus */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-extrabold text-sm text-neutral-100 tracking-wider mb-4 uppercase">KAKA DEPARTAMENTOS</h4>
          <ul className="space-y-2 text-xs text-neutral-400 font-medium">
            <li><button onClick={() => onNavigate('category', { category: 'Smartphones' })} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Celulares & Smartphones</button></li>
            <li><button onClick={() => onNavigate('category', { category: 'Notebooks' })} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Computadores & Notebooks</button></li>
            <li><button onClick={() => onNavigate('category', { category: 'Moda Masculina' })} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Universo Masculino</button></li>
            <li><button onClick={() => onNavigate('category', { category: 'Moda Feminina' })} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Universo Feminino</button></li>
            <li><button onClick={() => onNavigate('category', { category: 'Calçados' })} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Calçados & Tênis Premium</button></li>
            <li><button onClick={() => onNavigate('category', { category: 'Perfumes Importados' })} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Fragrâncias & Perfumes</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-sm text-neutral-100 tracking-wider mb-4 uppercase">ATENDIMENTO AO CLIENTE</h4>
          <ul className="space-y-2 text-xs text-neutral-400 font-medium">
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Fale Conosco / SAC</button></li>
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Como Rastrear Meu Pedido</button></li>
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Prazos e Custos de Envio</button></li>
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Regulamento de Cashback</button></li>
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Perguntas Frequentes (FAQ)</button></li>
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Regras de Trocas e Reembolsos</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-sm text-neutral-100 tracking-wider mb-4 uppercase">INSTITUCIONAL</h4>
          <ul className="space-y-2 text-xs text-neutral-400 font-medium">
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left font-semibold">Quem Somos - Nossa História</button></li>
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Nossas Lojas Físicas</button></li>
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Trabalhe Conosco - Vagas</button></li>
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Programa de Afiliados</button></li>
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left text-neutral-300">Auditoria & Segurança</button></li>
            <li><button onClick={() => onNavigate('institutional')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Responsabilidade Social</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-sm text-neutral-100 tracking-wider mb-4 uppercase">FALE CONOSCO</h4>
          <div className="space-y-3.5 text-xs text-neutral-400 font-medium">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Av. Paulista, 1000 - Conjunto 152B<br />Bela Vista, São Paulo - SP, 01310-100</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>0800 591 2921 (Ligação gratuita)</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>contato@kakamultimarcas.com.br</span>
            </p>
            
            {/* Social channels */}
            <div className="pt-3.5 flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 transition-colors flex items-center justify-center text-neutral-300" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 transition-colors flex items-center justify-center text-neutral-300" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 transition-colors flex items-center justify-center text-neutral-300" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 transition-colors flex items-center justify-center text-neutral-300" title="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Payment Methods & Security Trust-badges */}
      <div className="bg-neutral-950 border-t border-neutral-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6 text-center">
          {/* Credit card providers & PIX badge */}
          <div>
            <p className="text-[10px] text-neutral-500 font-extrabold tracking-wider uppercase mb-3 text-left">MEIOS DE PAGAMENTO SEGUROS</p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start items-center">
              <span className="bg-neutral-900 border border-neutral-800 text-neutral-200 font-extrabold px-2.5 py-1.5 rounded text-[10px] tracking-widest flex items-center gap-1">
                <span>⚡</span> PIX (15% OFF)
              </span>
              <span className="bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold px-3 py-1.5 rounded text-[10px] uppercase">VISA</span>
              <span className="bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold px-3 py-1.5 rounded text-[10px] uppercase">MASTERCARD</span>
              <span className="bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold px-3 py-1.5 rounded text-[10px] uppercase">ELO</span>
              <span className="bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold px-3 py-1.5 rounded text-[10px] uppercase">BOLETO</span>
              <span className="bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold px-3 py-1.5 rounded text-[10px] uppercase">APPLE PAY</span>
              <span className="bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold px-3 py-1.5 rounded text-[10px] uppercase">GOOGLE PAY</span>
            </div>
          </div>

          {/* Security certifications */}
          <div>
            <p className="text-[10px] text-neutral-500 font-extrabold tracking-wider uppercase mb-3 text-left">AUDITORIA & CERTIFICAÇÃO</p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start items-center">
              <span className="bg-emerald-950/40 border border-emerald-900 text-emerald-400 font-mono text-[9px] px-2.5 py-1.5 rounded flex items-center gap-1.5 font-bold uppercase">
                <Lock className="w-3 h-3" /> SSL TLS 1.3 ATIVO
              </span>
              <span className="bg-neutral-900 border border-neutral-800 text-neutral-200 font-semibold text-[9px] px-2.5 py-1.5 rounded flex items-center gap-1 uppercase">
                🛡️ GOOGLE SAFE BROWSING
              </span>
              <span className="bg-amber-950/40 border border-amber-900 text-amber-500 font-bold text-[9px] px-2.5 py-1.5 rounded flex items-center gap-1 uppercase">
                <Star className="w-3.5 h-3.5 fill-amber-500" /> RA1000 RECLAME AQUI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Copyright, CNPJ and regulatory texts */}
      <div className="bg-neutral-950 border-t border-neutral-900 py-6 px-4 text-center text-[10px] text-neutral-500">
        <p className="max-w-4xl mx-auto leading-relaxed">
          Preços e condições de pagamento válidos exclusivamente para compras efetuadas neste site de e-commerce corporativo, não se aplicando para nossas lojas físicas autorizadas. As fotos dos produtos são meramente ilustrativas e podem sofrer alterações sem prévio aviso técnico. 
        </p>
        <p className="max-w-4xl mx-auto mt-2 font-semibold">
          Kaká Multimarcas S.A. | CNPJ: 13.543.206/0001-00 | Inscrição Estadual: 111.222.333.444 | Tel: (82) 99682-8405
        </p>
        <p className="max-w-4xl mx-auto mt-1">
          Copyright &copy; {new Date().getFullYear()} - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
