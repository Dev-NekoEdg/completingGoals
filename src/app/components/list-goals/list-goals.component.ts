import { Component, OnInit, signal, Signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { GoalsListServicesService } from '../../services/goals-list-services.service';
import { Goals } from '../../models/goals';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../models/pagination';
@Component({
  selector: 'app-list-goals',
  // modulo para los formularios reactivos.
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-goals.component.html',
  styleUrl: './list-goals.component.css'
})

export class ListGoalsComponent implements OnInit {

  searchForm: FormGroup;
  searchType: string;
  searchValue: FormControl;
  goalsList= signal<Goals[]>([]);
  pagination: Pagination;

  constructor(private builder: FormBuilder,
    private service: GoalsListServicesService
  ) {
    this.searchType = 'Nombre';
    this.searchValue = new FormControl('');
    this.pagination = {
      currentPage: 1,
      selectedRows: 1,
      totalRecords: 0,
      pages: [],
      rowsPerPages: [],
    };

    this.searchForm = this.builder.group({
      typeSearch: [''],
      valueSearch: ['']
    });

  }

  ngOnInit(): void {
    this.service.getAllGoals().subscribe({
      next: (data: Goals[]) =>{
        console.log({data});
        this.goalsList.set(data);
      },
      error: (err)=>{
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


}
