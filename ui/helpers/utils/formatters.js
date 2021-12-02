// TODO: Rename to reflect that this function is used for more cases than ETH, and update all uses.
export function formatETHFee(ethFee, currencySymbol = 'ETH') {
  return `${ethFee} ${currencySymbol}`;
}

export function formatNumber(num){
  if (typeof(num) === 'undefined' || num === null) return '';
  var str = num.toString().split('.');
  str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  if (str[1]) str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  return str.join('.').replace(/[ ]+$/, '');
}