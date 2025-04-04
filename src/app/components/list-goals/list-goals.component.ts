import { Component, OnInit, signal, Signal, inject, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Goals } from '../../models/goals';
import { CommonModule } from '@angular/common';
import { FilterData, FilterParam } from '../../models/filterData';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { pagination } from '../../customConfig';
import { GoalService } from '../../services/goal.service';
import { PaginatorComponent } from '../paginator/paginator.component';
@Component({
  selector: 'app-list-goals',
  // modulo para los formularios reactivos.
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PaginatorComponent],
  templateUrl: './list-goals.component.html',
  styleUrl: './list-goals.component.css'
})

export class ListGoalsComponent implements OnInit {


  searchForm: FormGroup;
  searchType: string;
  searchValue: FormControl;
  goalsList = signal<Goals[]>([]);
  filter: WritableSignal<FilterData<FilterParam>>;
  // router: RouterLink = inject(RouterLink);

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
      valueSearch: ['']
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
    this.service.getPaginatedDetails(this.filter())
      .subscribe({
        next: (data: FilterData<Goals[]>) => {
          this.filter.update((f)=>{
              return {
                currentPage: data.currentPage,
                pages: data.pages,
                pageSize: data.pageSize,
                totalRecords: data.totalRecords,
                data: f.data
              }
          });
          if(data.data === null || data.data === undefined || data.data.length <= 0){
            this.goalsList.set([]);
          }
          else
          {
            this.goalsList.set(data.data);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  CreateSearchForm(): void {
    this.searchForm = this.builder.group({
      typeSearch: [''],
      valueSearch: ['']
    });
  }

  searchGoal() {
    console.log(this.searchType);
    console.log(this.searchValue.value);
    console.log(this.searchForm.controls);
  }

  selectSearchType(search: string): void {
    this.searchType = search;
    this.searchValue.setValue('');
  }

  editName(): void {

  }

  redirectDeatil(listId: number) {
    this.router.navigate(['goal-datails', listId]);
  }

  changeSelection($event: Event) {
    console.log({ 'changeState': event });
    this.loadListGoals();
  }

  addNewList() {
    const newGoal: Goals = {
      id: 0,
      name: ''
    };
    this.service.addGoal(newGoal).subscribe(
      {
        next: (data: Goals) => {

        },
        error: (err) => {
          console.log(err);
      }
    });
  }




}
