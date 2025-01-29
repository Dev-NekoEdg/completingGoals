export interface GoalDetail {
  id:number;
  name: string;
  description: string;
  imageUrl: string;
  listId: number;
  listName? : string;
  complete: boolean;
}
