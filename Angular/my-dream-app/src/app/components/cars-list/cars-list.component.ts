import { Component, OnInit } from '@angular/core';
import { CarsInfoService } from '../../services/cars-info.service';
import { Cars} from '../../models/cars';


@Component({
  selector: 'app-cars-list',
  templateUrl: './cars-list.component.html',
  styleUrls: ['./cars-list.component.css']
})
export class CarsListComponent implements OnInit {
    carsList:Cars[];
    carOne:Cars;
    display:boolean;
  constructor(private carService:CarsInfoService) { }
  
  ngOnInit() {
    //testing popup
    this.carOne=new Cars(); //importante que exista este objeto creado
    this.getAllCars();
    this.display=false;
    

  }

  /*
  getAllCars(){
    this.carService.getAllCars().subscribe(
      data=> {
               this.carsList=data;
      }
    )
  }
  */
  
 getAllCars(){
 this.carsList=this.carService.getAllCars();
}

 selectedCar(car:Cars){
  this.display=true; // cuando se selecciona uno, se mustra el dialog
 this.carOne=car;
 }

}
