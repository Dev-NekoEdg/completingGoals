import { Component, computed, inject, OnInit, signal, SimpleChanges, ViewChild, viewChild, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalDetailsService } from '../../services/goal-details.service';
import { FilterData, FilterParam } from '../../models/filterData';
import { imageDefault, pagination } from '../../customConfig';
import { GoalDetail } from '../../models/goal-detail';
import { PaginatorComponent } from '../paginator/paginator.component';
import { EditGoalDetailComponent } from "../edit-goal-detail/edit-goal-detail.component";



@Component({
  selector: 'app-goal-detail',
  imports: [EditGoalDetailComponent],
  templateUrl: './goal-detail.component.html',
  styleUrl: './goal-detail.component.css'
})
export class GoalDetailComponent implements OnInit {

  public goalDetails = signal<GoalDetail[]>([]);

  listId: number;
  router: ActivatedRoute;
  filter: WritableSignal<FilterData<FilterParam>>;

  selectedGoalDetail = signal<number>(0);
  // Estado derivado
  public goalDetailsActived = computed(() => {
    const id = this.selectedGoalDetail();
    if (id > 0) {
      return true;
    }
    return false;
  });

  public pages = computed(() => {
    const pages = this.filter().pages
    if (pages >= 0) {
      //const x:number[] = new Array(pages);
      const x: number[] = Array.from({ length: pages }, (value, index) => index + 1);
      console.log({ 'pages': x });
      return x;
    }
    return [];
  });

  // paginator
  selectPageSizes = signal<number[]>(pagination.sizes);
  currentSize = signal<number>(pagination.defaultSize);
  currentPage = signal<number>(1);

  // Modal editing
  @ViewChild(EditGoalDetailComponent) modal?: EditGoalDetailComponent;

  constructor(private service: GoalDetailsService) {
    this.listId = 0;
    this.router = inject(ActivatedRoute);
    this.filter = signal({
      currentPage: 1,
      pageSize: pagination.defaultSize,
      totalRecords: 0,
      pages: 0,
      data: null,
    });
  }

  ngOnInit(): void {
    this.listId = this.router.snapshot.params['listId'];
    this.loadGoals(+this.listId);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    console.log('-'.repeat(10));
  }

  loadGoals(listId: number) {

    this.service.getPaginatedDetails(listId, this.filter()).subscribe({
      next: (data: FilterData<GoalDetail[]>) => {
        console.log({ data });

        this.filter.update((f) => {
          return {
            currentPage: data.currentPage,
            pages: data.pages,
            pageSize: data.pageSize,
            totalRecords: data.totalRecords,
            data: f.data
          }
        });

        if (data.data === null || data.data === undefined || data.data.length <= 0) {
          this.goalDetails.set([]);
        } else {
          data.data.map((detail) => {
            if (detail.imageUrl === '' || detail.imageUrl === null) {
              detail.imageUrl = imageDefault.imageNotFound;
            }
          })
          this.goalDetails.set(data.data);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  changeSelectedGoalDetail(id: number): void {

    this.selectedGoalDetail.set(id);
    console.log({ 'selectedGoalDetail': this.selectedGoalDetail() });
    // $(this.modal?.nativeElement).modal('show');
    this.modal?.loadDetails(this.listId, this.selectedGoalDetail());
    this.modal?.openModal();
  }

  changeState(event: Event) {
    console.log({ 'changeState': event });
    this.loadGoals(this.listId);
  }

  // Paginator
  changeCurrentPage(page: number) {
    this.currentPage.set(page);
    console.log(this.currentPage());
  }
  changeSelection() {
    console.log(this.currentSize());

  }

}
