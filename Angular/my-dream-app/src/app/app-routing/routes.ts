import {RouterModule,Routes} from '@angular/router';
import { CarsListComponent } from '../components/cars-list/cars-list.component';
import { DiasTrabajadosComponent } from '../components/dias-trabajados/dias-trabajados.component';
import {PersonalAsistComponent } from '../components/personal-asist/personal-asist.component';
import {CalendarioTurnosComponent } from '../components/calendario-turnos/calendario-turnos.component';
import {ReliquidacionesDetalleComponent} from '../components/reliquidaciones-detalle/reliquidaciones-detalle.component';
import {ReliquidacionesComponent} from '../components/reliquidaciones/reliquidaciones.component';

export const routes:Routes=[
{  path:'cars',component:CarsListComponent},
{  path:'diasTrabajados/:id',component:DiasTrabajadosComponent},
{  path:'',redirectTo:'/cars',pathMatch:'full'}, // por defecto
{  path:'resumenTurnos',component:PersonalAsistComponent},
{  path:'calendarioTurnos',component:CalendarioTurnosComponent},
{  path:'reliquidacion',component:ReliquidacionesComponent},
{  path:'reliquidacionDetalle',component:ReliquidacionesDetalleComponent}
];