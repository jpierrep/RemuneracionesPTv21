import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SystemJsNgModuleLoader } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { CarsListComponent } from './components/cars-list/cars-list.component';
import { DiasTrabajadosComponent } from './components/dias-trabajados/dias-trabajados.component';
import { CarsInfoService } from './services/cars-info.service';
import {DataTableModule,SharedModule, ButtonModule, DialogModule, InputTextModule, MenuItemContent} from 'primeng/primeng'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '../../node_modules/@angular/forms';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { InfoDiasTrabajadosService } from './services/info-dias-trabajados.service';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import { PersistenceModule } from 'angular-persistence';
//import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import {MenuModule} from 'primeng/menu';
import {TabMenuModule} from 'primeng/tabmenu';
import {ProgressBarModule} from 'primeng/progressbar';
import {GrowlModule} from 'primeng/growl';
import { DiasTrabajadosDatalleComponent } from './components/dias-trabajados-datalle/dias-trabajados-datalle.component';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';


@NgModule ({
  declarations: [
    AppComponent,
    CarsListComponent,
    DiasTrabajadosComponent,
    DiasTrabajadosDatalleComponent

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
    FileUploadModule,
    PersistenceModule,
    MenuModule,
    TabMenuModule,
    ProgressBarModule,
    GrowlModule,
    TableModule,
    MultiSelectModule



  ],
  providers: [CarsInfoService,InfoDiasTrabajadosService],
  bootstrap: [AppComponent]
})

export class AppModule { }
