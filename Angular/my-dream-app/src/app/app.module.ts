import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { CarsListComponent } from './components/cars-list/cars-list.component';
import { DiasTrabajadosComponent } from './components/dias-trabajados/dias-trabajados.component';
import { CarsInfoService } from './services/cars-info.service';
import {DataTableModule,SharedModule, ButtonModule, DialogModule, InputTextModule} from 'primeng/primeng'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '../../node_modules/@angular/forms';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { InfoDiasTrabajadosService } from './services/info-dias-trabajados.service';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';

@NgModule({
  declarations: [
    AppComponent,
    CarsListComponent,
    DiasTrabajadosComponent

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
    FormsModule,
    AppRoutingModule,
    DropdownModule,
    FileUploadModule

  ],
  providers: [CarsInfoService,InfoDiasTrabajadosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
