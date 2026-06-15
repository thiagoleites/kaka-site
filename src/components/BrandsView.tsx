/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { MOCK_CURATED_BRANDS } from '../data';

interface BrandsViewProps {
  onNavigate: (page: string, params?: any) => void;
}

export default function BrandsView({ onNavigate }: BrandsViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Brands Banner */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 text-white rounded-3xl p-8 text-center space-y-3 shadow-md border border-neutral-800">
        <span className="text-amber-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1">
          <Award className="w-4 h-4" /> KAKÁ HOMOLOGAÇÃO MULTINACIONAL
        </span>
        <h1 className="text-3xl md:text-[42px] font-black uppercase tracking-tight">MARCAS MUNDIAIS CONSOLIDADAS</h1>
        <p className="text-xs md:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Garantia total de autenticidade. Nosso portfólio seleciona marcas consagradas globais que passam por rigorosa auditoria de procedência, acompanhadas de selo de garantia oficial de fábrica e NF-e.
        </p>
      </div>

      {/* Brands layout lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_CURATED_BRANDS.map((br) => (
          <div 
            key={br.name} 
            className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-xs space-y-4 hover:shadow-lg transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3 text-center sm:text-left">
              <div className="w-16 h-16 bg-neutral-50 border border-neutral-200 rounded-full flex items-center justify-center text-4xl shadow-xs mx-auto sm:mx-0">
                {br.logo}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 uppercase">{br.name} Co.</h3>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase">Distribuidora Autorizada</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-semibold">{br.description}</p>
            </div>

            <button
              onClick={() => onNavigate('category', { category: br.name === 'Apple' || br.name === 'Samsung' ? 'Smartphones' : br.name === 'Zara' ? 'Moda Masculina' : 'Calçados' })}
              className="mt-6 w-full bg-neutral-950 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 group cursor-pointer"
            >
              Ver e-Catálogo {br.name}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
