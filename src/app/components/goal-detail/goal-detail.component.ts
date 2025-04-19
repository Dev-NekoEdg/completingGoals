import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalDetailsService } from '../../services/goal-details.service';
import {
  FilterData,
  FilterParam,
  PaginatorEmit,
} from '../../models/filterData';
import { imageDefault, pagination } from '../../customConfig';
import { GoalDetail } from '../../models/goal-detail';
import { PaginatorComponent } from '../paginator/paginator.component';
import { EditGoalDetailComponent } from '../edit-goal-detail/edit-goal-detail.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponseDefault } from '../../models/response-default';

@Component({
  selector: 'app-goal-detail',
  imports: [FormsModule, EditGoalDetailComponent, PaginatorComponent],
  templateUrl: './goal-detail.component.html',
  styleUrl: './goal-detail.component.css',
})
export class GoalDetailComponent implements OnInit {
  listId: number;
  listName: string;
  router: ActivatedRoute;
  filter: WritableSignal<FilterData<FilterParam>>;
  searchType: WritableSignal<string> = signal('Nombre');
  searchValue: WritableSignal<string> = signal('');

  selectedGoalDetail = signal<number>(0);
  // Estado derivado
  public goalDetailsActived = computed(() => {
    const id = this.selectedGoalDetail();
    if (id > 0) {
      return true;
    }
    return false;
  });

  public pages = signal<number>(0);

  // Modal editing
  @ViewChild(EditGoalDetailComponent) modal?: EditGoalDetailComponent;
  public goalDetails = signal<GoalDetail[]>([]);

  constructor(private service: GoalDetailsService) {
    this.listId = 0;
    this.listName = '';
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
    // this.pages.set(this.filter().pageSize);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('goalDetails - onChanges');
    console.log(changes);
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
            data: f.data,
          };
        });
        this.pages.set(data.pages);

        if (
          data.data === null ||
          data.data === undefined ||
          data.data.length <= 0
        ) {
          this.goalDetails.set([]);
        } else {
          data.data.map((detail) => {
            if (detail.imageUrl === '' || detail.imageUrl === null) {
              detail.imageUrl = imageDefault.imageNotFound;
            }
          });
          this.goalDetails.set(data.data);
          this.listName = this.goalDetails()[0].listName ?? '';
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    console.log({ pages: this.pages() });
  }

  // Edit Goal

  addNewItem() {
    this.modal?.loadNewDetails(this.listId, this.listName);
    this.modal?.openModal();
  }

  changeSelectedGoalDetail(id: number): void {
    this.selectedGoalDetail.set(id);
    console.log({ selectedGoalDetail: this.selectedGoalDetail() });
    this.modal?.loadDetails(this.listId, this.selectedGoalDetail());
    this.modal?.openModal();
  }

  completeGoal(detail: GoalDetail) {
    detail.complete = true;
    this.service.updateGoalDetail(detail).subscribe({
      next: (data: GoalDetail) => {
        console.log({ updatedObject: data });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  changeState(event: Event) {
    console.log({ changeState: event });
    this.loadGoals(this.listId);
  }

  selectSearchType(param: string) {
    this.searchType.set(param);
  }

  searchGoalItems() {
    let param: FilterParam | null = {
      field: this.searchType(),
      value: this.searchValue(),
    };

    if(this.searchValue() === '' 
      || this.searchValue() === null 
      || this.searchValue() === undefined
    ){
      param = null;
    }

    this.filter.update((f) => {
      return { ...f, data: param };
    });

    this.loadGoals(this.listId);
  }

  deleteGoal(detail: GoalDetail) {
    var response = confirm('are you sure?');
    if (response) {
      this.service.deleteGoalDetail(detail).subscribe({
        next: (data: ResponseDefault<boolean>) => {
          if (data.result) {
            this.loadGoals(detail.listId);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  // Paginator
  changeSelection(event: PaginatorEmit) {
    this.filter.update((f) => {
      return {
        ...f,
        currentPage: event.currentPage,
        pageSize: event.pageSize,
        data: null,
      };
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
            data: f.data,
          };
        });

        if (
          data.data === null ||
          data.data === undefined ||
          data.data.length <= 0
        ) {
          this.goalDetails.set([]);
        } else {
          data.data.map((detail) => {
            if (detail.imageUrl === '' || detail.imageUrl === null) {
              detail.imageUrl = imageDefault.imageNotFound;
            }
          });
          this.goalDetails.set(data.data);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    console.log({ pages: this.pages() });
  }
}
