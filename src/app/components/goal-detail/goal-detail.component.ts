import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalDetailsService } from '../../services/goal-details.service';
import { FilterData, FilterParam } from '../../models/filterData';
import { imageDefault, pagination } from '../../customConfig';
import { GoalDetail } from '../../models/goal-detail';

@Component({
  selector: 'app-goal-detail',
  imports: [],
  templateUrl: './goal-detail.component.html',
  styleUrl: './goal-detail.component.css'
})
export class GoalDetailComponent implements OnInit {

  public goalDetails = signal<GoalDetail[]>([]);

  listId: string;
  router: ActivatedRoute;
  filter: FilterData<FilterParam>;


  constructor(private service: GoalDetailsService) {
    this.listId = '';
    this.router = inject(ActivatedRoute);
    this.filter = {
      currentPage: 1,
      pageSize: pagination.defaultSize,
      totalRecords: 0,
      pages: 0,
      data: null,
    };
  }

  ngOnInit(): void {
    this.listId = this.router.snapshot.params['listId'];
    this.loadGoals(+this.listId);
  }

  loadGoals(listId: number) {

    this.service.getPaginatedDetails(listId, this.filter).subscribe({
      next: (data: FilterData<GoalDetail[]>) => {
        console.log({ data });
        this.filter.currentPage = data.currentPage;
        this.filter.pages = data.pages;
        this.filter.totalRecords = data.totalRecords;
        this.filter.pageSize = data.pageSize;

        if (data.data === null || data.data === undefined || data.data.length <= 0) {
          this.goalDetails.set([]);
        } else {
          data.data.map((detail) => {
            if (detail.imageUrl === '' || detail.imageUrl === null) {
              detail.imageUrl = imageDefault.imageNotFound;
            }
          })
          this.goalDetails.set(data.data);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });

    // this.goalDetails().map((detail) => {
    //   if (detail.imageUrl === null || detail.imageUrl === '') {
    //     detail.imageUrl = imageDefault.imageNotFound;
    //   }
    // });

    console.log('after map')
    console.log(this.goalDetails())
  }

}
