import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';

import { FilterData } from '../../models/filterData'
import { pagination } from '../../customConfig';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit {

  pages: WritableSignal<number[]> = signal([]);
  selectPageSizes = signal<number[]>(pagination.sizes);
  currentSize: WritableSignal<number> = signal(pagination.defaultSize);

  defaultFilter: FilterData<any> = {
    currentPage: 0,
    pages: 0,
    pageSize: 0,
    totalRecords: 0,
    data: null
  };

  @Input() filter: WritableSignal<FilterData<any>> = signal(this.defaultFilter);

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages() {
console.log({'filter-pages':this.filter().pages});
this.pages.set(new Array(this.filter().pages));
console.log({'pages':this.pages()});

  }
  changeCurrentPage(page: number) {
    this.currentSize.set(page);

  }


}
