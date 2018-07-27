import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { CarsListComponent } from './components/cars-list/cars-list.component';
import { CarsInfoService } from './services/cars-info.service';
import {DataTableModule,SharedModule} from 'primeng/primeng'
@NgModule({
  declarations: [
    AppComponent,
    CarsListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DataTableModule,
    SharedModule

  ],
  providers: [CarsInfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
