export function getFirebaseDateAndHour(seconds: number): {
  formatedDate: string;
  hour: string;
  minutes: string;
}{
  // const {seconds} = schedule.date;
  const date = new Date(seconds * 1000);
  const [formatedDate, fullHour] = date.toLocaleString('pt-BR').split(' ');
  const [hour, minutes] = fullHour.split(':');

  return {formatedDate, hour, minutes};
}
