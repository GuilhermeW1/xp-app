

// ta com defeito coloca 001 ao inves de 01 no mes e dia ;-;
export function convertDateToStringYYYYMMDD(data: string | number | Date){
  const newDate = new Date(data);
  const [dateToIso] = newDate.toISOString().split('T');

  return dateToIso;
}

export function formatStringDate(date: string){
  let d: string;
  let m: string;
  const [year, month, day] = date.split('-');

  // eslint-disable-next-line prefer-const
  m = month.length != 2 ? '0' + month : month;
  // eslint-disable-next-line prefer-const
  d = day.length != 2 ? '0' + day : day;
  return `${year}-${m}-${d}`;
}

export function getYearMontSring(){
  const [year, month] = convertDateToStringYYYYMMDD(Date.now()).split('-');
  return `${year}-${month}`;
}
