import numeral from 'numeral';

const decimalReformat = (metric) => parseFloat(metric).toFixed(2);
const demicalReformatLarge = (metric) => numeral(metric).format("$0.00a");
const textToPercentageReformat = (metric) => numeral(parseFloat(metric).toFixed(2)).format("0.00%");
const wholeReformat = (metric) => numeral(metric).format("0,0.00");

export { decimalReformat, demicalReformatLarge, textToPercentageReformat, wholeReformat };