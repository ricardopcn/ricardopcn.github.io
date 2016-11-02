var funnel;
var TOKEN_RDSTATION = '4ac98d510af23fd1b39770575544b8e0'; // Produção
// var TOKEN_RDSTATION = '40745848f471b10fc6fe7e699831fceb'; // Teste
var BITLY_API_KEY = 'R_389714556f014d0b914fac757528e57e';
var BITLY_LOGIN = 'funildevendasrd';

var getShortUrl = function(longUrl, cb) {
  $.getJSON(
    "http://api.bitly.com/v3/shorten?callback=?",
    {
      "format": "json",
      "apiKey": BITLY_API_KEY,
      "login": BITLY_LOGIN,
      "longUrl": longUrl
    },
    function(response) {
      cb(response.data.url);
    }
  );
};

var integrateWithRDS = function() {
  $('#calculate').on('click', function() {
    getShortUrl(window.location.href, function(shortUrl) {
      var data = [
        {name: 'email', value: HashData.params.email},
        {name: 'link-do-funil', value: shortUrl}
      ];
      var previousFieldName;
      $.each(funnel.data, function(k, v) {
        var conversion = funnel.conversion_rate(previousFieldName, k);
        data.push({name: k, value: v});
        if (conversion) {
          data.push({name: previousFieldName + '-' + k, value: conversion});
        }
        previousFieldName = k;
      });
      RdIntegration.post(postData(data, 'benchmarking-funil-preenchido'));
    });
  });
};

var selectFirstEmtpyInput = function() {
  $("input:visible").each(function() {
    if ($(this).val() === '') {
      $(this).focus();
      return false;
    }
  });
  var selectedLocation = $('#' + HashData.location);
  if (selectedLocation.size()) {
    $('html, body').animate({ scrollTop: selectedLocation.offset().top }, 500);
  }
};

var selectNextField = function(current) {
  var inputs = $("input:visible");
  var idx = inputs.index(current);

  if (idx < inputs.length - 1) {
    inputs[idx + 1].focus();
  }
};

var hasEmptyInputs = function(el) {
  el = el || $(document);
  var $emptyInputs = el.find('input, select').filter(function() { return (this.value + '').trim() === ""; });
  return $emptyInputs.size() > 0;
};

var updateDisabled = function(el, toggle, successMessage) {
  el.prop('disabled', toggle)
    .toggleClass('btn-success', !toggle)
    .toggleClass('btn-default', toggle)
    .toggleClass('disabled', toggle)
    .text(toggle ? 'Preencha os campos' : successMessage);
};

var updateSubmitBtn = function() {
  updateDisabled($('button:submit'), hasEmptyInputs(), 'Começar agora!');
};

var installLPValidationHandlers = function() {
  updateSubmitBtn();
  $("input").on('keyup', updateSubmitBtn);
  $('select').on('change', updateSubmitBtn);
  $('form').on('submit', function(event) {
    event.preventDefault();
    var $this = $(this);
    var relativeLink = $this.attr('action') + '#?' + btoa(formDataToUrlParam($this));
    var data = $this.serializeArray();
    var longUrl = window.location.protocol + '//' + window.location.host + relativeLink;
    getShortUrl(longUrl, function(shortUrl) {
      data.push({name: 'link-do-funil', value: shortUrl});
      RdIntegration.post(postData(data, 'benchmarking-funil-iniciado'), function() {
        window.location = relativeLink;
      });
    });
  });
};

var postData = function(data, identificador) {
  return data.concat([
    {name: 'token_rdstation', value: TOKEN_RDSTATION},
    {name: 'identificador', value: identificador}
  ]);
};

var formDataToUrlParam = function($form) {
  var str = "";
  var data = $form.serializeArray();
  for (var i = 0; i < data.length; i++) {
    var param = data[i];
      if (str !== "") { str += "&"; }
      if (param.name.trim() && (param.value + '').trim()) {
        str += param.name + "=" + encodeURIComponent(param.value);
      }
  }
  return str;
};

