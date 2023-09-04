import { getFirebaseDateAndHour } from '../getFirebaseDateAndHour';

test('return a formated date, hopur and minutes', () => {
  const date = {
    seconds: 1693854457,
    dateIsoBR: '04/09/2023',
    hour: '16',
    minutes: '07'
  };
  const { formatedDate, hour, minutes } = getFirebaseDateAndHour(date.seconds);

  expect(formatedDate).toEqual(date.dateIsoBR);
  expect(hour).toEqual(date.hour);
  expect(minutes).toEqual(date.minutes);
});
