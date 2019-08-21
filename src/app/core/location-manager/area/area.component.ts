import { Component, OnInit } from '@angular/core';
import { LocationManagerService } from '../shared/location-manager.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AreaModel, CityModel } from '../shared/location-manager.model';
import { CityComponent } from '../city/city.component';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  areaForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  viewArray: any = [];
  allAreas: AreaModel[] = [];
  allCities: CityModel[] = [];
  allHubUsers: any = [];
  jQuery: any;
  currentArea: AreaModel;
  currentAreaId: string;
  currentIndex: number;
  viewHub: any = []
  constructor(private formBuilder: FormBuilder, private locationManagerService: LocationManagerService, private toastr: ToastrService) {
    this.getArea();
    this.getCity();
    this.getHubUser();
  }

  ngOnInit() {
    this.areaForm = this.formBuilder.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      hub: ['', Validators.required],
      is_active: ['', Validators.required]
    });
    console.log(this.areaForm)

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
  get f() { return this.areaForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.areaForm.invalid) {
      return;
    }
    if (this.editing) {
      this.updateArea(this.areaForm.value)
    } else {
      this.addArea(this.areaForm.value)
    }
  }

  addArea(area) {
    console.log(area)
    this.locationManagerService.addArea(area).subscribe((res: ResponseModel) => {
      console.log(res)
      jQuery('#modal3').modal('hide');
      this.allAreas.push(res.data)
      console.log(this.allAreas)
      this.toastr.success('Area Added', 'Success!');
      this.resetForm();
    })
  }

  viewArea(i) {
    this.viewArray = this.allAreas[i];
    this.viewHub = this.allHubUsers[i]
    console.log(this.viewArray)
  }

  editArea(i) {
    this.editing = true;
    this.currentArea = this.allAreas[i];
    this.currentAreaId = this.allAreas[i]._id;
    this.currentIndex = i;
    this.setFormValue();
  }

  updateArea(area) {
    const id = this.allAreas[this.currentIndex]._id;
    this.locationManagerService.updateArea(area, id).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.info('City Updated Successfully!', 'Updated!!');
      this.resetForm();
      this.allAreas.splice(this.currentIndex, 1, res.data);
      this.currentAreaId = null;
      this.editing = false;
    });
  }
  setFormValue() {
    const area: any = this.allAreas[this.currentIndex];
    const hub: any = this.allHubUsers[this.currentIndex]
    console.log(area)
    this.areaForm.controls['name'].setValue(area.name);
    this.areaForm.controls['city'].setValue(area.city._id);
    this.areaForm.controls['hub'].setValue(hub._id);
    this.areaForm.controls['is_active'].setValue(area.is_active);
    console.log(this.areaForm.value)
  }

  deleteArea(i) {
    if (confirm('You Sure you want to delete this Area')) {
      this.locationManagerService.deleteArea(this.allAreas[i]._id).toPromise().then(() => {
        this.toastr.warning('City Deleted!', 'Deleted!');
        this.allAreas.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  getArea() {
    this.locationManagerService.getAllArea().subscribe((res: ResponseModel) => {
      this.allAreas= res.data;
      console.log(this.allAreas)
      this.dtTrigger.next();
    })
  }

  getCity() {
    this.locationManagerService.getAllCity().subscribe((res: ResponseModel) => {
      this.allCities=res.data
      console.log(this.allCities)
      this.dtTrigger.next();
    })
  }

  getHubUser() {
    this.locationManagerService.getAllHubUsers().subscribe((res: ResponseModel) => {
      this.allHubUsers=res.data
      console.log(this.allHubUsers)
      this.dtTrigger.next();
    })
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.areaForm.reset();
    // this.initForm();
  }
}
