import numeral from 'numeral';

const decimal_reformat = (metric) => numeral(metric).format("0,0.00");
const dollar_reformat = (metric) => numeral(metric).format("$0,0.00");
const demicalReformatLarge = (metric) => numeral(metric).format("$0.00a");
const textToPercentageReformat = (metric) => numeral(parseFloat(metric).toFixed(2)).format("0.00%");
const whole_reformat = (metric) => numeral(metric).format("0,0");

export { decimal_reformat, dollar_reformat, demicalReformatLarge, textToPercentageReformat, whole_reformat };