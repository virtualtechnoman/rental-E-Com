import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { LocationManagerService } from '../shared/location-manager.service';
import { ToastrService } from 'ngx-toastr';
import { StateModel } from '../shared/location-manager.model';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
  jQuery:any;
  stateForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  allStates:StateModel[]=[];
  viewArray:any=[];
  currentState:StateModel;
  currentStateId:string;
  currentIndex:number
  constructor(private formBuilder: FormBuilder, private locationManagerService:LocationManagerService, private toastr:ToastrService) {

    this.getStates();

   }
  
  ngOnInit() {
    this.stateForm = this.formBuilder.group({
      name: ['', Validators.required],
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

  get f() { return this.stateForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.stateForm.invalid) {
        return;
    }

    if(this.editing){
      this.updateState(this.stateForm.value)
    }else{
      this.addState(this.stateForm.value)
    }
    console.log(this.stateForm.value)
}

getStates(){
  this.locationManagerService.getAllStates().subscribe((res:ResponseModel)=>{
    this.allStates=res.data
    console.log(this.allStates)
    this.dtTrigger.next();
  })
}

addState(state){
  this.locationManagerService.addState(state).subscribe((res:ResponseModel)=>{
    console.log(res)
      jQuery('#modal3').modal('hide');
      this.toastr.success('State Added', 'Success!');
      this.allStates.push(res.data)
      console.log(this.allStates)
      this.resetForm();
  })
}

viewState(i){
  this.viewArray=this.allStates[i];
}

updateState(state) {
  const id = this.allStates[this.currentIndex]._id;
  // product._id = id;
  console.log(state);
  this.locationManagerService.updateState(state, id).subscribe((res: ResponseModel) => {
    jQuery('#modal3').modal('hide');
    this.toastr.info('State Updated Successfully!', 'Updated!!');
    this.resetForm();
    this.allStates.splice(this.currentIndex, 1, res.data);
    this.currentStateId = null;
    this.editing = false;
  });
}

editState(i){
  this.editing = true;
    this.currentState = this.allStates[i];
    this.currentStateId = this.allStates[i]._id;
    this.currentIndex = i;
    this.setFormValue();

}

deleteState(i){
  if (confirm('You Sure you want to delete this State')) {
    this.locationManagerService.deleteState(this.allStates[i]._id).toPromise().then(() => {
      this.toastr.warning('State Deleted!', 'Deleted!');
      this.allStates.splice(i, 1);
    }).catch((err) => console.log(err));
  }
}

setFormValue() {
  const state = this.allStates[this.currentIndex];
  this.stateForm.controls['name'].setValue(state.name);
  this.stateForm.controls['is_active'].setValue(state.is_active);
}

resetForm() {
  this.editing = false;
  this.submitted = false;
  this.stateForm.reset();
  // this.initForm();
}
}
