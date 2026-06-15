/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Coupon, Review, User } from './types';

export const DEPARTMENTS = [
  {
    id: 'tech_games',
    name: 'Tecnologia & Games',
    categories: ['Smartphones', 'Notebooks', 'Periféricos', 'Games & Consoles'],
    icon: 'Smartphone'
  },
  {
    id: 'moda_style',
    name: 'Moda & Calçados',
    categories: ['Moda Masculina', 'Moda Feminina', 'Moda Plus Size', 'Moda Infantil', 'Calçados', 'Bolsas & Acessórios'],
    icon: 'Shirt'
  },
  {
    id: 'beauty_perfume',
    name: 'Saúde, Beleza & Perfumes',
    categories: ['Perfumes Importados', 'Saúde e Beleza'],
    icon: 'Sparkles'
  },
  {
    id: 'home_appliances',
    name: 'Casa, Eletro & Utilidades',
    categories: ['Eletrodomésticos', 'Utilidades Domésticas', 'Casa e Decoração'],
    icon: 'Home'
  },
  {
    id: 'sports_outdoor',
    name: 'Esportes, Automotivo & Outros',
    categories: ['Esportes', 'Automotivo', 'Ferramentas', 'Brinquedos', 'Papelaria', 'Pet Shop'],
    icon: 'Dribbble'
  }
];

export const MOCK_CURATED_BRANDS = [
  { name: 'Apple', logo: '🍎', description: 'Inovação e elegância em eletrônicos de alta performance.' },
  { name: 'Nike', logo: '✔️', description: 'Just Do It. Atitude, conforto e performance esportiva premium.' },
  { name: 'Zara', logo: '👔', description: 'Alta costura e design minimalista em moda contemporânea.' },
  { name: 'Sony PlayStation', logo: '🎮', description: 'A maior imersão de jogos da nova geração.' },
  { name: 'Boticário', logo: '🧪', description: 'Aromas extraordinários e beleza brasileira.' },
  { name: 'Samsung', logo: '🌌', description: 'Tecnologia inteligente para um mundo conectado.' },
  { name: 'Tramontina', logo: '🔪', description: 'Sinônimo de qualidade e sofisticação para sua casa.' },
];

export const SAMPLE_COUPONS: Coupon[] = [
  { code: 'KAKA10', discountValue: 10, type: 'percentage', minPurchase: 100, description: '10% de Desconto em toda a loja' },
  { code: 'BEMVINDO50', discountValue: 50, type: 'fixed', minPurchase: 300, description: 'R$ 50 de Desconto em compras acima de R$ 300' },
  { code: 'TECH15', discountValue: 15, type: 'percentage', minPurchase: 500, description: '15% de Desconto na Categoria de Tecnologia' },
  { code: 'FRETEGRATIS', discountValue: 0, type: 'percentage', minPurchase: 150, description: 'Cupom de Frete Grátis acima de R$ 150' },
];

export const INITIAL_USER: User = {
  fullName: 'José Ricardo',
  email: 'kaka@kakamultimarcas.com.br',
  cpf: '123.456.789-00',
  phone: '(11) 99876-5432',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  cashbackBalance: 45.80,
  savedAddresses: [
    {
      id: 'addr1',
      fullName: 'José Ricardo',
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Apto 152B',
      neighborhood: 'Bela Vista',
      city: 'Maceió',
      state: 'AL',
      zipCode: '01310-100',
      isDefault: true
    },
    {
      id: 'addr2',
      fullName: 'José Ricardo - Filial',
      street: 'Rua das Flores',
      number: '48',
      neighborhood: 'Jardins',
      city: 'Maceió',
      state: 'AL',
      zipCode: '01420-000',
      isDefault: false
    }
  ],
  savedCards: [
    {
      id: 'card1',
      brand: 'visa',
      lastFour: '4242',
      holderName: 'JOSÉ RICARDO',
      expiry: '12/29'
    },
    {
      id: 'card2',
      brand: 'mastercard',
      lastFour: '8811',
      holderName: 'JOSÉ RICARDO',
      expiry: '08/32'
    }
  ]
};

