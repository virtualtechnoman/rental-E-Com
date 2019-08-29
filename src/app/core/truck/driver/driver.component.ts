import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';
import { TruckService } from '../shared/truck.service';
import { Subject } from 'rxjs';
import { DriverModel } from '../shared/truck.model';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {


  jQuery: any;
  allDrivers: any[] = [];
  currentDriver: DriverModel;
  currentDriverId: string;
  current_Driver_index: number;
  DriverForm: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  uploading: Boolean = false;
  editing: Boolean = false;
  submitted = false;
  viewArray: any = [];
  driverAddress:any;
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private DriverService: TruckService) { }

  ngOnInit() {
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
    this.get_Drivers();
    this.DriverForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      dl_number: ['', Validators.required],
      isAvailable: [false]
    });
  }

  get f() { return this.DriverForm.controls; }

  submit() {
    this.submitted = true;
    if (this.DriverForm.invalid) {
      return;
    }
    this.currentDriver = this.DriverForm.value;
    if (this.editing) {
      this.updateDriver(this.currentDriver);
    } else {
      this.addDriver(this.currentDriver);
    }
  }

  addDriver(Driver) {
    console.log(Driver);
    this.DriverService.addDriver(Driver).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.success('Driver Added', 'Success!');
      this.allDrivers.push(res.data);
      this.resetForm();
      // window.location.reload();
    });
  }

  editDriver(i) {
    this.editing = true;
    this.currentDriver = this.allDrivers[i];
    this.currentDriverId = this.allDrivers[i]._id;
    this.current_Driver_index = i;
    this.setFormValue();
  }

  deleteDriver(i) {
    if (confirm('You Sure you want to delete this Driver')) {
      this.DriverService.deleteDriver(this.allDrivers[i]._id).toPromise().then(() => {
        this.allDrivers.splice(i, 1);
        this.toastr.warning('Driver Deleted!', 'Deleted!');
      }).catch((err) => console.log(err));
    }
  }

  get_Drivers() {
    this.allDrivers.length = 0;
    this.DriverService.getAllDrivers().subscribe((res: ResponseModel) => {
      console.log(res.data);
      this.allDrivers = res.data;
      this.dtTrigger.next();
    });
  }

  updateDriver(Driver) {
    this.DriverService.updateDriver(this.allDrivers[this.current_Driver_index]._id, Driver)
      .subscribe((res: ResponseModel) => {
        this.toastr.info('Driver Updated Successfully!', 'Updated!');
        jQuery('#modal3').modal('hide');
        this.allDrivers.splice(this.current_Driver_index, 1, res.data);
        this.resetForm();
      });
  }

  viewDriver(i) {
    this.viewArray = this.allDrivers[i];
    this.driverAddress=this.viewArray.street_address + "," + " " + this.viewArray.city 
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.DriverForm.reset();
    this.initForm();
  }
  initForm() {
    this.DriverForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      dl_number: ['', Validators.required],
      isAvailable: ['', Validators.required]
    });
  }

  setFormValue() {
    const driver = this.allDrivers[this.current_Driver_index];
    this.DriverForm.controls['name'].setValue(driver.name);
    this.DriverForm.controls['isAvailable'].setValue(driver.isAvailable);
    this.DriverForm.controls['mobile'].setValue(driver.mobile);
    this.DriverForm.controls['dl_number'].setValue(driver.dl_number);
  }

}