var installFunnelValidationHandlers = function() {
  var $inputs = $("input:text");
  $inputs.on('blur', function() {
    var $this = $(this);
    var errorMessage = funnel.errors[$this.attr('id')];
    $inputs.not($this).tooltip('destroy');
    if (errorMessage) {
      $this.tooltip({title: errorMessage, trigger: 'manual', placement: 'bottom'}).tooltip('show');
      $('#' + $this.attr('aria-describedby')).find('.tooltip-inner').text(errorMessage);
    } else {
      $this.tooltip('hide');
      saveFunnel();
    }
  });

  var averageTicket = $('#average_ticket');
  averageTicket.on('keyup', function() {
    var $this = $(this);
    var raw = $this.val();
    var formatted = formatCurrency(raw);
    if (formatted !== raw) {
      $this.val(formatted);
    }
    var fields = {};
    fields[$this.attr('id')] = formatted;
    funnel.update(fields);
    updateDisabled($('#calculate'), !funnel.isValid(), 'Analizar meu funil');
  });
  averageTicket.val(formatCurrency(averageTicket.val()));

  $inputs.not(averageTicket).on('keyup', function() {
    var $this = $(this);
    var raw = $this.val();
    var formatted = raw.replace(/[^\d]/g, '').replace(/^0+/, '');
    if (formatted !== raw) {
      $this.val(formatted);
    }
    var fields = {};
    fields[$this.attr('id')] = formatted;
    funnel.update(fields);
    updateDisabled($('#calculate'), !funnel.isValid(), 'Analizar meu funil');
  });
  funnel.validateAll();
  updateDisabled($('#calculate'), !funnel.isValid(), 'Analizar meu funil');
  if (funnel.isValid()) {
    $('#resultados, #potencial').removeClass('hidden');
  }
  $('#copyModalBtn').on('click', function() {
    var btn = $('#copyButton');
    btn.prop('disabled', true).toggleClass('disabled', true);
    getShortUrl(window.location.href, function(shortUrl) {
      $('#copyTarget').val(shortUrl);
      btn.prop('disabled', false).toggleClass('disabled', false);
    });
  });
};

var formatCurrency = function(val) {
  var formatted = val.replace(/[^\d]/g, '').replace(/^0+/, '');
  var length = formatted.length;
  switch (length) {
    case 0:
      return '0,00';
    case 1:
      return '0,0' + formatted;
    case 2:
      return '0,' + formatted;
    default:
      formatted = formatted.substr(0, length - 2) + ',' + formatted.substr(length - 2);
      return formatted.replace(/(\d)[,.]?(?=(\d{3})+(?!\d))/g, "$1.");
  }
};

var installEventHandlers = function() {
  // Enter navigation though funnel
  $("input:text").on("keypress", function(e) {
    if (e.keyCode == 13) {
      selectNextField(this);
      return false;
    }
  });

  // smooth transition to another section
  $('a[href^="#"]').on('click', function(e) {
    var target = $(this.hash);
    target.removeClass('hidden');
    $('html, body').animate({ scrollTop: target.offset().top }, 500);
    HashData.location = $(this).attr('href').substr(1);
    updateUrl();
    e.preventDefault();
    return false;
  });
};

var saveFunnel = function() {
  for(var field in funnel.data) {
    if (funnel.data[field]) {
      HashData.params[TRANSLATION[field]] = funnel.data[field];
    }
  }
  updateUrl();
};

var updateUrl = function() {
  window.location.hash = toHashParams();
};

var setNumber = function(el, value) {
  var text = value || '';
  if (isNaN(text) || text === 'undefined') {
    text = '';
  }
  el.text(text);
};