export const MOCK_REVIEWS_POOL: Review[] = [
  {
    id: 'rev1',
    userName: 'Carlos Eduardo Santos',
    rating: 5,
    date: '02/06/2026',
    comment: 'Excepcional! Produto 100% original, embalagem super segura e a entrega no dia seguinte via Pix foi absurdamente rápida. Loja Kaká Multimarcas ganhou meu respeito.',
    verified: true,
    likes: 24
  },
  {
    id: 'rev2',
    userName: 'Mariana Azevedo',
    rating: 5,
    date: '28/05/2026',
    comment: 'Superou minhas expectativas. Acabamentos premium, muito elegante. O caimento é excepcional e o suporte técnico me ajudou de forma ágil no WhatsApp.',
    verified: true,
    likes: 12
  },
  {
    id: 'rev3',
    userName: 'Beatriz Rezende',
    rating: 4,
    date: '15/05/2026',
    comment: 'Lindo demais e muito sofisticado. Podia vir com mais opções de cores no pacote inicial, mas o produto funciona incrivelmente bem.',
    verified: true,
    likes: 7
  },
  {
    id: 'rev4',
    userName: 'Fernanda Lima Souza',
    rating: 5,
    date: '10/05/2026',
    comment: 'Primeira vez comprando e fiquei encantada com os cupons de boas-vindas e o cashback que já ficou disponível na hora! Maravilhoso!',
    verified: true,
    likes: 19
  }
];

