export class StateModel{
    name:string;
    is_active:boolean;
    _id:string;
}

export class CityModel{
    name:string;
    state:StateModel;
    is_active:boolean;
    _id:string;
}

export class AreaModel{
    name:string;
    city:CityModel;
    is_active:boolean;
    _id:string;
}