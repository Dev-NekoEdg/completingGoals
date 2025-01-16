import { Component, ViewChild } from '@angular/core';
import { EditGoalDetailComponent } from "../edit-goal-detail/edit-goal-detail.component";

@Component({
  selector: 'app-home',
  imports: [EditGoalDetailComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

@ViewChild(EditGoalDetailComponent) modal?: EditGoalDetailComponent;

open(){
  this.modal?.loadDetails(2, 18);
  this.modal?.openModal();
}

}
