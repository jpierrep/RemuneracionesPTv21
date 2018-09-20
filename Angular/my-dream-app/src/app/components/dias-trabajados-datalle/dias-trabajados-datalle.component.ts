import { Component, OnInit, Input } from '@angular/core';
import { DiasTrabajados } from '../../models/dias-trabajados';
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
  displayVariables:boolean;

  constructor( private InfoDiasTrabajadosService:InfoDiasTrabajadosService) { }

  ngOnInit() {

  this.displayVariables=false;
    

  }

}
