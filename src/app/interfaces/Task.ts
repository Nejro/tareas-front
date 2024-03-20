export interface Task {
  id: number;
  description:string;
  isDone:boolean;
  editing?:boolean;
}
export type FilterType = 'all' | 'active' | 'done';
