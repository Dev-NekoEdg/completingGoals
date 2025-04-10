import { Component, ElementRef, EventEmitter, Output, signal, ViewChild, WritableSignal, model } from '@angular/core';
import { Goals } from '../../models/goals';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { CommonModule } from '@angular/common';
// @ts-ignore
const $: any = window['$'];

@Component({
  selector: 'app-edit-list-goal',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-list-goal.component.html',
  styleUrl: './edit-list-goal.component.css'
})
export class EditListGoalComponent {

  @ViewChild('editListModal') modal?: ElementRef;
  @Output() updateObjects = new EventEmitter();

  listGoal: WritableSignal<Goals> = signal({id:0, name:''});
  // newName:string = '';
  newName : WritableSignal<string> = signal(this.listGoal().name);

  constructor(private service: GoalService) {
  }

  onInit(){
    this.newName.set(this.listGoal?.name);
  }

  public openModal(): void {
    
    $(this.modal?.nativeElement).modal('show');
  }

  public closeModal(): void {
    $(this.modal?.nativeElement).modal('hide');
  }

  saveChanges() {
    const newGoal: Goals = {
      id: this.listGoal().id,
      name: this.newName()
    }
    this.service.updateGoal(newGoal).subscribe(
      {
        next: (data: Goals) => {
          this.updateObjects.emit('OK');
          this.closeModal();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

}
