import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListGoalsComponent } from './components/list-goals/list-goals.component';
import { GoalDetailComponent } from './components/goal-detail/goal-detail.component';

export const routes: Routes = [
  { path:'home', component: HomeComponent },
  { path:'list-goal', component: ListGoalsComponent},
  { path:'goal-datails/:listId', component: GoalDetailComponent}
  // { path:'', component: HomeComponent },
  // { path: '**', redirectTo:'home' , pathMatch: 'full'}
];
