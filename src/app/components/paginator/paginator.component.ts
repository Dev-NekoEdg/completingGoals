import { Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';

import { FilterData, PaginatorEmit } from '../../models/filterData'
import { pagination } from '../../customConfig';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit {

  selectPageSizes = signal<number[]>(pagination.sizes);
  currentSize = signal(pagination.defaultSize);
  selectedPage = signal<number>(0);
  pages = signal<number[]>([]);

  defaultFilter: FilterData<any> = {
    currentPage: 0,
    pages: 0,
    pageSize: 0,
    totalRecords: 0,
    data: null
  };

  @Input({required:true}) quantityPages!: WritableSignal<number>;
  @Output() updateObjects = new EventEmitter();

  ngOnInit(): void {
    console.log('oninit paginator');
    this.loadPages();
  }

  loadPages() {

    const x: number[] = Array.from({ length: this.quantityPages() }, (value, index) => index + 1);
    console.log({ 'pages': x });
    this.pages.set(x);
  }

  changeCurrentPage(page: number) {
    this.selectedPage.set(page);
    console.log('selectedPage = ' + this.selectedPage());
    const pagenator:PaginatorEmit = {
      currentPage : this.selectedPage(),
      pageSize: this.currentSize()
    };
    this.updateObjects.emit(pagenator);
  }

  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.currentSize.set(+target.value);
    const pagenator:PaginatorEmit = {
      currentPage : this.selectedPage(),
      pageSize: this.currentSize()
    };
    this.updateObjects.emit(pagenator);
  }

}
