import { CategoryItem, Product, SiteContent } from '../types/catalog';

export const WHATSAPP_URL = 'https://wa.me/message/TPIXV7OGNX7ZC1';

export const FACEBOOK_URL = 'https://www.facebook.com/share/1BZ5PNTwB6/';

export const OFFICIAL_LOGO_URL =
  '/assets/aistudio/WhatsApp_Image_2026-11-26_at_21.24.31_ab4f99f6.jpeg';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brandName: 'A.S Imports Variedades',
  customLogoUrl: OFFICIAL_LOGO_URL,
  heroTitle: 'BEM-VINDO À A.S IMPORTS VARIEDADES!',
  heroSubtitle:
    'Uma loja de variedades, diversas marcas e muitas opções para você!',
  heroPrimaryCta: 'Conheça nossos produtos',
  heroSecondaryCta: 'Fale conosco pelo WhatsApp',
  heroImageUrl: '/src/assets/images/hero_variety_store_1795736038456.jpg',
  heroImageCaption:
    'Vitrine multimarcas — Meias, casa, organização e utilidades',
  heroHighlights:
    'Atendimento direto · Diversas marcas selecionadas · Casa, organização, acessórios e utilidades',
  aboutTitle: 'Sobre nossa empresa',
  aboutText:
    'A A.S Imports Variedades é uma empresa que trabalha com diversas marcas e uma grande variedade de produtos. Nosso objetivo é oferecer qualidade, bons preços, praticidade e um atendimento especial para nossos clientes. Estamos sempre buscando novidades e novas opções para atender diferentes necessidades.',
  aboutPillars: [
    {
      title: 'Qualidade selecionada',
      detail:
        'Produtos escolhidos com atenção ao acabamento, durabilidade e utilidade real.',
    },
    {
      title: 'Praticidade e bons preços',
      detail:
        'Soluções inteligentes para casa, rotina e uso pessoal com excelente custo-benefício.',
    },
    {
      title: 'Novidades constantes',
      detail:
        'Curadoria contínua de novas marcas e opções para atender diferentes necessidades.',
    },
  ],
  categoriesTitle: 'Nossas marcas e variedades',
  categoriesSubtitle:
    'Trabalhamos com múltiplas marcas e categorias completas para o seu dia a dia — de meias e acessórios a soluções de organização, casa e utilidades gerais.',
  showcaseTitle: 'Nossa vitrine de produtos',
  showcaseSubtitle:
    'Explore opções selecionadas de diversas marcas. Gostou de algum produto? Consulte disponibilidade e valores diretamente pelo nosso WhatsApp.',
  whyTitle: 'Por que escolher a A.S Imports?',
  whySubtitle:
    'Compromisso com confiança, atendimento humano e variedade real para acompanhar suas necessidades.',
  whyReasons: [
    {
      title: 'Diversas marcas',
      description:
        'Trabalhamos com marcas reconhecidas e fornecedores confiáveis para oferecer procedência e segurança em cada escolha.',
    },
    {
      title: 'Grande variedade de produtos',
      description:
        'De meias e acessórios a itens para casa, organização e utilidades gerais, tudo reunido em um só lugar.',
    },
    {
      title: 'Qualidade e praticidade',
      description:
        'Curadoria pensada para facilitar o cotidiano com materiais duráveis, funcionais e bem acabados.',
    },
    {
      title: 'Ofertas especiais',
      description:
        'Condições justas e oportunidades frequentes para você aproveitar o melhor custo-benefício.',
    },
    {
      title: 'Atendimento personalizado',
      description:
        'Suporte próximo e ágil pelo WhatsApp para tirar dúvidas, indicar opções e agilizar sua consulta.',
    },
  ],
  contactTitle: 'Fale com a A.S Imports Variedades',
  contactSubtitle:
    'Quer consultar disponibilidade de produtos, conhecer novidades ou tirar dúvidas sobre marcas e opções? Nossa equipe atende você diretamente pelo WhatsApp.',
  whatsappUrl: WHATSAPP_URL,
  instagramHandle: '@asimportsvariedades',
  instagramUrl: 'https://instagram.com',
  otherSocialTitle: 'Facebook',
  otherSocialDescription: 'Acompanhe nossa página oficial no Facebook',
  otherSocialUrl: FACEBOOK_URL,
  footerBrandTitle: 'A.S IMPORTS VARIEDADES',
  footerSlogan: 'Variedade, qualidade e boas escolhas para você!',
};

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'meias-acessorios',
    name: 'Meias e acessórios',
    description:
      'Kits esportivos, modelos casuais em algodão macio e acessórios funcionais para o dia a dia.',
    sortOrder: 1,
  },
  {
    id: 'produtos-para-casa',
    name: 'Produtos para casa',
    description:
      'Itens de conforto, toalhas, aromatizadores e soluções práticas para tornar seu lar mais acolhedor.',
    sortOrder: 2,
  },
  {
    id: 'organizacao',
    name: 'Organização',
    description:
      'Caixas organizadoras, potes herméticos e cestos modulares para otimizar despensa, closet e escritório.',
    sortOrder: 3,
  },
  {
    id: 'utilidades',
    name: 'Utilidades',
    description:
      'Utensílios de cozinha, garrafas térmicas e ferramentas versáteis que facilitam sua rotina.',
    sortOrder: 4,
  },
  {
    id: 'diversas-marcas',
    name: 'Diversas marcas',
    description:
      'Seleção multimarcas com procedência confiável, acabamento resistente e excelente custo-benefício.',
    sortOrder: 5,
  },
  {
    id: 'novidades',
    name: 'Novidades e outros produtos',
    description:
      'Lançamentos sazonais, presentes e itens variados selecionados continuamente para você.',
    sortOrder: 6,
  },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-org-pantry',
    name: 'Conjunto Organizador Modular com Tampa em Bambu',
    description:
      'Kits empilháveis com vedação firme e design limpo para manter mantimentos, grãos e armários sempre em ordem.',
    brand: 'Linha Home & Co',
    categoryId: 'organizacao',
    imageUrl: '/src/assets/images/product_home_organizer_1795736039671.jpg',
    price: 89.9,
    featured: true,
    visible: true,
    sortOrder: 1,
  },
  {
    id: 'prod-util-kit',
    name: 'Garrafa Térmica Inox + Kit Utensílios em Silicone',
    description:
      'Garrafa térmica de parede dupla acompanhada de espátula, colher e concha em silicone resistente ao calor.',
    brand: 'Aura Kitchen',
    categoryId: 'utilidades',
    imageUrl: '/src/assets/images/product_kitchen_utilities_1795736040065.jpg',
    price: 119.9,
    featured: true,
    visible: true,
    sortOrder: 2,
  },
  {
    id: 'prod-casa-conforto',
    name: 'Kit Conforto Casa: Toalhas Macias e Difusor Cerâmico',
    description:
      'Toalhas em algodão encorpado combinadas com difusor de ambientes minimalista e bandeja decorativa.',
    brand: 'Casa Essencial',
    categoryId: 'produtos-para-casa',
    imageUrl: '/src/assets/images/product_home_decor_1795736040683.jpg',
    price: 134.9,
    featured: false,
    visible: true,
    sortOrder: 3,
  },
  {
    id: 'prod-acess-viagem',
    name: 'Necessaire Organizadora Tech + Copo Térmico Diário',
    description:
      'Bolsa compacta para cabos e documentos com acabamento resistente à água, guarda-chuva compacto e copo térmico.',
    brand: 'Urban Carry',
    categoryId: 'diversas-marcas',
    imageUrl: '/src/assets/images/product_travel_accessories_1795736040956.jpg',
    price: null,
    featured: false,
    visible: true,
    sortOrder: 4,
  },
  {
    id: 'prod-meias-pack',
    name: 'Kit 6 Pares de Meias Algodão Esportivo & Casual',
    description:
      'Meias anatômicas com toque suave, calcanhar reforçado e respirabilidade para uso esportivo ou cotidiano.',
    brand: 'Seleção Multimarca',
    categoryId: 'meias-acessorios',
    imageUrl: '/src/assets/images/product_socks_pack_1795736039151.jpg',
    price: 54.9,
    featured: true,
    visible: true,
    sortOrder: 5,
  },
  {
    id: 'prod-novidades-showroom',
    name: 'Seleção Especial de Lançamentos para Casa e Rotina',
    description:
      'Itens variados recém-chegados: cestos trançados, têxteis neutros e utilidades selecionadas para renovar seus espaços.',
    brand: 'A.S Curadoria',
    categoryId: 'novidades',
    imageUrl: '/src/assets/images/hero_variety_store_1795736038456.jpg',
    price: null,
    featured: false,
    visible: true,
    sortOrder: 6,
  },
];

export const SAMPLE_IMAGE_PRESETS = [
  {
    label: 'Organização e Potes',
    url: '/src/assets/images/product_home_organizer_1795736039671.jpg',
  },
  {
    label: 'Utilidades e Garrafa Térmica',
    url: '/src/assets/images/product_kitchen_utilities_1795736040065.jpg',
  },
  {
    label: 'Casa, Toalhas e Difusor',
    url: '/src/assets/images/product_home_decor_1795736040683.jpg',
  },
  {
    label: 'Acessórios e Viagem',
    url: '/src/assets/images/product_travel_accessories_1795736040956.jpg',
  },
  {
    label: 'Kit de Meias',
    url: '/src/assets/images/product_socks_pack_1795736039151.jpg',
  },
  {
    label: 'Variedades e Lançamentos',
    url: '/src/assets/images/hero_variety_store_1795736038456.jpg',
  },
];
