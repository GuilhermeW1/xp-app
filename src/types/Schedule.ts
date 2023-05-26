import { Service } from './service';

type FirebaseDate = {
  nanoseconds: number;
  seconds: number;
}

export interface ScheduleInterface {
  userId: string;
  date: FirebaseDate;
  price: number;
  time: number;
  services: Service[];
}


