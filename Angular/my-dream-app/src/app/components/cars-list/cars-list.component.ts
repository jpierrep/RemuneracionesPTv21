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
  constructor(private carService:CarsInfoService) { }
  
  ngOnInit() {
    console.log("pepepepepepe");
    this.getAllCars();
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
 console.log(this.carsList);
 console.log("asdasdsdadasdasds");
}


}
