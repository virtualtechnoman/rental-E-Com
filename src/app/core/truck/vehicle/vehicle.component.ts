import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { VehicleModel } from '../shared/truck.model';
import { ToastrService } from 'ngx-toastr';
import { TruckService } from '../shared/truck.service';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

  jQuery: any;
  allVehicles: any[] = [];
  currentVehicle: VehicleModel;
  currentVehicleId: string;
  current_Vehicle_index: number;
  VehicleForm: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  uploading: Boolean = false;
  editing: Boolean = false;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private vehicleService: TruckService) {
    this.initForm();
  }

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
        search: '_INPUT',
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
    this.get_Vehicles();
  }


  submit() {
    this.submitted = true;
    if (this.VehicleForm.invalid) {
      return;
    }
    this.currentVehicle = this.VehicleForm.value;
    if (this.editing) {
      this.updateVehicle(this.currentVehicle);
    } else {
      this.addVehicle(this.currentVehicle);
    }
  }

  addVehicle(Vehicle) {
    console.log(Vehicle);
    this.vehicleService.addVehicle(Vehicle).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.success('Vehicle Added', 'Success!');
      this.allVehicles.push(res.data);
      this.resetForm();
    });
  }

  editVehicle(i) {
    this.editing = true;
    this.currentVehicle = this.allVehicles[i];
    this.currentVehicleId = this.allVehicles[i]._id;
    this.current_Vehicle_index = i;
    this.setFormValue();
  }

  deleteVehicle(i) {
    if (confirm('You Sure you want to delete this Vehicle')) {
      this.vehicleService.deleteVehicle(this.allVehicles[i]._id).toPromise().then(() => {
        this.allVehicles.splice(i, 1);
        this.toastr.warning('Vehicle Deleted!', 'Deleted!');
      }).catch((err) => console.log(err));
    }
  }

  get_Vehicles() {
    this.allVehicles.length = 0;
    this.vehicleService.getAllVehicles().subscribe((res: ResponseModel) => {
      console.log(res);
      this.allVehicles = res.data;
      this.dtTrigger.next();
    });
  }

  updateVehicle(vehicle) {
    this.vehicleService.updateVehicle(this.allVehicles[this.current_Vehicle_index]._id, vehicle)
      .subscribe((res: ResponseModel) => {
        this.toastr.info('Vehicle Updated Successfully!', 'Updated!');
        jQuery('#modal3').modal('hide');
        this.allVehicles.splice(this.current_Vehicle_index, 1, res.data);
        this.resetForm();
      });
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.VehicleForm.reset();
    this.initForm();
  }
  initForm() {
    this.VehicleForm = this.formBuilder.group({
      number: ['', Validators.required],
      type: [true, Validators.required],
      isAvailable: ['']
    });
  }

  setFormValue() {
    const customer = this.allVehicles[this.current_Vehicle_index];
    this.VehicleForm.controls['number'].setValue(customer.number);
    this.VehicleForm.controls['isAvailable'].setValue(customer.isAvailable);
    this.VehicleForm.controls['type'].setValue(customer.type);
  }
}
