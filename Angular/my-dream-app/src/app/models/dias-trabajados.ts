import {Turno} from './turno';

export class DiasTrabajados {
    NOMBRE: string;
    FICHA:string;
    RUT: string;
    TIPO:string;
    FECHA:string;
    CANTIDAD_HRS:number
    IN_BD:string;
    SUELDO_MONTO:number;
    DESCUENTO:number;
    OTROS_DESCUENTOS:number;
    CENCO2_CODI:string;
    CENCO1_DESC:string;
    CENCO2_DESC:string;
    RUT_ID: string;
    CARGO_CODI:string;
    CARGO_DESC:string;
    CANT_TURNOS:number
    TURNOS:Turno[];

}

