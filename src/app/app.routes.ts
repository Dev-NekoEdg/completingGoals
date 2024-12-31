import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListGoalsComponent } from './components/list-goals/list-goals.component';
import { GoalDetailComponent } from './components/goal-detail/goal-detail.component';

export const routes: Routes = [
  { path:'home', component: HomeComponent, pathMatch: 'full' },
  { path:'list', component: ListGoalsComponent },
  { path:'details', component: GoalDetailComponent }
];
