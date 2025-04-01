import { inject, Injectable } from '@angular/core';
import { Goals } from '../models/goals';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { endpoints } from '../customConfig';
@Injectable({
  providedIn: 'root'
})
export class GoalService {


  private lists: Goals[] = [];
  private baseUrl: string = endpoints.baseUrl;
  private routeEndpoint: string = endpoints.list;
  private http: HttpClient = inject(HttpClient);

  constructor() {
  }

  getAllGoals(): Observable<Goals[]> {
    return this.http.get<Goals[]>(this.baseUrl + this.routeEndpoint);
    // const list$ = of(this.lists)
    // return list$;
  }
}
