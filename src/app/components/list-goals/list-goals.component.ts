import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
@Component({
  selector: 'app-list-goals',
  // modulo para los formularios reactivos.
  imports: [],
  templateUrl: './list-goals.component.html',
  styleUrl: './list-goals.component.css'
})

export class ListGoalsComponent implements OnInit{

  searchForm: FormGroup;
  searchType: string;
  searchValue: string;

  constructor(private builder: FormBuilder){
    this.searchType = 'Nombre';
    this.searchValue = '';
    this.searchForm = this.builder.group({
      typeSearch: [''],
      valueSearch: ['']
    });

  }

  ngOnInit(): void {
  }

  CreateSearchForm(): void {
    this.searchForm = this.builder.group({
      typeSearch: [''],
      valueSearch: ['']
    });
  }

  searchGoal(){

    console.log(this.searchType);
    console.log(this.searchValue);

    console.log(this.searchForm.controls);

  }

  selectSearchType(search: string):void{
    this.searchType = search;
  }


}
