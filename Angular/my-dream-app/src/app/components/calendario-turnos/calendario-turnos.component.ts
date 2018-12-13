import { Component, OnInit } from '@angular/core';
import {FullCalendarModule} from 'primeng/fullcalendar';
import {TurnosAsistenciasService} from '../../services/turnos-asistencias.service';
import { TurnoDetalle } from 'src/app/models/turno-detalle';

@Component({
  selector: 'app-calendario-turnos',
  templateUrl: './calendario-turnos.component.html',
  styleUrls: ['./calendario-turnos.component.css']
})
export class CalendarioTurnosComponent implements OnInit {

  constructor(private TurnosAsistenciasService:TurnosAsistenciasService) { }

  events: any[];
  options: any;
  turnosDetalle:TurnoDetalle[];

  ngOnInit() {

    this.events = [
      {
          "title": "All Day Event",
          "start": "2016-01-01",
          "color":"yellow"
      },
      {
          "title": "Long Event",
          "start": "2016-01-07",
          "end": "2016-01-10",
          "color":"red"
      },
      {
          "title": "Repeating Event",
          "start": "2016-01-09T16:00:00"
      },
      {
          "title": "Repeating Event",
          "start": "2016-01-16T16:00:00"
      },
      {
          "title": "Conference",
          "start": "2016-01-11",
          "end": "2016-01-13"
      }
  ];
  this.options = {
    defaultDate: '2018-01-01',
    header: {
        left: 'prev,next',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
    },
    eventClick:(e)=>{
      console.log(e);
      alert(e);
  }


  
  };


  this.getAllTurnosPersona();


}


getAllTurnosPersona(){
    
  // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
   this.TurnosAsistenciasService.getTurnosPersona().subscribe(
  data=> {
             this.turnosDetalle=data;
     

             var events=this.turnosDetalle.map(turno=>{
             
              var fecha_desde_turno= new Date(turno.FECHA_ASIST);
              fecha_desde_turno.setHours(turno.DESDE);

              var fecha_hasta_turno= new Date(turno.FECHA_ASIST);
              fecha_hasta_turno.setHours(turno.HASTA);
              
              let color="#007ad9";
              let text_color="#ffffff"
              
              if (turno.CODIGO_TURNO.trim()=="L"){
                color="#f4f4f4";
                text_color="#333333"
              }


               return  {title:turno.CENCO2_CODI,start:fecha_desde_turno,end:fecha_hasta_turno,color:color,textColor:text_color,observacion:"sdasdasasas"};
          
              });
              console.log(events);
              this.events=events;

           }
     
   )

 }



}