export const ALL_PRODUCTS: Product[] = [
  // TECHNOLOGY & PHONES
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max Titanium 256GB',
    description: 'Experimente o verdadeiro poder do acabamento em titânio de grau aeroespacial, o revolucionário processador A17 Pro e um sistema de câmera ultra avançado que redefine capturas mobile com zoom óptico de 5x.',
    price: 9499.00,
    promoPrice: 8799.00,
    category: 'Smartphones',
    subcategory: 'Tecnologia & Games',
    brand: 'Apple',
    rating: 4.9,
    reviewsCount: 148,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Titânio Natural', 'Titânio Azul', 'Preto Espacial'],
    stock: 12,
    isNew: true,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleDiscount: 700,
    viewsCount: 2400,
    sku: 'APP-I15PM-256-TI',
    specs: {
      'Processador': 'A17 Pro com GPU de 6 núcleos',
      'Tela': 'Super Retina XDR de 6,7 polegadas com ProMotion',
      'Armazenamento': '256GB NVMe',
      'Câmera Traseira': 'Tripla (48MP Principal + 12MP Ultra-angular + 12MP Teleobjetiva 5x)',
      'Peso': '221g',
      'Bateria': 'Até 29 horas de reprodução de vídeo',
      'Sistema Operacional': 'iOS 17'
    }
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra 5G 512GB',
    description: 'Mais inteligente que nunca. Equipado com Galaxy AI integrado para tradução simultânea, assistente de notas profissional e lentes de zoom inovadoras com sensor de 200MP para fotos noturnas cinematográficas.',
    price: 8999.00,
    promoPrice: 7499.00,
    category: 'Smartphones',
    subcategory: 'Tecnologia & Games',
    brand: 'Samsung',
    rating: 4.8,
    reviewsCount: 96,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Cinza Titânio', 'Preto Titânio', 'Violeta Titânio'],
    stock: 18,
    viewsCount: 1850,
    sku: 'SAM-S24U-512-TI',
    specs: {
      'Processador': 'Snapdragon 8 Gen 3 for Galaxy',
      'Tela': 'Dynamic AMOLED 2X de 6.8" QHD+ (120Hz)',
      'Memória RAM': '12GB LPDDR5X',
      'Câmera': 'Traseira 200MP + 50MP + 12MP + 10MP / Frontal 12MP',
      'S-Pen': 'Inclusa com suporte Bluetooth'
    }
  },
  // NOTEBOOKS
  {
    id: 'p3',
    name: 'MacBook Air M3 Apple 13.6" 16GB',
    description: 'Espessura inacreditável que combina portabilidade extrema com velocidade absurda do novo chip M3. O companheiro perfeito para programar, editar e criar conteúdo com autonomia de bateria líder.',
    price: 13299.00,
    promoPrice: 11999.00,
    category: 'Notebooks',
    subcategory: 'Tecnologia & Games',
    brand: 'Apple',
    rating: 4.9,
    reviewsCount: 82,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Estelar', 'Cinza Espacial', 'Prateado'],
    stock: 5,
    isBestSeller: true,
    viewsCount: 1670,
    sku: 'APP-MBA-M3-16G',
    specs: {
      'Chipset': 'Apple M3 (CPU 8-core / GPU 10-core)',
      'Memória': '16GB RAM unificada',
      'Armazenamento': '512GB SSD superveloz',
      'Bateria': 'Autonomia de até 18 horas de uso real',
      'Rede': 'Wi-Fi 6E e Bluetooth 5.3'
    }
  },
  {
    id: 'p4',
    name: 'Notebook Gamer ROG Strix G16 RTX 4060',
    description: 'Supere seus limites competitivos em games com o poder do processador Intel Core i9 de 13ª Geração e placa GeForce RTX 4060. Sistema inteligente de refrigeração Tri-Fan líquida.',
    price: 11999.00,
    promoPrice: 10450.00,
    category: 'Notebooks',
    subcategory: 'Tecnologia & Games',
    brand: 'Asus',
    rating: 4.7,
    reviewsCount: 41,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Eclipse Gray'],
    stock: 8,
    isNew: true,
    viewsCount: 950,
    sku: 'ASU-ROG-G16-4060',
    specs: {
      'Processador': 'Intel Core i9-13980HX',
      'GPU': 'NVIDIA GeForce RTX 4060 (8GB GDDR6)',
      'Tela': '16 polegadas Nebula Display QHD 240Hz',
      'Teclado': 'Retroiluminado RGB em 4 zonas',
      'Armazenamento': '1TB SSD M.2 NVMe PCIe 4.0'
    }
  },
  // PERIPHERALS / CONSOLES
  {
    id: 'p5',
    name: 'Teclado Mecânico Logitech G915 TKL RGB LightSpeed',
    description: 'O ápice da tecnologia gamer sem fio e perfil ultra fino. Conectividade LightSpeed profissional com tempo de resposta de 1ms e iluminação Lightsync RGB totalmente customizável.',
    price: 1499.00,
    promoPrice: 1290.00,
    category: 'Periféricos',
    subcategory: 'Tecnologia & Games',
    brand: 'Logitech',
    rating: 4.8,
    reviewsCount: 115,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Preto Carbono', 'Branco Glacial'],
    stock: 25,
    viewsCount: 1120,
    sku: 'LOG-G915TKL-BR',
    specs: {
      'Switches': 'Mecânicos GL Tactile de baixo perfil',
      'Conexão': 'Bluetooth e receptor wireless USB Lightspeed',
      'Bateria': 'Até 40 horas com brilho em 100%',
      'Layout': 'Tenkeyless compacto'
    }
  },
  {
    id: 'p6',
    name: 'Console Sony PlayStation 5 Slim 1TB + Jogo',
    description: 'Desfrute do carregamento do SSD ultrarrápido, uma imersão incrível com suporte ao feedback táctil avançado, gatilhos dinâmicos adaptáveis e áudio 3D 3D imersivo de última geração.',
    price: 4499.00,
    promoPrice: 3899.00,
    category: 'Games & Consoles',
    subcategory: 'Tecnologia & Games',
    brand: 'Sony PlayStation',
    rating: 4.9,
    reviewsCount: 310,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Branco Clássico'],
    stock: 15,
    isBestSeller: true,
    viewsCount: 3420,
    sku: 'SON-PS5-SLIM-1T',
    specs: {
      'Armazenamento': 'SSD personalizado de 1TB NVMe',
      'Resolução': 'Suporte a saídas de vídeo 4K e 120Hz',
      'Mídia': 'Leitor de discos Blu-ray Ultra HD removível',
      'Acessórios': '1 Controle DualSense sem fio'
    }
  },
  // CLOTHING / APPAREL (MALE)
  {
    id: 'p7',
    name: 'Sobretudo Minimalist Lã Nobre Zara',
    description: 'Sobretudo de corte reto alfaiataria em lã nobre com toque macio. Gola clássica de lapela, manga longa com acabamento em botões premium no punho e interior forrado com bolsos amplos.',
    price: 899.00,
    promoPrice: 749.00,
    category: 'Moda Masculina',
    subcategory: 'Moda & Calçados',
    brand: 'Zara',
    rating: 4.6,
    reviewsCount: 35,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Chumbo Marfim', 'Preto Obsidiana', 'Bege Camelo'],
    sizes: ['P', 'M', 'G', 'GG'],
    stock: 14,
    isNew: true,
    viewsCount: 780,
    sku: 'ZAR-SOB-LA-001',
    specs: {
      'Composição': '75% Lã Virgem, 25% Poliamida Italiana',
      'Caimento': 'Regular Fit sofisticado',
      'Lavagem': 'Permite lavagem a seco profissional'
    }
  },
  // CLOTHING / APPAREL (FEMALE)
  {
    id: 'p8',
    name: 'Vestido Longo Seda Amália',
    description: 'Vestido fluido deslumbrante confeccionado em seda pura premium. Alças finas com amarração traseira escultural e fendas laterais de tirar o fôlego que garantem movimentos graciosos em festividades.',
    price: 1290.00,
    promoPrice: 990.00,
    category: 'Moda Feminina',
    subcategory: 'Moda & Calçados',
    brand: 'Zara',
    rating: 4.8,
    reviewsCount: 22,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Terracota', 'Esmeralda', 'Champagne'],
    sizes: ['P', 'M', 'G'],
    stock: 6,
    isFlashSale: true,
    flashSaleDiscount: 300,
    viewsCount: 1420,
    sku: 'ZAR-VEST-SEDA-99',
    specs: {
      'Tecido': '100% Seda de amoreira legítima',
      'Forro': 'Viscose acetinada macia',
      'Origem': 'Importado da Itália'
    }
  },
  // PLUS SIZE
  {
    id: 'p9',
    name: 'Blazer Alfaiataria Plus Size Elegance',
    description: 'Blazer estruturado com alta costura pensada especialmente para curvas generosas. Tecido encorpado estruturado com elastano para máximo conforto e elegância total no ambiente de trabalho ou social.',
    price: 399.00,
    promoPrice: 329.00,
    category: 'Moda Plus Size',
    subcategory: 'Moda & Calçados',
    brand: 'Zara',
    rating: 4.8,
    reviewsCount: 47,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Off-White', 'Preto Real', 'Azul Marinho'],
    sizes: ['G1', 'G2', 'G3', 'G4'],
    stock: 12,
    viewsCount: 650,
    sku: 'ELG-BLA-PLUS',
    specs: {
      'Modelagem': 'Especial Plus Slim Fit',
      'Composição': '92% Poliéster, 8% Elastano de alta flexibilidade',
      'Fechamento': 'Botão frontal único cravejado'
    }
  },
  // SPORT TOYS & CARS / CALÇADOS
  {
    id: 'p10',
    name: 'Tênis Nike Air Force 1 07 Premium',
    description: 'O brilho das quadras vive no original de basquete. Mistura impecável de conforto testado na quadra de corrida e excelente design urbano icônico com detalhes em couro nobre.',
    price: 899.00,
    promoPrice: 799.00,
    category: 'Calçados',
    subcategory: 'Moda & Calçados',
    brand: 'Nike',
    rating: 4.9,
    reviewsCount: 520,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Branco Triplo', 'Preto Clássico', 'Gelo Vintage'],
    sizes: ['38', '39', '40', '41', '42', '43'],
    stock: 30,
    isBestSeller: true,
    viewsCount: 4100,
    sku: 'NIKE-AF1-07W',
    specs: {
      'Material do Cabedal': 'Couro natural selecionado à mão',
      'Amortecimento': 'Tecnologia Nike Air selada no calcanhar',
      'Solado': 'Borracha antiderrapante clássica circular'
    }
  },
  // WATCHES
  {
    id: 'p11',
    name: 'Relógio Chrono Master Gold Edition',
    description: 'Relógio cronógrafo mecânico imponente em banho de ouro 18k escovado. Cristal de safira anti-riscos, calendário perpétuo e mostrador de fases da lua para o cavalheiro moderno de negócios.',
    price: 2490.00,
    promoPrice: 1990.00,
    category: 'Relógios',
    subcategory: 'Moda & Calçados',
    brand: 'Luxury Time',
    rating: 4.9,
    reviewsCount: 52,
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Ouro Amarelo', 'Ouro Rosé'],
    stock: 4,
    isNew: true,
    viewsCount: 1100,
    sku: 'LUX-CHRONO-GLD',
    specs: {
      'Maquinário': 'Automático Suíço com 25 rubis',
      'Resistência à Água': 'Duração até 100 metros (10 ATM)',
      'Mostrador': 'Diâmetro de 42mm em safira',
      'Garantia': '2 anos de cobertura oficial'
    }
  },
  // PERFUMES
  {
    id: 'p12',
    name: 'Perfume Bleu de Chanel Eau de Parfum 100ml',
    description: 'O elogio imediato em forma de fragrância. Um perfume amadeirado aromático e fresco que une notas cítricas vibrantes a um rastro sedutor de sândalo da Nova Caledônia e cedro seco.',
    price: 999.00,
    category: 'Perfumes Importados',
    subcategory: 'Saúde, Beleza & Perfumes',
    brand: 'Chanel',
    rating: 5.0,
    reviewsCount: 220,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Azul Escuro Noturno'],
    stock: 9,
    isBestSeller: true,
    viewsCount: 2900,
    sku: 'CHA-BLEU-EDP-100',
    specs: {
      'Família Olfativa': 'Amadeirado Aromático Sofisticado',
      'Concentração': 'Eau de Parfum (EDP) com alta fixação',
      'Notas de Topo': 'Toranja, Hortelã, Limão verdadeiro siciliano',
      'Notas de Fundo': 'Incenso de olíbano, Sândalo, Patchouli'
    }
  },
  // ELECTRO/HOME APPLIANCES
  {
    id: 'p13',
    name: 'Cafeteira Italiana Espresso Pro Nespresso',
    description: 'O luxo da barista diretamente em sua cozinha. Sistema de alta pressão patenteado de 19 bar que extrai cremes encorpados sublimes em apenas 25 segundos para cápsulas premium.',
    price: 899.00,
    promoPrice: 659.00,
    category: 'Eletrodomésticos',
    subcategory: 'Casa, Eletro & Utilidades',
    brand: 'Nespresso',
    rating: 4.8,
    reviewsCount: 88,
    images: [
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Vermelho Rubí', 'Preto Fosco', 'Prata Cromado'],
    stock: 14,
    viewsCount: 1210,
    sku: 'NES-CAF-PRO19',
    specs: {
      'Pressão': 'Bomba de 19 bar profissional',
      'Reservatório de Água': 'Capacidade útil de 1,2 litros',
      'Desligamento Automático': 'Ativo após 9 minutos de ociosidade',
      'Espumador de Leite': 'Aeroccino integrado incluso'
    }
  },
  {
    id: 'p14',
    name: 'Fritadeira Airfryer Philips Walita Digital XL',
    description: 'A única com tecnologia Rapid Air patenteada que estrela os alimentos com circulação de ar aquecido 360° ultra rápida, garantindo crocância externa insuperável sem uso de gotas de óleo.',
    price: 1399.00,
    promoPrice: 1099.00,
    category: 'Eletrodomésticos',
    subcategory: 'Casa, Eletro & Utilidades',
    brand: 'Philips Walita',
    rating: 4.8,
    reviewsCount: 144,
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Preto Piano'],
    stock: 11,
    isFlashSale: true,
    flashSaleDiscount: 300,
    viewsCount: 2280,
    sku: 'PHI-WAL-XL-DIG',
    specs: {
      'Capacidade': '4,5 Litros (Ideal para famílias grandes)',
      'Painel': 'Touch Digital Inteligente com presets para frango, batatas e bolos',
      'Potência': '2000W em altas temperaturas de até 200°C'
    }
  },
  // ACCESORIES / BAGS
  {
    id: 'p15',
    name: 'Bolsa Tote de Couro Saffiano Coach Glam',
    description: 'Para o dia a dia executivo elegante. Desenvolvida em couro Saffiano legítimo de textura texturizada impermeável, resistente a arranhões. Amplo compartimento para notebook de até 14 polegadas.',
    price: 1890.00,
    promoPrice: 1540.00,
    category: 'Bolsas & Acessórios',
    subcategory: 'Moda & Calçados',
    brand: 'Coach',
    rating: 4.9,
    reviewsCount: 39,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15a7a5?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Preto Clássico', 'Bege Amêndoa', 'Borgonha Profundo'],
    stock: 3,
    isNew: true,
    viewsCount: 880,
    sku: 'COA-TOT-SAF-02',
    specs: {
      'Material': '100% Couro de bezerro com certificado Saffiano',
      'Dimensões': '30cm de altura x 42cm de largura x 15cm de profundidade',
      'Metais': 'Fechos banhados a paládio dourado anti-oxidação'
    }
  },
  // SPORTS
  {
    id: 'p16',
    name: 'Bicicleta Caloi Explorer Carbon Sport',
    description: 'Abra caminhos inexplorados com o verdadeiro rendimento de alto nível do quadro em carbono super leve. Relação de marchas Shimano Deore confiável para subidas insanas.',
    price: 9990.00,
    promoPrice: 8499.00,
    category: 'Esportes',
    subcategory: 'Esportes, Automotivo & Outros',
    brand: 'Caloi',
    rating: 4.7,
    reviewsCount: 18,
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Verde Militar Fosco', 'Cinza Metálico'],
    stock: 2,
    viewsCount: 520,
    sku: 'CAL-EXPL-CARB-S',
    specs: {
      'Quadro': 'Fibra de Carbono monocoque de alto módulo',
      'Suspensão': 'RockShox Judy Silver TK com trava guiada remota no guidão',
      'Transmissão': 'Shimano Deore M6100 de 12 marchas na coroa única'
    }
  },
  // PETS
  {
    id: 'p17',
    name: 'Cama para Pets Premium Nuvem Ortopédica',
    description: 'O verdadeiro sono dos deuses para o seu companheiro favorito. Cama feita com espuma viscoelástica avançada com densidade ortopédica ideal, reduzindo estresse e dores nas articulações.',
    price: 299.00,
    promoPrice: 249.00,
    category: 'Pet Shop',
    subcategory: 'Esportes, Automotivo & Outros',
    brand: 'PetCare',
    rating: 4.9,
    reviewsCount: 77,
    images: [
      'https://images.unsplash.com/photo-1541599540903-216a46ca1fc0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600'
    ],
    colors: ['Cinza Nuvem', 'Rosa Algodão', 'Caramelo Aveludado'],
    sizes: ['M (60x60cm)', 'G (80x80cm)', 'GG (100x100cm)'],
    stock: 40,
    viewsCount: 390,
    sku: 'PET-CAM-ORTO',
    specs: {
      'Material': 'Enchimento de espuma ortopédica NASA e microfibra ultra-soft',
      'Lavagem': 'Capa removível com zíper duplo lavável à máquina comum'
    }
  }
];

export function getInstallmentText(price: number): string {
  const installments = 10;
  const value = (price / installments).toFixed(2);
  return `${installments}x de R$ ${value} sem juros`;
}

export function getPixValue(price: number): string {
  // 10% cash discount on PIX
  return (price * 0.90).toFixed(2);
}
