import { Component, ViewChild } from '@angular/core';
import { ModalHomeComponent } from '../modal-home/modal-home.component';



@Component({
  selector: 'app-home',
  imports: [ModalHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


@ViewChild(ModalHomeComponent) modal?: ModalHomeComponent;

open(){
  this.modal?.openModal();
}


}
