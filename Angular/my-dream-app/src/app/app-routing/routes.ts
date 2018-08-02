import {RouterModule,Routes} from '@angular/router';
import { CarsListComponent } from '../components/cars-list/cars-list.component';
import { DiasTrabajadosComponent } from '../components/dias-trabajados/dias-trabajados.component';

export const routes:Routes=[
{  path:'cars',component:CarsListComponent},
{  path:'diasTrabajados',component:DiasTrabajadosComponent},
{  path:'',redirectTo:'/cars',pathMatch:'full'} // por defecto
];