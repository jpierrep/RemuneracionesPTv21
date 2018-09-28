import { Component, OnInit, Input } from '@angular/core';
import { DiasTrabajados } from '../../models/dias-trabajados';
import { Turno } from '../../models/turno';
import {InfoDiasTrabajadosService } from '../../services/info-dias-trabajados.service';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {ProgressBarModule} from 'primeng/progressbar';
import {GrowlModule} from 'primeng/growl';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-dias-trabajados-datalle',
  templateUrl: './dias-trabajados-datalle.component.html',
  styleUrls: ['./dias-trabajados-datalle.component.css']
})
export class DiasTrabajadosDatalleComponent implements OnInit {

  @Input() diaTrabajado:DiasTrabajados;
  @Input() diasTrabajadosExiste:DiasTrabajados[];
  @Input() diasTrabajados:DiasTrabajados[];
  display:boolean;
  displayVariables:boolean;
  diasTrabajadosOne:DiasTrabajados;
  diasTrabajadosOneSelected:DiasTrabajados;
  turnoOne:Turno;
  turnoOneSelected:Turno;
 

  constructor( private InfoDiasTrabajadosService:InfoDiasTrabajadosService) { }

  ngOnInit() {

  this.displayVariables=false;
  this.diasTrabajadosOne=new DiasTrabajados();
  this.diasTrabajadosOneSelected=new DiasTrabajados();

  this.turnoOne=new Turno();
  this.turnoOneSelected=new Turno();

  }

  editTurnos(turnoEditar:Turno){

  
     this.turnoOne=new Turno();
    this.turnoOne=turnoEditar // la original para saber la posicion
    this.turnoOneSelected=this.cloneTurno(turnoEditar);  // la copia para editar y luego reasignar
  this.display=true;
  
  }

  cloneDias(d: DiasTrabajados): DiasTrabajados {
    let dia =  new DiasTrabajados();
    for (let prop in d) {
        dia[prop] = d[prop];
    }
    return dia;
  }
  cloneTurno(d: Turno): Turno {
    let turno=  new Turno();
    for (let prop in d) {
        turno[prop] = d[prop];
    }
    return turno;
  }

  saveTurnos(){


   console.log("save data");


  console.log (this.diaTrabajado.TURNOS);
  console.log(this.turnoOne);
  console.log(this.turnoOneSelected);


     this.diaTrabajado.TURNOS[ this.diaTrabajado.TURNOS.indexOf(this.turnoOne)] = this.turnoOneSelected //cuidado con los filtros existe vs el completo

   
    this.display=false;
   //}
   
  }

}
