define(['ojs/ojcore', 'ojs/ojvalidation-datetime', 'ojs/ojvalidation-number'], (oj) => {
  /**
   * Parser - Class for data handling that is used for format dates, parse dates, user initials, etc.
   *
   * @constructor
   */
  function Parser() {
    const self = this;
    const dateConverter = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({ pattern: 'dd-MMM-yyyy' });

    self.formatDate = (date) => {
      if (date.constructor === Date) return dateConverter.format(date.toISOString());
      return null;
    };

    self.parseToCurrency = function parseToCurrency(value, currencyString) {
      const salOptions = { style: 'currency', currency: currencyString };
      const currencyConverter = oj.Validation.converterFactory('number').createConverter(salOptions);
      return currencyConverter.format(value);
    };
    self.formatDate = function formatDate(initial) {
      const date = new Date(initial);
      const locale = 'en-us';
      const month = date.toLocaleString(locale, { month: 'short' });
      return `${date.getDate()}-${month}-${date.getFullYear()}`;
    };
    self.formatDateComplete = function formatDate(initial) {
      const date = new Date(initial);
      const locale = 'en-us';
      const month = date.toLocaleString(locale, { month: 'short' });
      return `${date.getDate()}-${month}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    };

  }

  return new Parser();
});
