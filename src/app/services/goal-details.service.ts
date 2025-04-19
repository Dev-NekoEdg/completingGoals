import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FilterData, FilterParam } from '../models/filterData';

import { endpoints } from '../customConfig'
import { GoalDetail } from '../models/goal-detail';
import { Observable } from 'rxjs';
import { ResponseDefault } from '../models/response-default';

@Injectable({
  providedIn: 'root'
})
export class GoalDetailsService {

  constructor(private http: HttpClient) {
    this.http = inject(HttpClient);
  }

  getPaginatedDetails(listId: number, filter: FilterData<FilterParam>)
    : Observable<FilterData<GoalDetail[]>> {
    const url: string = `${endpoints.baseUrl}${endpoints.listDetails}${listId}/filter`;
    console.log({ url });
    return this.http.post<FilterData<GoalDetail[]>>(url, filter);
  }

  getGoalDetail(listId: number, id: number): Observable<GoalDetail> {
    const url: string = `${endpoints.baseUrl}${endpoints.listDetails}${listId}/${id}`;
    return this.http.get<GoalDetail>(url);
  }

  uploadGoalDetailImage(listId: number, id: number, formData: FormData): Observable<ResponseDefault<string>> {
    const url: string = `${endpoints.baseUrl}${endpoints.listDetails}${listId}/update-image/${id}`;
    return this.http.post<ResponseDefault<string>>(url, formData);
  }

  updateGoalDetail(goalDetail: GoalDetail): Observable<GoalDetail> {
    const url: string = `${endpoints.baseUrl}${endpoints.listDetails}${goalDetail.listId}/${goalDetail.id}`;
    console.log({ 'service': goalDetail });
    return this.http.put<GoalDetail>(url, goalDetail);
  }

  saveGoalDetail(goalDetail: GoalDetail): Observable<GoalDetail> {
    const url: string = `${endpoints.baseUrl}${endpoints.listDetails}${goalDetail.listId}`;
    return this.http.post<GoalDetail>(url, goalDetail);
  }

  deleteGoalDetail(goalDetail: GoalDetail): Observable<ResponseDefault<boolean>> {
    const url: string = `${endpoints.baseUrl}${endpoints.listDetails}${goalDetail.listId}/${goalDetail.id}`;
    return this.http.delete<ResponseDefault<boolean>>(url);
  }

}
