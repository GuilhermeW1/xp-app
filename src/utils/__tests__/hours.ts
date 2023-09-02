import { getQuarterHourIntervals, discountHour,roundTimeToQuarterHour,  } from '../hours';

const testHours = '09 - 10';
const testHoursQuarter = ['09:00', '09:15', '09:30', '09:45', '10:00'];

describe('test hours', ()=> {
  it('should validate a valid format to the time range', () => {
    expect(() => getQuarterHourIntervals('-01 - 10')).toThrow();
    expect(() => getQuarterHourIntervals('25 - 10')).toThrow();

  });

  it('should return quarter hour intervals', () => {
    const hours = getQuarterHourIntervals(testHours);
    expect(hours).toEqual(testHoursQuarter);
  });

  it('should round time to periods of 15 min ', () => {
    const newHours = roundTimeToQuarterHour(10, 20);
    expect(newHours).toBe('10:15');
  });

  it('should round time to periods of 15 min if minutes are >= 60', ()=>{
    const newHours = roundTimeToQuarterHour(10, 70);
    expect(newHours).toBe('11:00');
  });

  it('should return correct format hours where hour < 10', ()=>{
    const newHours = roundTimeToQuarterHour(9, 0);
    expect(newHours).toBe('09:00');
  });

  it('should return correct format hours where min < 10', ()=>{
    const newHours = roundTimeToQuarterHour(9, 3);
    expect(newHours).toBe('09:00');
  });

  it('should discount hours', ()=>{
    const hoursCopy = [...testHoursQuarter];
    const discountedHours = discountHour(hoursCopy, 45, '09:00');
    expect(discountedHours).toEqual(testHoursQuarter.slice(3));
  });

  it('should discount hours', ()=>{
    const hoursCopy = [...testHoursQuarter];
    const discountedHours = discountHour(hoursCopy, 15, '09:00');
    expect(discountedHours).toEqual(testHoursQuarter.slice(1));
  });

  it('should return -1 if the start hour isnt in the array', ()=>{
    const hoursCopy = [...testHoursQuarter];
    const discountedHours = discountHour(hoursCopy, 45, '08:45');
    expect(discountedHours).toEqual(-1);
  });

  it('should return -1 if the array of hours dont have the length of the discount hours', ()=>{
    const hoursCopy = [...testHoursQuarter];
    const discountedHours = discountHour(hoursCopy, 90, '09:00');
    expect(discountedHours).toEqual(-1);
  });

  it('should return -1 if the range of hours to discount isnt available in the array of hours', ()=>{
    const hoursCopy = [...testHoursQuarter];
    hoursCopy.splice(2 ,1);
    const discountedHours = discountHour(hoursCopy, 30, '09:00');
    expect(discountedHours).toEqual(-1);
  });

  it('should discount 15min if there are just one hour rage available ', () => {
    const hoursCopy = ['09:00'];
    const discountedHours = discountHour(hoursCopy, 15, '09:00');
    expect(discountedHours).toEqual([]);
  });
});
