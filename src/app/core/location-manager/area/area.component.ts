import { Component, OnInit } from '@angular/core';
import { LocationManagerService } from '../shared/location-manager.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

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
  constructor(private formBuilder: FormBuilder, private locationManagerService:LocationManagerService) { }

  ngOnInit() {
    this.areaForm = this.formBuilder.group({
      name: ['', Validators.required],
      city:['', Validators.required],
      hub:['', Validators.required],
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
  get f() { return this.areaForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.areaForm.invalid) {
        return;
    }
    console.log(this.areaForm.value)
}

resetForm() {
  this.editing = false;
  this.submitted = false;
  this.areaForm.reset();
  // this.initForm();
}
}
