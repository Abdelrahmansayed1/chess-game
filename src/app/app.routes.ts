import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { IframePageComponent } from './pages/iframe-page/iframe-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/mainpage', pathMatch: 'full' },
  { path: 'mainpage', component: MainPageComponent },
  { path: 'iframepage', component: IframePageComponent },
];
