import {
  Component,
  OnInit,
  signal,
  Signal,
  inject,
  WritableSignal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Goals } from '../../models/goals';
import { CommonModule } from '@angular/common';
import { FilterData, FilterParam } from '../../models/filterData';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { pagination } from '../../customConfig';
import { GoalService } from '../../services/goal.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { EditListGoalComponent } from '../edit-list-goal/edit-list-goal.component';

@Component({
  selector: 'app-list-goals',
  // modulo para los formularios reactivos.
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    EditListGoalComponent,
    PaginatorComponent,
  ],
  templateUrl: './list-goals.component.html',
  styleUrl: './list-goals.component.css',
})
export class ListGoalsComponent implements OnInit {
  searchForm: FormGroup;
  searchType: string;
  searchValue: FormControl;
  goalsList = signal<Goals[]>([]);
  // selectedGoal: Goals = { id: 0, name: '' };
  selectedGoal = signal<Goals>({ id: 0, name: '' });
  filter: WritableSignal<FilterData<FilterParam>>;
  // router: RouterLink = inject(RouterLink);

  // Modal editing
  @ViewChild(EditListGoalComponent) modal?: EditListGoalComponent;

  constructor(
    private builder: FormBuilder,
    private service: GoalService,
    private router: Router
  ) {
    this.searchType = 'Nombre';
    this.searchValue = new FormControl('');
    this.filter = signal({
      currentPage: 1,
      pageSize: pagination.defaultSize,
      totalRecords: 0,
      pages: 0,
      data: null,
    });

    this.searchForm = this.builder.group({
      typeSearch: [''],
      valueSearch: [''],
    });
  }

  ngOnInit(): void {
    // this.service.getAllGoals().subscribe({
    //   next: (data: Goals[]) => {
    //     console.log({ data });
    //     this.goalsList.set(data);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    // });
    this.loadListGoals();
  }

  loadListGoals() {
    this.service.getPaginatedDetails(this.filter()).subscribe({
      next: (data: FilterData<Goals[]>) => {
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
          this.goalsList.set([]);
        } else {
          this.goalsList.set(data.data);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  CreateSearchForm(): void {
    this.searchForm = this.builder.group({
      typeSearch: [''],
      valueSearch: [''],
    });
  }

  searchGoal() {
    console.log(this.searchType);
    console.log(this.searchValue.value);
    console.log(this.searchValue.value.length <= 0);
    this.filter.update((f) => {
      let innerFilter: FilterParam | null = null;

      if (this.searchValue.value !== '' ) {
        innerFilter = { field: this.searchType, value: this.searchValue.value };
      }

      return {
        currentPage: 1,
        pageSize: pagination.defaultSize,
        pages: 0,
        totalRecords: 0,
        data: innerFilter,
      };
    });
    console.log('filtro actualizado');
    console.log(this.filter());

    this.loadListGoals();
  }

  selectSearchType(search: string): void {
    this.searchType = search;
    this.searchValue.setValue('');
  }

  editName(listgoal: Goals): void {
    this.selectedGoal.set(listgoal);
    //this.modal?.newName.set(listgoal.name);
    this.modal?.listGoal.set(listgoal);
    this.modal?.newName.set(listgoal.name);
    this.modal?.openModal();
  }

  redirectDeatil(listId: number) {
    this.router.navigate(['goal-datails', listId]);
  }

  changeSelection($event: Event) {
    console.log({ changeState: event });
    this.loadListGoals();
  }

  addNewList() {
    const newGoal: Goals = {
      id: 0,
      name: '',
    };
    this.modal?.listGoal.set(newGoal);
    this.modal?.openModal();
    // this.service.addGoal(newGoal).subscribe(
    //   {
    //     next: (data: Goals) => {

    //     },
    //     error: (err) => {
    //       console.log(err);
    //   }
    // });
  }

  validateUpdate(event: string) {
    if (event === 'OK') {
      this.loadListGoals();
    } else {
      //mostrar error;
    }
  }
}
