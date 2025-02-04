import { Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';

import { FilterData } from '../../models/filterData'
import { pagination } from '../../customConfig';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit {

  selectPageSizes = signal<number[]>(pagination.sizes);
  currentSize = signal(pagination.defaultSize);
  pages = signal<number[]>([]);

  defaultFilter: FilterData<any> = {
    currentPage: 0,
    pages: 0,
    pageSize: 0,
    totalRecords: 0,
    data: null
  };

  @Input({required:true}) quantityPages!: number;
  @Output() updateObjects = new EventEmitter();

  ngOnInit(): void {
    console.log('oninit paginator');
    this.loadPages();
  }

  loadPages() {

    const x: number[] = Array.from({ length: this.quantityPages }, (value, index) => index + 1);
    console.log({ 'pages': x });
    this.pages.set(x);
  }

  changeCurrentPage(page: number) {

    this.currentSize.set(page);
  }


}
