import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { LocationManagerService } from '../shared/location-manager.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
  stateForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private formBuilder: FormBuilder, private locationManagerService:LocationManagerService) { }
  
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
  }

  get f() { return this.stateForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.stateForm.invalid) {
        return;
    }
    console.log(this.stateForm.value)
}

resetForm() {
  this.editing = false;
  this.submitted = false;
  this.stateForm.reset();
  // this.initForm();
}
}
