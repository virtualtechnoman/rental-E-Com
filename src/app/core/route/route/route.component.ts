import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { RouteService } from '../shared/route.service';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit {

  routeForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  allRoutes:any[]=[];
  allDeliveryBoys:any[]=[];
  viewArray:any=[];
  currentRoute:any;
  currentRouteId:any;
  currentIndex:number;
  constructor(private formBuilder:FormBuilder, private routeService:RouteService, private toastr:ToastrService) {

    this.getDeliveryBoysUser();
    this.getRoutes();

   }

  ngOnInit() {
    this.routeForm = this.formBuilder.group({
      name: ['', Validators.required],
      delivery_boy:['', Validators.required],
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

  get f() { return this.routeForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.routeForm.invalid) {
        return;
    }

    if(this.editing){
      this.updateRoute(this.routeForm.value)
    }else{
      this.addRoute(this.routeForm.value)
    }
    console.log(this.routeForm.value)
}

addRoute(route){
  this.routeService.addRoute(route).subscribe((res:ResponseModel)=>{
      jQuery('#modal3').modal('hide');
      this.toastr.success('Route Added', 'Success!');
      this.allRoutes.push(res.data)
      console.log(res.data)
      this.resetForm();
  })
}

updateRoute(route) {
  const id = this.allRoutes[this.currentIndex]._id;
  // product._id = id;
  console.log(route);
  this.routeService.updateRoute(route, id).subscribe((res: ResponseModel) => {
    jQuery('#modal3').modal('hide');
    this.toastr.info('Route Updated Successfully!', 'Updated!!');
    this.resetForm();
    this.allRoutes.splice(this.currentIndex, 1, res.data);
    this.currentRouteId = null;
    this.editing = false;
  });
}

deleteRoute(i){
  if (confirm('You Sure you want to delete this Route')) {
    this.routeService.deleteRoute(this.allRoutes[i]._id).toPromise().then(() => {
      this.toastr.warning('Route Deleted!', 'Deleted!');
      this.allRoutes.splice(i, 1);
    }).catch((err) => console.log(err));
  }
}

viewRoute(i){
  this.viewArray=this.allRoutes[i];
}

getDeliveryBoysUser() {
  this.routeService.getAllDeliveryBoyUsers().subscribe((res: ResponseModel) => {
    this.allDeliveryBoys=res.data
    console.log(this.allDeliveryBoys)
    this.dtTrigger.next();
  })
}

getRoutes(){
  this.routeService.getAllRoutes().subscribe((res: ResponseModel) => {
    this.allRoutes=res.data
    console.log(this.allRoutes)
    this.dtTrigger.next();
  })
}

editRoute(i){
  // console.log(this.addRoute[i])
  this.editing = true;
    this.currentRoute = this.allRoutes[i];
    this.currentRouteId = this.allRoutes[i]._id;
    this.currentIndex = i;
    this.setFormValue();

}

setFormValue() {
  const route = this.allRoutes[this.currentIndex];
  console.log(route)
  this.routeForm.controls['name'].setValue(route.name);
  this.routeForm.controls['delivery_boy'].setValue(route.delivery_boy._id);
  this.routeForm.controls['is_active'].setValue(route.is_active);
}

resetForm() {
  this.editing = false;
  this.submitted = false;
  this.routeForm.reset();
  // this.initForm();
}

}
