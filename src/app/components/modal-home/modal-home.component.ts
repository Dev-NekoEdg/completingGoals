import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
// @ts-ignore
const $: any = window['$'];


@Component({
  selector: 'app-modal-home',
  imports: [],
  templateUrl: './modal-home.component.html',
  styleUrl: './modal-home.component.css'
})
export class ModalHomeComponent {

@ViewChild('homeModal') modal?: ElementRef;
@Output() updateObjects = new EventEmitter();

public openModal(): void {
  $(this.modal?.nativeElement).modal('show');
}

public closeModal(): void {
  $(this.modal?.nativeElement).modal('hide');
}



}
