import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Goals } from '../models/goals';
import { Observable, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalsListServicesService {

  private lists: Goals[] = [];
  private baseurl: string = 'https://localhost:7164/api/Lists';
  private http: HttpClient = inject(HttpClient);

  constructor() {
  }

  getAllGoals(): Observable<Goals[]> {
    return this.http.get<Goals[]>(this.baseurl);
    // const list$ = of(this.lists)
    // return list$;
  }

  localTasks() {
    this.lists = [
      // { Id: 1, Name: 'heroes' },
      // { Id: 2, Name: 'heroes 2' },
      // { Id: 3, Name: 'heroes 3' },
      // { Id: 5, Name: 'heroes 5' },
      // { Id: 6, Name: 'heroes 6' },
      // { Id: 7, Name: 'heroes 7' },
      // { Id: 8, Name: 'heroes 8' },
      // { Id: 9, Name: 'heroes 9' },
      // { Id: 11, Name: 'heroes 11' },
      // { Id: 12, Name: 'heroes 12' },
      // { Id: 13, Name: 'heroes 13' },
      // { Id: 14, Name: 'heroes 14' },
      // { Id: 15, Name: 'heroes 15' },
      // { Id: 25, Name: 'heroes 25' },
      // { Id: 24, Name: 'heroes 24' },
      // { Id: 22, Name: 'heroes 22' },
      // { Id: 21, Name: 'heroes 21' },
      // { Id: 26, Name: 'heroes 26' },
      // { Id: 31, Name: 'heroes 31' },
      // { Id: 33, Name: 'heroes 33' },
    ];
  }

}
