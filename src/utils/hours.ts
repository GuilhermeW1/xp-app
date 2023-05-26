export function getQuarterHourIntervals(timeRange: string): string[] {
  const [startTime, endTime] = timeRange.split(' - ');
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

  if(min == 60){
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

    if(!sequenceTime){
      break;
    }

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


// function discountHour(arrHours: string[], timeToDiscount: number, timeToStartDiscount: string){
//   const index = arrHours.findIndex(hour => hour === timeToStartDiscount);

//   if(index === -1){
//     return;
//   }

//   const discount = timeToDiscount / 15; //this makes the range

//   const timeAsIndex = arrHours.map(item => timeToIndex(item));
//   const startAsIndex = timeToIndex(timeToStartDiscount);

//   let available = false;
//   let count = 0;
//   for(let i = timeAsIndex[startAsIndex]; i < timeAsIndex.length; i++ ){
//     //if the range is available we can discount the hours this ensure the correct space time to be removed
//     if(count == discount){
//       available = true;
//       return;
//     }
//     const time = timeAsIndex[i];
//     const sequenceTime = timeAsIndex[i +1] -1; //this give me the index of the next value and dicounts 1

//     if(time == sequenceTime){
//       count ++;
//     }
//   }

//   if(available === false){
//     return -1;
//   }


// const timeStart = hoursTable[timeToStartDiscount as keyof typeof hoursTable];

// for(let i =0; i < arrHours.length; i++){
//   const [hour, min] = arrHours[i];
//   //   if(i >= index){

//   //   }
//   // }
// }


// const hoursTable = {
//   '00:00': 0,
//   '00:15': 1,
//   '00:30': 2,
//   '00:45': 3,
//   '01:00': 4,
//   '01:15': 5,
//   '01:30': 6,
//   '01:45': 7,
//   '02:00': 8,
//   '02:15': 9,
//   '02:30': 10,
//   '02:45': 11,
//   '03:00': 12,
//   '03:15': 13,
//   '03:30': 14,
//   '03:45': 15,
//   '04:00': 16,
//   '04:15': 17,
//   '04:30': 18,
//   '04:45': 19,
//   '05:00': 20,
//   '05:15': 21,
//   '05:30': 22,
//   '05:45': 23,
//   '06:00': 24,
//   '06:15': 25,
//   '06:30': 26,
//   '06:45': 27,
//   '07:00': 28,
//   '07:15': 29,
//   '07:30': 30,
//   '07:45': 31,
//   '08:00': 32,
//   '08:15': 33,
//   '08:30': 34,
//   '08:45': 35,
//   '09:00': 36,
//   '09:15': 37,
//   '09:30': 38,
//   '09:45': 39,
//   '10:00': 40,
//   '10:15': 41,
//   '10:30': 42,
//   '10:45': 43,
//   '11:00': 44,
//   '11:15': 45,
//   '11:30': 46,
//   '11:45': 47,
//   '12:00': 48,
//   '12:15': 49,
//   '12:30': 50,
//   '12:45': 51,
//   '13:00': 52,
//   '13:15': 53,
//   '13:30': 54,
//   '13:45': 55,
//   '14:00': 56,
//   '14:15': 57,
//   '14:30': 58,
//   '14:45': 59,
//   '15:00': 60,
//   '15:15': 61,
//   '15:30': 62,
//   '15:45': 63,
//   '16:00': 64,
//   '16:15': 65,
//   '16:30': 66,
//   '16:45': 67,
//   '17:00': 68,
//   '17:15': 69,
//   '17:30': 70,
//   '17:45': 71,
//   '18:00': 72,
//   '18:15': 73,
//   '18:30': 74,
//   '18:45': 75,
//   '19:00': 76,
//   '19:15': 77,
//   '19:30': 78,
//   '19:45': 79,
//   '20:00': 80,
//   '20:15': 81,
//   '20:30': 82,
//   '20:45': 83,
//   '21:00': 84,
//   '21:15': 85,
//   '21:30': 86,
//   '21:45': 87,
//   '22:00': 88,
//   '22:15': 89,
//   '22:30': 90,
//   '22:45': 91,
//   '23:00': 92,
//   '23:15': 93,
//   '23:30': 94,
//   '23:45': 95
// };
