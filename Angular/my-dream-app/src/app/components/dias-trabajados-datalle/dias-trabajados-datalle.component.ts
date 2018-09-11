import { Component, OnInit, Input } from '@angular/core';
import { DiasTrabajados } from '../../models/dias-trabajados';

@Component({
  selector: 'app-dias-trabajados-datalle',
  templateUrl: './dias-trabajados-datalle.component.html',
  styleUrls: ['./dias-trabajados-datalle.component.css']
})
export class DiasTrabajadosDatalleComponent implements OnInit {

  @Input() diaTrabajado:DiasTrabajados;

  constructor() { }

  ngOnInit() {
  }

}
