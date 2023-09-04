import { convertDateToStringYYYYMMDD, formatDayOfStringDate,addDaysToToday, getDateWithSelectedDay, getToday, getTodayAsIsoString, getYearMontSring, getYearMonthDayString } from '../date';

jest.mock<typeof import('../date')>('../date', () => {
  const originalData = jest.requireActual('../date');

  return {
    ...originalData,
    convertDateToStringYYYYMMDD: jest.fn(() => {
      return '2000-07-24';
    })
  };
});

describe('test dates', () => {

  it('should convert date to string', () => {
    const converted = convertDateToStringYYYYMMDD('');
    const [year, month, day] = converted.split('-');
    expect(year).toEqual('2000');
    expect(month).toEqual('07');
    expect(day).toEqual('24');
    expect(typeof converted).toBe('string');
  });

  it('should format string date 00-00-0000 to y-m-d', () => {
    const formateWithDayIncomplete = formatDayOfStringDate('2000-07-1');
    expect(formateWithDayIncomplete).toEqual('2000-07-01');

    const formateWithAllComplete = formatDayOfStringDate('2000-07-10');
    expect(formateWithAllComplete).toEqual('2000-07-10');

    const formateWithMontIncomplete = formatDayOfStringDate('2000-7-10');
    expect(formateWithMontIncomplete).toEqual('2000-07-10');

  });



  it('should return year and month as a string', () => {
    const data = getYearMontSring();
    const [yearTest, monthTest] = data.split('-');

    const [date] = new Date(Date.now()).toISOString().split('T');
    const [year, month] = date.split('-');
    expect(yearTest).toEqual(year);
    expect(monthTest).toEqual(month);
  });

  it('should return a year mont day string', ()=> {
    const data = getYearMonthDayString();
    const [yearTest, monthTest,dayTest] = data.split('-');

    const [date] = new Date(Date.now()).toISOString().split('T');
    const [year, month,day] = date.split('-');
    expect(yearTest).toEqual(year);
    expect(monthTest).toEqual(month);
    expect(dayTest).toEqual(day);
  });

  it('should return a formated date with selected day', () => {
    const testDay = 2;
    const date = getDateWithSelectedDay(testDay);

    const todayDate = new Date(Date.now());
    const [testDate] = new Date(todayDate.getFullYear(), todayDate.getMonth(), testDay).toISOString().split('T');

    expect(testDate).toEqual(date);
  });

  it('should return today isoString', () => {
    const [today] = new Date(Date.now()).toISOString().split('T');
    const date = getTodayAsIsoString();
    expect(today).toEqual(date);
  });

  it('should add days to today', () => {
    const days = 10;
    const addedDays = addDaysToToday(days);
    const date = new Date(Date.now());
    date.setDate(date.getDate() + days);
    const [formatDate] = date.toISOString().split('T');
    expect(addedDays).toEqual(formatDate);

  });

  it('should return today as string pt-BR', () => {
    const todayAsISoBR = getToday();

    const newDate = new Date(Date.now());
    const isoString = newDate.toLocaleString('pt-BR');
    const date = isoString.slice(0, 10);
    const [day, month, year] = date.split('/');

    expect(todayAsISoBR).toEqual(`${year}-${month}-${day}`);

  });
});
