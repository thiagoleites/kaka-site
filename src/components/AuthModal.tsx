/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { User } from '../types';
import { INITIAL_USER } from '../data';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTerms, setRegTerms] = useState(false);

  // Recovery Form
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverSent, setRecoverSent] = useState(false);

  // Errors / Success states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!loginEmail.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail comercial válido.');
      return;
    }
    if (loginPassword.length < 5) {
      setErrorMessage('A senha deve conter no mínimo 5 caracteres corporativos.');
      return;
    }

    // Success simulation
    setSuccessMessage('Acesso Autorizado! Conectando à sua conta Kaká VIP...');
    setTimeout(() => {
      onLoginSuccess({
        ...INITIAL_USER,
        fullName: loginEmail.toLowerCase().includes('thiago') ? 'Thiago Leite' : loginEmail.split('@')[0],
        email: loginEmail
      });
      setSuccessMessage('');
      onClose();
    }, 1500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (regName.trim().length < 4) {
      setErrorMessage('Por favor, digite seu nome e sobrenome completo.');
      return;
    }
    if (!regEmail.includes('@')) {
      setErrorMessage('Digite um e-mail válido para contato e notas fiscais.');
      return;
    }
    if (regCpf.length < 11) {
      setErrorMessage('CPF inválido. Certifique-se de preencher todos os numerais.');
      return;
    }
    if (!regTerms) {
      setErrorMessage('Você deve aceitar nossos Termos de Uso e Política de Troca.');
      return;
    }

    setSuccessMessage('Cadastro efetuado com sucesso absoluto! Recompensas ativas.');
    setTimeout(() => {
      onLoginSuccess({
        fullName: regName,
        email: regEmail,
        cpf: regCpf,
        phone: regPhone || '(11) 99999-1111',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        cashbackBalance: 25.00, // R$ 25 signup bonus reward
        savedAddresses: [],
        savedCards: []
      });
      setSuccessMessage('');
      onClose();
    }, 1500);
  };

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverEmail.includes('@')) {
      setErrorMessage('E-mail inválido.');
      return;
    }
    setRecoverSent(true);
    setErrorMessage('');
    setTimeout(() => {
      setRecoverSent(false);
      setActiveTab('login');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative border border-neutral-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="auth_modal_container"
      >
        {/* Header decoration */}
        <div className="bg-neutral-950 p-6 text-white text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer"
            id="close_auth_modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <span className="bg-amber-500 text-neutral-950 text-xs font-black px-2.5 py-0.5 rounded tracking-widest uppercase">
            KAKÁ MULTIMARCAS
          </span>
          <h2 className="text-xl font-black tracking-tight mt-2.5">PORTAL EXCLUSIVO DO CLIENTE VIP</h2>
          <p className="text-xs text-neutral-400 mt-1">
            {activeTab === 'login' && 'Acesse seus pedidos, cupons, cashback acumulado e configurações rápidas.'}
            {activeTab === 'register' && 'Crie sua conta em 1 minuto e ganhe R$ 25 de cashback inicial de boas-vindas.'}
            {activeTab === 'forgot' && 'Insira seu de cadastro para recuperação imediata.'}
          </p>
        </div>

        {/* Validation Banners */}
        {errorMessage && (
          <div className="bg-red-50 text-red-800 px-5 py-3 text-xs font-bold border-b border-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-50 text-emerald-800 px-5 py-3 text-xs font-bold border-b border-emerald-250 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Dynamic Content and Tabs */}
        <div className="p-6 sm:p-8 flex-1">
          {activeTab !== 'forgot' && (
            <div className="flex border-b border-neutral-200 mb-6 font-bold text-sm">
              <button
                onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                className={`flex-1 pb-3 text-center transition-colors cursor-pointer ${activeTab === 'login' ? 'border-b-2 border-neutral-900 text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                Efetuar Login
              </button>
              <button
                onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
                className={`flex-1 pb-3 text-center transition-colors cursor-pointer ${activeTab === 'register' ? 'border-b-2 border-neutral-900 text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                Cadastrar Nova Conta
              </button>
            </div>
          )}

          {/* Tab 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Endereço de E-mail</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="exemplo@email.com"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full text-sm pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
                    id="login_email_input"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Senha de Segurança</label>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs text-amber-600 hover:underline outline-none cursor-pointer"
                  >
                    Esqueceu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full text-sm pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
                    id="login_password_input"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer shadow-md mt-6"
                id="login_submit_btn"
              >
                Conectar com Segurança
              </button>

              <div className="text-center py-2.5">
                <span className="text-xs text-neutral-400">Ou conecte-se via canais externos</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess({
                      ...INITIAL_USER,
                      fullName: 'Thiago Google',
                      email: 'thiago.google@gmail.com'
                    });
                    onClose();
                  }}
                  className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  🌐 Google VIP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess({
                      ...INITIAL_USER,
                      fullName: 'Thiago Apple',
                      email: 'thiago.apple@icloud.com'
                    });
                    onClose();
                  }}
                  className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  🍎 Apple VIP
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Nome Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="João Silva Souza"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-900 outline-none"
                  />
                  <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">E-mail Corporativo</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="joaosilva@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-900 outline-none"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">CPF (Cadastro Nacional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={regCpf}
                      onChange={(e) => setRegCpf(e.target.value)}
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-900 outline-none"
                    />
                    <FileText className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Telefone / WhatsApp</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-900 outline-none"
                    />
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Escolha uma Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 5 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-900 outline-none"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-start gap-2.5 py-2">
                <input
                  type="checkbox"
                  id="reg_terms_check"
                  checked={regTerms}
                  onChange={(e) => setRegTerms(e.target.checked)}
                  className="mt-1 cursor-pointer"
                />
                <label htmlFor="reg_terms_check" className="text-xs text-neutral-500 cursor-pointer select-none">
                  Aceito os <span className="text-amber-600 underline">Termos e Condições</span> da Kaká Multimarcas e concordo em acumular <strong>cashback real</strong> em minhas transações de compra.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-sm py-3 rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Cadastrar e Ganhar R$ 25
              </button>
            </form>
          )}

          {/* Tab 3: RECOVER PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleRecoverSubmit} className="space-y-4">
              {recoverSent ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-extrabold text-neutral-800 text-base">Instruções enviadas!</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
                    Enviamos um link de redefinição de credenciais de segurança para <strong>{recoverEmail}</strong>. Verifique também sua caixa de Spam.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setRecoverSent(false); setActiveTab('login'); }}
                    className="text-xs text-neutral-900 font-bold bg-neutral-100 hover:bg-neutral-150 py-2 px-4 rounded-lg mt-3"
                  >
                    Voltar ao Login
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Digite seu e-mail de correspondência</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="exemplo@email.com"
                        value={recoverEmail}
                        onChange={(e) => setRecoverEmail(e.target.value)}
                        className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-neutral-900 outline-none"
                      />
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="flex gap-2.5 mt-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="flex-1 bg-neutral-100 hover:bg-neutral-150 text-neutral-700 font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Voltar ao Login
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Recuperar Acesso
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
