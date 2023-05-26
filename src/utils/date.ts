

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
  m = month.toString().length != 2 ? '0' + month : month;
  // eslint-disable-next-line prefer-const
  d = day.toString().length != 2 ? '0' + day : day;
  return `${year}-${m}-${d}`;
}

//return format yyyy-mm
export function getYearMontSring(){
  const [year, month] = convertDateToStringYYYYMMDD(Date.now()).split('-');
  return `${year}-${month}`;
}

export  function getDateWithSelectedDay(day: number): string {
  const today = new Date(Date.now());
  const year = today.getFullYear();
  const month = today.getMonth();
  const selectedDate = new Date(year, month, day);

  if (selectedDate.getMonth() !== month) {
    // Se o dia selecionado for maior que o número de dias no mês atual, retorna o último dia do mês
    return convertDateToStringYYYYMMDD(new Date(year, month + 1, 0));
  }

  return convertDateToStringYYYYMMDD(selectedDate);
}

//return format yyyy-mm-dd
export function getYearMonthDayString(){
  const [year, month, day] = convertDateToStringYYYYMMDD(Date.now()).split('-');
  return `${year}-${month}-${day}`;
}

function getTodayData():Date{
  return new Date(Date.now());
}

export function getTodayAsIsoString(){
  const newDate = getTodayData();
  const isoString = newDate.toISOString();
  const date = isoString.slice(0, 10);

  return date;
}

export function addDaysToToday(days: number){
  const newDate = getTodayData();
  newDate.setDate(newDate.getDate() + days);

  const isoString = newDate.toISOString();
  const date = isoString.slice(0, 10);

  return date;
}

//return format yyyy-mm-dd
export function getToday(){
  const newDate = getTodayData();

  const isoString = newDate.toLocaleString('pt-BR');
  const date = isoString.slice(0, 10);
  const [day, month, year] = date.split('/');

  return `${year}-${month}-${day}`;
}
