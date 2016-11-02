var round = function(number, decimal_digits) {
  factor = Math.pow(10, decimal_digits);
  return Math.round(number * factor) / factor;
};

var ORDERED_STEPS = ['visitors', 'leads', 'opportunities', 'sales'];

var TRANSLATION = {
  'visitors': 'visitantes',
  'visitantes': 'visitors',
  'leads': 'leads',
  'oportunidades': 'opportunities',
  'opportunities': 'oportunidades',
  'sales': 'vendas',
  'vendas': 'sales',
  'ticket_medio': 'average_ticket',
  'average_ticket': 'ticket_medio'
};

function Funnel(data, updateListener) {
  this.data = data;
  this.updateListener = updateListener;
  this.validateAll();
}
Funnel.prototype.conversion_rate = function(from, to) {
  return round(Number(this.data[to]) / Number(this.data[from]), 3);
};

Funnel.prototype.average_revenue = function() {
  if (!this.data.average_ticket || !this.data.sales) { return; }

  return round(this._getAverageTicket() * this.data.sales, 2);
};

Funnel.prototype.update = function(newData) {
  var changed = false;
  for(var i = 0; i < ORDERED_STEPS.length; i++) {
    var field = ORDERED_STEPS[i];
    var value = newData[field];
    if (typeof(value) === 'undefined') { continue; }

    if (this.data[field] != value) {
      this.data[field] = value;
      changed = true;
    }
  }

  var averageTicket = newData.average_ticket;
  if (typeof(averageTicket) !== 'undefined') {
    this.data.average_ticket = averageTicket;
    changed = true;
  }

  if (changed) { this.validateAll(); }
  return changed;
};

Funnel.prototype.isValid = function() {
  return Object.keys(this.errors).length === 0;
};

Funnel.prototype.validate = function(field) {
  var value = this.data[field] + '';
  value = value.trim();
  if (typeof(value) === 'undefined' || value === 'undefined' || value === '') {
    this.errors[field] = 'Preencha este campo';
    return;
  }

  if (isNaN(value) || value.indexOf('.') != -1) {
    this.errors[field] = "Número inválido! Preencha apenas com números inteiros (Ex. 100)";
    return;
  }

  var numericalValue = Number(value);
  if (numericalValue < 0) {
    this.errors[field] = 'Não é permitido números negativos';
    return;
  }

  var previousFieldName = ORDERED_STEPS[ORDERED_STEPS.indexOf(field) - 1];
  var previousFieldValue = this.data[previousFieldName];
  if (previousFieldValue && numericalValue > previousFieldValue) {
    this.errors[field] = 'O número de ' + TRANSLATION[field] + ' deve ser menor ou igual ao o número de ' + TRANSLATION[previousFieldName];
  }
};

Funnel.prototype.validateAll = function() {
  this.errors = {};
  for(var i = 0; i < ORDERED_STEPS.length; i++) {
    this.validate(ORDERED_STEPS[i]);
  }

  this._validateAverageTicket();
  if (this.updateListener) { this.updateListener(this); }
};

Funnel.prototype._parseCurrency = function(text) {
  return (text + '').replace(/[.,](\d{3})/g, '$1').replace(/[.,](\d{0,2})$/, '.$1');
};

Funnel.prototype._getAverageTicket = function() {
  var replacedValue = this._parseCurrency(this.data.average_ticket);
  return Number(replacedValue);
};

Funnel.prototype._validateAverageTicket = function() {
  var field = 'average_ticket';
  var value = this.data[field];
  if (typeof(value) === 'undefined' || value.trim() === '') {
    this.errors[field] = 'Preencha este campo';
    return;
  }

  var replacedValue = this._parseCurrency(value);
  if (isNaN(replacedValue)) {
    this.errors[field] = "Valor inválido! Por favor verifique e corrija (Ex. 100,00)";
    return;
  }

  var numericalValue = Number(replacedValue);
  if (numericalValue <= 0) {
    this.errors[field] = 'Ticket médio deve ser maior que zero (0,00)';
  }
};
