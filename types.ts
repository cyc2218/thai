
export enum Category {
  SIGHTSEEING = 'Sightseeing',
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  STAY = 'Stay',
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  category: Category;
  note?: string;
  image?: string;
}

export interface DaySchedule {
  date: string;
  weather: 'sunny' | 'rainy' | 'cloudy';
  temp: number;
  items: ScheduleItem[];
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  payerId: string;
  splitWith: string[]; // member ids
  date: string;
  description: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  assigneeId?: string;
}

export interface Booking {
  id: string;
  type: 'flight' | 'stay' | 'car' | 'ticket';
  title: string;
  details: any;
}
