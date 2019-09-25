import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBuilderComponent } from './list-builder/list-builder.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'playlist', component: ListBuilderComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {

}
