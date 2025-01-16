import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FilterData, FilterParam } from '../models/filterData';

import { endpoints } from '../customConfig'
import { GoalDetail } from '../models/goal-detail';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalDetailsService {

  constructor(private http: HttpClient) {
    this.http = inject(HttpClient);

  }

  getPaginatedDetails(listId: number, filter: FilterData<FilterParam>)
  :Observable<FilterData<GoalDetail[]>> {
    const url: string = `${endpoints.baseUrl}${endpoints.listDetails}${listId}/filter`;
    console.log({ url });
    return this.http.post<FilterData<GoalDetail[]>>(url, filter);
  }

  getGoalDetail(listId: number, id: number): Observable<GoalDetail>{
    const url: string = `${endpoints.baseUrl}${endpoints.listDetails}${listId}/${id}`;
    return this.http.get<GoalDetail>(url);
  }

  // uploadGoalDetailImage(listId: number, id: number): Observable<GoalDetail>{
  //   const url: string = `${endpoints.baseUrl}${endpoints.listDetails}${listId}/update-image/${id}`;
  //   return this.http.post<GoalDetail>(url);
  // }

}
