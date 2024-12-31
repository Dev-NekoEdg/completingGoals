import { Component, OnInit, signal, Signal } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
@Component({
  selector: 'app-list-goals',
  // modulo para los formularios reactivos.
  imports: [ReactiveFormsModule],
  templateUrl: './list-goals.component.html',
  styleUrl: './list-goals.component.css'
})

export class ListGoalsComponent implements OnInit{

  searchForm: FormGroup;
  searchType: string;
  searchValue: FormControl;

  constructor(private builder: FormBuilder){
    this.searchType = 'Nombre';
    this.searchValue = new FormControl('');

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
    console.log(this.searchValue.value);

    console.log(this.searchForm.controls);

  }

  selectSearchType(search: string):void{
    this.searchType = search;
  }


}
