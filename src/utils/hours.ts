/**
 *
 * @param timeRange accepted just this format "00 - 00" and have to be in hours
 * @returns hours in intervals of 15 min like, 00:00, 00:15 ...
 */
export function getQuarterHourIntervals(timeRange: string): string[] {
  const [startTime, endTime] = timeRange.split(' - ');

  const startTimeNumber = parseInt(startTime);
  const endTimeNumber = parseInt(endTime);
  if(startTimeNumber > 24 || startTimeNumber < 0 || endTimeNumber > 24  || endTimeNumber < 0){
    throw new Error('Invalid format');
  }

  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  const intervals: string[] = [];
  let current = start;

  while (current <= end) {
    const formattedTime = current.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    intervals.push(formattedTime);
    current = addMinutes(current, 15);
  }

  return intervals;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

//time example 09:00
export function roundTimeToQuarterHour(hr: number, min: number){
  min = Math.round(min / 15) * 15 ;

  if(min >= 60){
    hr ++;
    min = 0;
  }
  // Format the time
  let formattedHours = hr.toString();
  let formattedMinutes = min.toString();
  if (hr < 10) {
    formattedHours = `0${formattedHours}`;
  }
  if (min < 10) {
    formattedMinutes = `0${formattedMinutes}`;
  }

  return `${formattedHours}:${formattedMinutes}`;
}

//this function return a number that the result is he index
//08:00 = 32; 08:15 = 33
function timeToIndex(time: string): number {
  const [hours, minutes] = time.split(':');
  const hoursAsInt = parseInt(hours);
  const minutesAsInt = parseInt(minutes);

  return (hoursAsInt * 60 + minutesAsInt) / 15;
}
//NOTE: can validate the input data and can use set to convert the arrHours..
//TODO isso aqui vai dar erro se a hora passar das 24 para 00 pois utiliza o index e compara eles .......
//time have to be sent in minutes 70min ... time to start is '00:00' format
export function discountHour(arrHours: string[], timeToDiscount: number, timeToStartDiscount: string): string[] | number{
  const index = arrHours.findIndex((hour) => hour == timeToStartDiscount);

  if(index == -1){
    return -1;
  }

  const discount = timeToDiscount / 15; //this makes the range
  console.log(discount);
  if(discount > arrHours.length){
    return -1;
  }
  const timeAsIndex = arrHours.map(item => timeToIndex(item));
  const startAsIndex = timeToIndex(timeToStartDiscount);

  const indexLoop = timeAsIndex.findIndex(t => t == startAsIndex);

  let available = true;

  for(let i = indexLoop; i < discount; i++ ){
    //if the sequence is not right the function return
    const time = timeAsIndex[i];
    const sequenceTime = timeAsIndex[i+1];

    //a principio isso e redundante com a logica de desconto
    // if(!sequenceTime){
    //   break;
    // }

    if(time !== sequenceTime -1){
      if(discount == 1){
        break;
      }
      available = false;
      break;
    }
  }

  if(available === false){
    return -1;
  }

  const newArray = arrHours.splice(index, discount);
  return arrHours.filter(hr => !newArray.includes(hr));
}
