import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { LocationManagerService } from '../shared/location-manager.service';
import { StateModel, CityModel } from '../shared/location-manager.model';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  cityForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  allStates:StateModel[]=[];
  allCities:CityModel[]=[];
  viewArray:any=[];
  currentCity:CityModel;
  currentCityId:string;
  currentIndex:number;
  constructor(private formBuilder: FormBuilder, private locationManagerService:LocationManagerService, private toastr:ToastrService) {

    this.getCity()
    this.getStates();

   }

  ngOnInit() {
    this.cityForm = this.formBuilder.group({
      name: ['', Validators.required],
      state:['', Validators.required],
      is_active:['', Validators.required]
  });

    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      dom: '<"html5buttons"B>lTfgitp',
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      },
      // dom: 'Bfrtip',
      buttons: [
        // 'colvis',
        'copy',
        'print',
        'excel',
      ]
    };
  }

  get f() { return this.cityForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.cityForm.invalid) {
        return;
    }
    console.log(this.cityForm.value)

    if(this.editing){
      this.updateCity(this.cityForm.value)
    }else{
      this.addCity(this.cityForm.value)
    }
}

addCity(city){
  console.log(city)
  this.locationManagerService.addCity(city).subscribe((res:ResponseModel)=>{
    console.log(res)
      jQuery('#modal3').modal('hide');
      this.toastr.success('City Added', 'Success!');
      this.allCities.push(res.data)
      console.log(this.allCities)
      this.resetForm();
  })
}

viewCity(i){
  this.viewArray=this.allCities[i];
  console.log(this.viewArray)
}

updateCity(city){
  const id = this.allCities[this.currentIndex]._id;
  console.log(city);
  this.locationManagerService.updateCity(city, id).subscribe((res: ResponseModel) => {
    jQuery('#modal3').modal('hide');
    this.toastr.info('City Updated Successfully!', 'Updated!!');
    this.resetForm();
    this.allCities.splice(this.currentIndex, 1, res.data);
    this.currentCityId = null;
    this.editing = false;
  });
}

editCity(i){
  this.editing = true;
    this.currentCity = this.allCities[i];
    this.currentCityId = this.allCities[i]._id;
    this.currentIndex = i;
    this.setFormValue();
}

deleteCity(i){
  if (confirm('You Sure you want to delete this City')) {
    this.locationManagerService.deleteCity(this.allCities[i]._id).toPromise().then(() => {
      this.toastr.warning('City Deleted!', 'Deleted!');
      this.allCities.splice(i, 1);
    }).catch((err) => console.log(err));
  }
}

setFormValue() {
  const city = this.allCities[this.currentIndex];
  console.log(city)
  this.cityForm.controls['name'].setValue(city.name);
  this.cityForm.controls['state'].setValue(city.state._id);
  this.cityForm.controls['is_active'].setValue(city.is_active);
  console.log(this.cityForm.value)
}

getCity(){
  this.locationManagerService.getAllCity().subscribe((res:ResponseModel)=>{
    this.allCities=res.data
    console.log(this.allCities)
    this.dtTrigger.next();
  })
}

getStates(){
  this.locationManagerService.getAllStates().subscribe((res:ResponseModel)=>{
    this.allStates=res.data
    console.log(this.allStates)
    this.dtTrigger.next();
  })
}

resetForm() {
  this.editing = false;
  this.submitted = false;
  this.cityForm.reset();
  // this.initForm();
}

}
