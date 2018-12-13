import { Component, OnInit } from '@angular/core';
import {TurnosAsistenciasService} from '../../services/turnos-asistencias.service';
import {ResumenTurnos} from '../../models/resumen-turnos';
import {TableModule} from 'primeng/table';


@Component({
  selector: 'app-personal-asist',
  templateUrl: './personal-asist.component.html',
  styleUrls: ['./personal-asist.component.css']
})
export class PersonalAsistComponent implements OnInit {


  resumenTurnos:ResumenTurnos[];

  constructor( private TurnosAsistenciasService:TurnosAsistenciasService) { }

  ngOnInit() {

      //activar para obtener personal
    this.getAllDiasTrabajados();
  }


  getAllDiasTrabajados(){
    
    // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
     this.TurnosAsistenciasService.getResumenAsistencias().subscribe(
    data=> {
               this.resumenTurnos=data;

             }
       
     )
 
   }

}
