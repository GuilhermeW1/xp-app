//param time recives a number of minutes can be > 60
//this function return the formated hours ,
export function formatTime(time: number): string{
  if(time <=59 ){
    return `${time} min`;
  }

  const horas = Math.floor(time/ 60);
  const min = time % 60;
  const textoHoras = (`00${horas}`).slice(-2);
  const textoMinutos = (`00${min}`).slice(-2);

  return `${textoHoras }:${textoMinutos} hora(s)`;

}
