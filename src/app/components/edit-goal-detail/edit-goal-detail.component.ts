import { Component, ElementRef, Input, OnInit, Output, signal, ViewChild, viewChild } from '@angular/core';
import { GoalDetail } from '../../models/goal-detail';
import { GoalDetailsService } from '../../services/goal-details.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// @ts-ignore
const $: any = window['$'];
@Component({
  selector: 'app-edit-goal-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-goal-detail.component.html',
  styleUrl: './edit-goal-detail.component.css'
})
export class EditGoalDetailComponent implements OnInit {

  goalDetail = signal<GoalDetail>({ id: 0, name: '', description: '', listId: 0, imageUrl: '', completed: false });
  public goalId: number;
  public goalDetailId: number;
  // @Input() goalId: number = 0;
  // @Input() goalDetailId: number = 0;
  public myForm: FormGroup;
  public uploadFile: File | null = null;

  @ViewChild('testModal') modal?: ElementRef;

  constructor(private service: GoalDetailsService,
    private builder: FormBuilder
  ) {
    this.goalId = 0;
    this.goalDetailId = 0;
    this.myForm = this.createFrom();
  }


  ngOnInit(): void {

    if (this.goalId !== 0 && this.goalDetailId !== 0) {
      this.goalDetail();
    }

  }

  public loadDetails(listId: number, detailId: number) {
    // this.service.getGoalDetail(this.goalId, this.goalDetailId)
    this.service.getGoalDetail(listId, detailId)
      .subscribe({
        next: (data: GoalDetail) => {
          this.goalDetail.update(() => {
            return {
              id: data.id,
              name: data.name,
              description: data.description,
              listId: data.listId,
              imageUrl: data.imageUrl,
              completed: data.completed,
              listName: data.listName
            }
          });

          console.log(this.goalDetail());
          this.loadForm();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  public openModal(): void {
    $(this.modal?.nativeElement).modal('show');
  }


  public closeModal(): void {
    $(this.modal?.nativeElement).modal('hide');
  }

  private saveChanges() {

  }

  private createFrom():FormGroup {
    return this.builder.group({
      name: ['', Validators.required],
      description: [''],
      imgFile: [],
      completed: [false],
    });
  }

  private loadForm(){
    this.myForm.get('name')?.setValue(this.goalDetail().name);
    this.myForm.get('description')?.setValue(this.goalDetail().description);
    // this.myForm.get('name')?.setValue(this.goalDetail().);
    this.myForm.get('completed')?.setValue(this.goalDetail().completed);
  }


  public handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.uploadFile = files.item(0);
    }
  }

  public updateImageOnly(){

    if (!this.uploadFile) {
      alert('Choose a file to upload first');
      return;
    }

    const formData = new FormData();
    formData.append(this.uploadFile.name, this.uploadFile);

    console.log({'uploadFile':this.uploadFile});

  }

}
