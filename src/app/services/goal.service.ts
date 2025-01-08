import { inject, Injectable } from '@angular/core';
import { Goals } from '../models/goals';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {


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
}
