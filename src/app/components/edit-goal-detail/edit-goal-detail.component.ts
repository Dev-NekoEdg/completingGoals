import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { GoalDetail } from '../../models/goal-detail';
import { GoalDetailsService } from '../../services/goal-details.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { imageDefault } from '../../customConfig';
import { ResponseDefault } from '../../models/response-default';
// @ts-ignore
const $: any = window['$'];
@Component({
  selector: 'app-edit-goal-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-goal-detail.component.html',
  styleUrl: './edit-goal-detail.component.css',
})
export class EditGoalDetailComponent implements OnInit {
  goalDetail = signal<GoalDetail>({
    id: 0,
    name: '',
    description: '',
    listId: 0,
    imageUrl: '',
    complete: false,
  });

  public listId: number;
  public goalDetailId: number;
  public isNewRegister: boolean;
  public myForm: FormGroup;
  public uploadFile: File | null = null;

  @Output() updateObjects = new EventEmitter();

  @ViewChild('testModal') modal?: ElementRef;

  constructor(
    private service: GoalDetailsService,
    private builder: FormBuilder
  ) {
    this.listId = 0;
    this.goalDetailId = 0;
    this.isNewRegister = false;
    this.myForm = this.createFrom();
  }

  ngOnInit(): void {
    if (this.listId !== 0 && this.goalDetailId !== 0) {
      this.goalDetail();
    }
  }

  ngOnChanges() {
    console.log('ngAfterViewInit');
    this.goalDetail();
  }

public getterName(){
  return this.myForm.controls['name']?.touched && 
  this.myForm.controls['name']?.invalid;
}

public getterDescription(){
  return this.myForm.controls['description']?.touched 
  && this.myForm.controls['description']?.invalid;
}


  public loadDetails(listId: number, detailId: number) {
    this.isNewRegister = false;
    this.service.getGoalDetail(listId, detailId).subscribe({
      next: (data: GoalDetail) => {
        this.goalDetail.update(() => {
          return {
            id: data.id,
            name: data.name,
            description: data.description,
            listId: data.listId,
            imageUrl: data.imageUrl,
            complete: data.complete,
            listName: data.listName,
          };
        });

        console.log(this.goalDetail());
        this.loadForm();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public loadNewDetails(listId: number, listName: string) {
    this.isNewRegister = true;
    this.goalDetail.set({
      id: 0,
      name: '',
      description: '',
      listId: listId,
      imageUrl: 'assets/ai_newRegister.png',
      complete: false,
      listName: listName,
    });
    this.loadForm();
  }

  public openModal(): void {
    $(this.modal?.nativeElement).modal('show');
  }

  public closeModal(): void {
    $(this.modal?.nativeElement).modal('hide');
  }

  saveChanges() {
    if(this.myForm.valid){
      if (this.isNewRegister) {
        this.saveNewChanges();
      } else {
        this.updateChanges();
      }
    }
  }

  private updateChanges() {
    const name: string = this.myForm.get('name')?.value;
    const description: string = this.myForm.get('description')?.value;
    const completed: boolean = this.myForm.get('completed')?.value;
    console.log({ completed: this.myForm.get('completed')?.value });
    this.goalDetail.update((goal) => ({
      ...goal,
      name: name,
      description: description,
      complete: completed,
    }));
    console.log(this.goalDetail());

    this.service.updateGoalDetail(this.goalDetail()).subscribe({
      next: (data: GoalDetail) => {
        this.goalDetail.set(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.updateObjects.emit('update item');
    this.loadDetails(this.listId, this.goalDetailId);
    this.closeModal();
  }

  private saveNewChanges() {
    const name: string = this.myForm.get('name')?.value;
    const description: string = this.myForm.get('description')?.value;
    const completed: boolean = this.myForm.get('completed')?.value;

    this.goalDetail.update((goal) => ({
      ...goal,
      name: name,
      description: description,
      imageUrl: imageDefault.imageNotFound_BlobStorage,
      complete: completed,
    }));
    this.service.saveGoalDetail(this.goalDetail()).subscribe({
      next: (data: GoalDetail) => {
        console.log('objeto result de daveGoal');
        console.log({data});
        this.goalDetail.set(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.updateObjects.emit('Save item');
    this.goalDetailId = this.goalDetail().id;
    this.loadDetails(this.listId, this.goalDetailId);
    this.isNewRegister = false;
  }

  private createFrom(): FormGroup {
    return this.builder.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.required, Validators.minLength(1)]],
      imgFile: [],
      completed: [false],
    });
  }

  private loadForm() {
    this.myForm.get('name')?.setValue(this.goalDetail().name);
    this.myForm.get('description')?.setValue(this.goalDetail().description);
    this.myForm.get('completed')?.setValue(this.goalDetail().complete);
  }

  public handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.uploadFile = files.item(0);
    }
  }

  public updateImageOnly() {
    if (!this.uploadFile) {
      alert('Choose a file to upload first');
      return;
    }

    const formData = new FormData();
    // primer parametro es el nombre del parametro en el API.
    formData.append('image', this.uploadFile, this.uploadFile.name);

    console.log({ uploadFile: this.uploadFile });
    this.service
      .uploadGoalDetailImage(
        this.goalDetail().listId,
        this.goalDetail().id,
        formData
      )
      .subscribe({
        next: (data: ResponseDefault<string>) => {
          console.log({ data });
          this.goalDetail.update((goal) => {
            return { ...goal, imageUrl: data.result };
          });

          console.log('aftetupdate signal');
          console.log(this.goalDetail());
        },
        error: (err) => {
          console.log('Error from uploadGoalDetailImage:');
          console.log(err);
        },
      });
    // setInterval(() => {
    //   this.goalDetail.update((goal) => {
    //     const data: string =
    //       'https://storedatanekoedg.blob.core.windows.net/public-container/List-1/nekoedg_UnderMaintenance.png';
    //     return { ...goal, imageUrl: data };
    //   });
    //   console.log('aftetupdate signal');
    //   console.log(this.goalDetail());
    // }, 1500);
  }
}
