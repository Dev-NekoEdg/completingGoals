import { Component, EventEmitter, Input, OnInit, Output, Signal, signal, SimpleChanges, WritableSignal } from '@angular/core';

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
  currentSize = signal(0);
  selectedPage = signal<number>(1);
  pages = signal<number[]>([]);

  defaultFilter: FilterData<any> = {
    currentPage: 0,
    pages: 0,
    pageSize: 0,
    totalRecords: 0,
    data: null
  };

  // @Input({ required: true }) quantityPages!: Signal<number>;
  @Input({ required: true }) quantityPages!: number;
  @Output() updateObjects = new EventEmitter();

  ngOnInit(): void {
    console.log('oninit paginator');
    this.loadPages();
  }

  ngAfterViewInit() {
    this.currentSize.set(pagination.defaultSize);
  }

  ngOnChanges(changes: SimpleChanges){
    console.log('paginator - onChanges');
    console.log(changes);

    this.loadPages();
  }

  loadPages() {
    const x: number[] = Array.from({ length: this.quantityPages }, (value, index) => index + 1);
    console.log({ 'pages': x });
    this.pages.set(x);
  }

  changeCurrentPage(page: number) {
    this.selectedPage.set(page);
    console.log('selectedPage = ' + this.selectedPage());
    const pagenator: PaginatorEmit = {
      currentPage: this.selectedPage(),
      pageSize: this.currentSize()
    };
    this.updateObjects.emit(pagenator);
  }

  changeCurrentPageByArrowButtons(action: string) {
    this.selectedPage.update(p => {
      if(action === '-' && p  > 1 ){
        return p--;
      }else{
        return p++;
      }
    });
    console.log('changeCurrentPageByArrowButtons');
    console.log('selectedPage = ' + this.selectedPage());
    const pagenator: PaginatorEmit = {
      currentPage: this.selectedPage(),
      pageSize: this.currentSize()
    };
    this.updateObjects.emit(pagenator);
  }


  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.currentSize.set(+target.value);
    const pagenator: PaginatorEmit = {
      currentPage: this.selectedPage(),
      pageSize: this.currentSize()
    };
    this.updateObjects.emit(pagenator);
  }

}
