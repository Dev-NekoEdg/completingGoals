const rows = [0, 5, 10, 20]
export interface Pagination {
  totalRecords: number;
  currentPage: number;
  selectedRows: number;

  rowsPerPages: number[];
  pages: number[];
}