var setCurrency = function(el, value) {
  var text = value || '';
  if (text === 'undefined') {
    text = '';
  }
  text = text.replace(/\.(\d{1,2})/g, ',$1');
  text = text.replace(/(\d)[,.]?(?=(\d{3})+(?!\d))/g, "$1.");
  if (text && text.indexOf(',') == -1) {
    text = text + ',00';
  } else if (text && text.split(',')[1].length == 1) {
    text = text + '0';
  }
  el.text(text);
};

var updateFunnelView = function(funnel, funnelView, benchmarking) {
  var data = funnel.data;
  var previousField;
  var previousStepView;
  for (var field in data) {
    var stepView = funnelView.find('.' + field);
    if (field == 'average_ticket') {
      setCurrency(stepView.find('.amount'), data[field]);
    } else {
      setNumber(stepView.find('.amount'), data[field]);
    }
    if (previousField) {
      var rates = previousStepView.find('.myRates');
      setNumber(rates, round(funnel.conversion_rate(previousField, field) * 100, 1));
      if (benchmarking) {
        var diff = benchmarking.conversion_rate_diff(previousField, field);
        rates
          .removeClass('success danger warning')
          .addClass(diff === 0 ? 'warning' : (diff < 0 ? 'danger' : 'success'));
        var benchmarkingView = funnelView.find('.js-' + previousField + '-to-' + field);
        setNumber(benchmarkingView.find('.js-benchmarkingRates'), round(benchmarking.conversion_rate(previousField, field) * 100, 1));
        benchmarkingView.find('.js-benchmarkingComparison').html(benchmarking.conversion_rate_comparison_message(previousField, field));
      }
    }
    previousField = field;
    previousStepView = stepView;
  }
  var average_revenue = '' + funnel.average_revenue();
  setCurrency(funnelView.find('.average_revenue'), average_revenue);
};

var onFunnelUpdate = function(funnel) {
  var benchmarking = new Benchmarking(HashData.params['area-de-atuacao-da-empresa'], funnel);
  updateFunnelView(funnel, $('.resultFunnel'), benchmarking);
  updateFunnelView(benchmarking.maximized_funnel(), $('.idealFunnel'));
  $('.js-funnelComparison').html(benchmarking.maximized_funnel_comparison_message());
};

var loadFunnel = function() {
  var data = {
    visitors: HashData.params.visitantes,
    leads: HashData.params.leads,
    opportunities: HashData.params.oportunidades,
    sales: HashData.params.vendas,
    average_ticket: HashData.params.ticket_medio
  };
  funnel = new Funnel(data, onFunnelUpdate);
  return funnel;
};

var populateFunnel = function() {
  for (var field in funnel.data) {
    $("#" + field).val(funnel.data[field]);
  }
};

var validateRequiredInfo = function() {
  var p = HashData.params;
  var segment = p['area-de-atuacao-da-empresa'] || '';
  if (isBlank(p.nome) || isBlank(p.email) || !CONVERSIONS_BY_SEGMENT.hasOwnProperty(segment)) {
    window.location = "/" + toHashParams();
  } else {
    $('#name').text(p.nome);
    $('#segment').text(segment);
  }
};

var isBlank = function(str) {
  return !str || !((str + '').trim());
};

var loadField = function(name) {
  var value = HashData.params[name];
  $('input[name="' + name + '"]').val(value);
};

var loadPersonalFields = function() {
  loadField('nome');
  loadField('email');
  loadField('cargo');
  loadField('empresa');
  loadField('website');
  loadField('numero-de-funcionarios');
  loadField('area-de-atuacao-da-empresa');
};

$(document).ready(function() {
  switch (window.location.pathname) {
    case "/funil.html":
      validateRequiredInfo();
      loadFunnel();
      installFunnelValidationHandlers();
      integrateWithRDS();
      populateFunnel();
      updateUrl();
      break;
    case "/":
      loadPersonalFields();
      installLPValidationHandlers();
      break;
  }
  installEventHandlers();
  selectFirstEmtpyInput();
});
