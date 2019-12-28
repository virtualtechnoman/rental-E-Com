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
  imageUrl="https://binsar.s3.ap-south-1.amazonaws.com/"
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
  viewArray: any = [];
  fileSelected;
  keyVehicleImage:any;
  urlVehicleImage:any;
  showImage:boolean=false;
  image:any;
  editShowImage:boolean=false
  editImage: any;
  mastImage: any;
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
    this.get_Vehicles();
  }

  get f() { return this.VehicleForm.controls; }

  submit() {
    console.log(this.VehicleForm.value);
    this.submitted = true;
    if (this.VehicleForm.invalid) {
      return;
    }
    this.currentVehicle = this.VehicleForm.value;
    if(this.VehicleForm.value.note=="" || this.VehicleForm.value.note==null){
      delete this.VehicleForm.value.note;
    }

    if(this.fileSelected){
      this.vehicleService.getUrl().subscribe((res:ResponseModel)=>{
        console.log(res.data)
        this.keyVehicleImage=res.data.key;
        this.urlVehicleImage=res.data.url;
          
      if(this.urlVehicleImage){
        this.vehicleService.sendUrl(this.urlVehicleImage,this.fileSelected).then(resp=>{
          if(resp.status == 200 ){
            this.VehicleForm.value.image=this.keyVehicleImage;
            
           console.log(this.VehicleForm.value)
           if (this.editing) {
            this.updateVehicle(this.VehicleForm.value);
          } else {
            this.addVehicle(this.VehicleForm.value);
          }
            // this.addVehicle(this.VehicleForm.value);
          }
        })
      }
      })
    }else{
      
      console.log(this.VehicleForm.value)
      if (this.editing) {
          if(!this.fileSelected){
        this.VehicleForm.value.image=this.mastImage
          }
        console.log(this.mastImage)
        this.updateVehicle(this.VehicleForm.value);
          
      } else {
        delete this.VehicleForm.value.image;
        this.addVehicle(this.VehicleForm.value);
      }
      // this.addVehicle(this.VehicleForm.value);
    }
   
  }

  addVehicle(Vehicle) {
    console.log(Vehicle)
    this.vehicleService.addVehicle(Vehicle).subscribe((res: ResponseModel) => {
      jQuery('#modal3').modal('hide');
      this.toastr.success('Vehicle Added', 'Success!');
      this.allVehicles.push(res.data);
      console.log(res.data)
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

  viewVehicle(i) {
    this.viewArray = this.allVehicles[i];
    if(this.viewArray.image){
      this.showImage=true;
    this.image= this.imageUrl + this.viewArray.image
    console.log(this.image)
    }
    else{
      this.showImage=false
    }
  }

  get_Vehicles() {
    this.allVehicles.length = 0;
    this.vehicleService.getAllVehicles().subscribe((res: ResponseModel) => {
      console.log(res);
      this.allVehicles = res.data;
      console.log(res.data)
      this.dtTrigger.next();
    });
  }

  updateVehicle(vehicle) {
    console.log(vehicle,this.allVehicles[this.current_Vehicle_index]._id)

    this.vehicleService.updateVehicle(vehicle,this.allVehicles[this.current_Vehicle_index]._id )
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
    this.editShowImage=false
    this.initForm();
  }
  initForm() {
    this.VehicleForm = this.formBuilder.group({
      number: ['', Validators.required],
      type: ['', Validators.required],
      isAvailable: [false],
      note:[""],
      image:['']
    });
  }

  selectFile(event:any){
    this.fileSelected=event.target.files[0];
    console.log(this.fileSelected)
  }
  setFormValue() {
    const customer = this.allVehicles[this.current_Vehicle_index];
    this.VehicleForm.controls['number'].setValue(customer.number);
    this.VehicleForm.controls['isAvailable'].setValue(customer.isAvailable);
    this.VehicleForm.controls['type'].setValue(customer.type);
    if(customer.note){
    this.VehicleForm.controls['note'].setValue(customer.note);
    }
    if(customer.image){
      this.editShowImage=true;
      this.mastImage=customer.image
      this.editImage= this.imageUrl + customer.image
      // this.VehicleForm.controls['image'].setValue(image);
    console.log(this.editImage)
    }else{
      this.editShowImage=false
    }

  }
}
