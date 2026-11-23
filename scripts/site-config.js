/**
 * Configuração central da Barbearia (Modelo Demonstrativo Configurável).
 *
 * Para publicar o site com dados reais do cliente, basta preencher
 * os campos abaixo (nome, WhatsApp, endereço, horários, preços e links).
 * Enquanto os campos reais estiverem vazios, a interface opera em modo
 * demonstrativo transparente, sem expor contatos ou avaliações fictícias.
 */

export const SITE_CONFIG = {
  isDemoMode: true,

  brand: {
    wordmarkLeft: 'BLADE',
    wordmarkAmp: '&',
    wordmarkRight: 'CO.',
    fullName: 'BLADE & CO. Barbearia',
    subtitle: 'Barbearia Clássica & Contemporânea',
    heroBadge: 'Modelo demonstrativo · Barbearia premium',
  },

  contact: {
    // Preencha apenas com dígitos (DDI + DDD + número), ex.: '5511999999999'
    whatsappNumber: '',
    whatsappDisplay: 'WhatsApp oficial configurável',
    phoneHref: '',
    phoneDisplay: 'Telefone comercial configurável',
    email: '',
    emailDisplay: 'E-mail comercial configurável',
    instagramHandle: 'Instagram oficial configurável',
    instagramUrl: '',
    googleReviewsUrl: '',
  },

  location: {
    street: 'Endereço da barbearia (Rua, número e complemento)',
    districtCity: 'Bairro, Cidade / UF (configurável)',
    referenceNote: 'Ponto de referência ou informações de estacionamento configuráveis.',
    // Cole a URL de incorporação do Google Maps (src do iframe) quando houver endereço real
    mapEmbedUrl: '',
    // Cole o link de rota do Google Maps quando houver endereço real
    mapDirectionsUrl: '',
  },

  hoursNote: 'Grade de horários ilustrativa para demonstração. Ajuste conforme a operação oficial.',
  hours: [
    { days: 'Terça a Sexta', time: '09h às 20h', demo: true },
    { days: 'Sábado', time: '09h às 18h', demo: true },
    { days: 'Domingo e Segunda', time: 'Fechado', demo: true },
  ],

  pricingNote: 'Valores e durações meramente demonstrativos para visualização da tabela. Substitua pelos preços oficiais em scripts/site-config.js.',
  services: [
    {
      id: 'corte-masculino',
      category: 'cabelo',
      name: 'Corte Masculino',
      description: 'Consultoria de proporção, execução na tesoura e máquina (clássico, degradê ou texturizado), lavagem e finalização.',
      duration: '45 min',
      priceLabel: 'Ex.: R$ 75',
      featured: false,
    },
    {
      id: 'barba-tradicional',
      category: 'barba',
      name: 'Barba Tradicional',
      description: 'Alinhamento geométrico na navalha, preparo com toalha quente, espuma cremosa, pós-barba calmante e óleo hidratante.',
      duration: '35 min',
      priceLabel: 'Ex.: R$ 55',
      featured: false,
    },
    {
      id: 'corte-barba',
      category: 'combos',
      name: 'Corte + Barba Completo',
      description: 'Experiência completa da casa unindo corte sob medida, ritual de barba com toalha quente e finalização personalizada.',
      duration: '75 min',
      priceLabel: 'Ex.: R$ 115',
      featured: true,
      badge: 'Mais escolhido',
    },
    {
      id: 'acabamento',
      category: 'cabelo',
      name: 'Acabamento & Contorno',
      description: 'Manutenção precisa de nuca, costeletas, linha frontal e contornos de barba entre um corte principal e outro.',
      duration: '20 min',
      priceLabel: 'Ex.: R$ 35',
      featured: false,
    },
    {
      id: 'barboterapia',
      category: 'barba',
      name: 'Ritual Barboterapia',
      description: 'Protocolo estendido com esfoliação facial suave, dupla toalha quente aromática, navalha de precisão e massagem relaxante.',
      duration: '50 min',
      priceLabel: 'Ex.: R$ 85',
      featured: false,
    },
    {
      id: 'hidratacao-camuflagem',
      category: 'combos',
      name: 'Tratamento Capilar ou Camuflagem',
      description: 'Nutrição profunda dos fios ou tonalização sutil de grisalhos com acabamento natural e discreto.',
      duration: '40 min',
      priceLabel: 'Ex.: R$ 70',
      featured: false,
    },
  ],

  reviews: {
    ratingLabel: '—, —',
    countLabel: 'Aguardando conexão com o Perfil da Empresa no Google',
    slots: [
      {
        label: 'Espaço reservado · Avaliação real #1',
        serviceTag: 'Corte + Barba Completo',
        placeholder: 'Este espaço exibe um depoimento real de cliente verificado após a ativação das avaliações oficiais da barbearia.',
        authorPlaceholder: 'Nome do cliente · Avaliação verificada',
      },
      {
        label: 'Espaço reservado · Avaliação real #2',
        serviceTag: 'Corte Masculino',
        placeholder: 'Estrutura preparada para destacar comentários reais sobre pontualidade, acabamento e atendimento personalizado.',
        authorPlaceholder: 'Nome do cliente · Avaliação verificada',
      },
      {
        label: 'Espaço reservado · Avaliação real #3',
        serviceTag: 'Ritual Barboterapia',
        placeholder: 'Conecte seu perfil no Google para publicar feedbacks autênticos, sem uso de avaliações fictícias.',
        authorPlaceholder: 'Nome do cliente · Avaliação verificada',
      },
    ],
  },
};
