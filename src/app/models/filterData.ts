
export interface FilterData<T> {
  currentPage: number;
  pageSize: number;
  pages:number;
  totalRecords: number;

  data: T | null;
}

export interface FilterParam{
  field:string;
  value:string;
}

export interface PaginatorEmit{
  currentPage: number;
  pageSize: number;
}
