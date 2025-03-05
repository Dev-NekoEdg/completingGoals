import { Component, computed, inject, OnInit, signal, SimpleChanges, ViewChild, viewChild, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalDetailsService } from '../../services/goal-details.service';
import { FilterData, FilterParam, PaginatorEmit } from '../../models/filterData';
import { imageDefault, pagination } from '../../customConfig';
import { GoalDetail } from '../../models/goal-detail';
import { PaginatorComponent } from '../paginator/paginator.component';
import { EditGoalDetailComponent } from "../edit-goal-detail/edit-goal-detail.component";



@Component({
  selector: 'app-goal-detail',
  imports: [EditGoalDetailComponent, PaginatorComponent],
  templateUrl: './goal-detail.component.html',
  styleUrl: './goal-detail.component.css'
})
export class GoalDetailComponent implements OnInit {

  public goalDetails = signal<GoalDetail[]>([]);

  pages = signal<number>(0);

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
    this.pages.set(this.filter().pageSize);
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

  completeGoal(detail: GoalDetail) {
    detail.complete = true;
    this.service.updateGoalDetail(detail).subscribe({
      next: (data: GoalDetail) => {
        console.log({ 'updatedObject': data });
      },
      error: (error) => {
        console.log(error);
      }
    });

  }



  changeState(event: Event) {
    console.log({ 'changeState': event });
    this.loadGoals(this.listId);
  }

  // Paginator
  changeSelection(event: PaginatorEmit) {
    this.filter.update((f) => {
      return {
        ...f,
        currentPage: event.currentPage,
        pageSize: event.pageSize,
        data: null
      }
    });
    // console.log('changeSelection: ' + this.listId);
    // console.log({'filter': this.filter()});
    this.service.getPaginatedDetails(this.listId, this.filter()).subscribe({
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

}
