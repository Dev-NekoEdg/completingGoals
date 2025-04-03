import { inject, Injectable } from '@angular/core';
import { Goals } from '../models/goals';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { endpoints } from '../customConfig';
import { FilterData, FilterParam } from '../models/filterData';
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

  getPaginatedDetails(filter: FilterData<FilterParam>)
    : Observable<FilterData<Goals[]>> {
    const url: string = `${endpoints.baseUrl}${endpoints.list}/filter`;
    return this.http.post<FilterData<Goals[]>>(url, filter);
  }

  addGoal(newGoal: Goals): Observable<Goals> {
    const url: string = `${endpoints.baseUrl}${endpoints.list}`
    return this.http.post<Goals>(url, newGoal);
  }
}
