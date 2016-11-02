var CONVERSIONS_BY_SEGMENT = {
  'Agência de Marketing e Publicidade':	{
    vl: 0.04, lo: 0.135, os: 0.24
  },
  'Consultorias e Treinamentos': {
    vl: 0.045, lo: 0.123, os: 0.379
  },
  'Ecommerce': {
    vl: 0.03, lo: 0.211, os: 0.614
  },
  'Educação e Ensino': {
    vl: 0.063, lo: 0.121, os: 0.321
  },
  'Engenharia e Indústria Geral': {
    vl: 0.038, lo: 0.176, os: 0.373
  },
  'Eventos': {
    vl: 0.043, lo: 0.102, os: 0.572
  },
  'Financeiro, Jurídico e Serviços Relacionados': {
    vl: 0.046, lo: 0.148, os: 0.239
  },
  'Governo e Órgãos Públicos': {
    vl: 0.0, lo: 0.0, os: 0.0
  },
  'Hardware e Eletrônicos': {
    vl: 0.055, lo: 0.116, os: 0.607
  },
  'Imobiliárias': {
    vl: 0.029, lo: 0.131, os: 0.383
  },
  'Mídia e Comunicação': {
    vl: 0.038, lo: 0.108, os: 0.268
  },
  'ONGs': {
    vl: 0.047, lo: 0.126, os: 0.244
  },
  'Saúde e Estética': {
    vl: 0.051, lo: 0.224, os: 0.363
  },
  'Serviços em Geral': {
    vl: 0.041, lo: 0.227, os: 0.358
  },
  'Serviços em RH e Coaching': {
    vl: 0.05, lo: 0.162, os: 0.209
  },
  'Software e Cloud': {
    vl: 0.057, lo: 0.122, os: 0.148
  },
  'Telecomunicações': {
    vl: 0.057, lo: 0.436, os: 0.147
  },
  'Turismo e Lazer': {
    vl: 0.051, lo: 0.239, os: 0.252
  },
  'Varejo': {
    vl: 0.026, lo: 0.217, os: 0.169
  }
};

var round = function(number, decimal_digits) {
  factor = Math.pow(10, decimal_digits);
  return Math.round(number * factor) / factor;
};

function Benchmarking(segment, funnel) {
  this.segment = segment;
  this.funnel = funnel;
  this.rates = CONVERSIONS_BY_SEGMENT[segment];
}

Benchmarking.prototype.conversion_rate = function(from, to) {
  if (!this.rates) {
    return '';
  }
  return round(this.rates[from[0] + to[0]], 3);
};

Benchmarking.prototype.conversion_rate_diff = function(from, to) {
  return round(this.funnel.conversion_rate(from, to) - this.conversion_rate(from, to), 3);
};

Benchmarking.prototype.conversion_rate_comparison_message = function(from, to) {
  if (!this.rates) {
    return '';
  }

  diff_percentage = this.conversion_rate_diff(from, to);
  if (diff_percentage > 0) {
    return "Você está acima da média do segmento de " + this.segment + ". Ótimo trabalho!";
  } else if (diff_percentage < 0) {
    return "Você está abaixo da média do segmento de " + this.segment + ". Com certeza ainda tem espaço para melhorias!";
  } else {
    return "Você está na média do segmento de " + this.segment + ". Ótimo!";
  }
};

Benchmarking.prototype.maximized_funnel = function() {
  if (typeof(this._maximized_funnel) === 'undefined') {
    this._maximized_funnel = this._generate_maximized_funnel();
  }
  return this._maximized_funnel;
};

Benchmarking.prototype._formatCurrency = function(value, decimal_digits) {
  var text = value.toFixed(decimal_digits);
  text = text.replace(/\.(\d{1,2})$/g, ',$1');
  return text.replace(/(\d)[,.]?(?=(\d{3})+(?!\d))/g, "$1.");
};

Benchmarking.prototype.maximized_funnel_comparison_message = function(from, to) {
  var average_revenue = this.funnel.average_revenue();
  var diff = round(this.maximized_funnel().average_revenue() - average_revenue, 2);
  var diff_percentage = round(diff / average_revenue * 100, 1);
  if (diff_percentage > 0) {
    return '<h2>Vamos aumentar os resultados?</h2>' +
    '<blockquote>Com o mesmo número de visitantes atual, o potencial de aumento do seu faturamento é de <strong>' + this._formatCurrency(diff_percentage, 1) + '%</strong> o que representa <strong>R$' + this._formatCurrency(diff, 2) + '</strong> a mais de receita!</blockquote>' +
    '<p>Aplicando uma estratégia de Inbound Marketing, você consegue otimizar as taxas de conversão do funil, fazendo com que mais visitantes se tornem Leads, oportunidades e clientes.</p><p>Além disso, ao trazer mais visitantes para o site, todas as etapas do funil são beneficiadas, aumentando ainda mais os resultados.</p><p>Quer saber como aplicar essa estratégia na sua empresa e otimizar seu funil de vendas? Converse gratuitamente com um especialista e receba uma avaliação do seu negócio.</p>' +
    '<div class="raised-hand">' +
      '<a href="http://materiais.resultadosdigitais.com.br/bate-papo-com-a-rd" id="contactBtn" class="btn btn-lg btn-success">Conversar com especialista</a>' +
    '</div>';
  } else {
    return '<h2>Vamos ganhar escala?</h2>' +
    '<blockquote>São poucas as empresas que veem esta mensagem. Comemore! Você provavelmente está fazendo um ótimo trabalho.</blockquote>' +
    '<p>Seu funil está acima da média do seu mercado, e você certamente é uma das empresas que puxam os números para cima. Mas o que fazer a partir de agora?</p><p>Um dos grandes desafios para quem tem o funil mapeado e otimizado é encontrar formas de melhorar ainda mais as métricas, a fim de ganhar previsibilidade de vendas e atrair mais visitantes para conseguir ganhar escala em todo o processo.</p><p>Assim como a sua empresa, nós também procuramos a cada dia gerar resultados extraordinários. Para mostrar quais os próximos passos a seguir, queremos que você converse com um de nossos consultores especialistas para uma avaliação gratuita.</p>' +
    '<div class="raised-hand">' +
      '<a href="http://materiais.resultadosdigitais.com.br/bate-papo-com-a-rd" id="contactBtn" class="btn btn-lg btn-success">Conversar com especialista</a>' +
    '</div>';
  }
};

Benchmarking.prototype._generate_maximized_funnel = function() {
  var data = {
    visitors: this.funnel.data.visitors
  };
  data.leads = round(data.visitors * this._best_conversion_rate('visitors', 'leads'), 0);
  data.opportunities = round(data.leads * this._best_conversion_rate('leads', 'opportunities'), 0);
  data.sales = round(data.opportunities * this._best_conversion_rate('opportunities', 'sales'), 0);
  data.average_ticket = this.funnel.data.average_ticket;
  return new Funnel(data);
};

Benchmarking.prototype._best_conversion_rate = function(from, to) {
  return Math.max(this.funnel.conversion_rate(from, to), this.conversion_rate(from, to));
};
