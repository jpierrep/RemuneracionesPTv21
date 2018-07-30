import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { CarsListComponent } from './components/cars-list/cars-list.component';
import { CarsInfoService } from './services/cars-info.service';
import {DataTableModule,SharedModule, ButtonModule, DialogModule, InputTextModule} from 'primeng/primeng'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '../../node_modules/@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CarsListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DataTableModule,
    SharedModule,
    ButtonModule,
    DialogModule,
    BrowserAnimationsModule,
    InputTextModule,
    FormsModule


  ],
  providers: [CarsInfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
