import { Component, ElementRef, Input, signal, ViewChild, WritableSignal } from '@angular/core';
import { Goals } from '../../models/goals';

// @ts-ignore
const $: any = window['$'];
@Component({
  selector: 'app-edit-list-goal',
  imports: [],
  templateUrl: './edit-list-goal.component.html',
  styleUrl: './edit-list-goal.component.css'
})
export class EditListGoalComponent {

  @ViewChild('testModal') modal?: ElementRef;
  @Input() listGoal?: Goals;

  newName: WritableSignal<string> = signal('');

constructor() {
  if(this.listGoal?.name === null || this.listGoal?.name === undefined){
    this.newName.set('');
  }
  else{
    this.newName.set(this.listGoal?.name );
  }
}

public openModal(): void {
  $(this.modal?.nativeElement).modal('show');
}

public closeModal(): void {
  $(this.modal?.nativeElement).modal('hide');
}

saveChanges(){

}

}
