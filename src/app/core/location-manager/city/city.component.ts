import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { LocationManagerService } from '../shared/location-manager.service';

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
  constructor(private formBuilder: FormBuilder, private locationManagerService:LocationManagerService) { }

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

  get f() { return this.cityForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.cityForm.invalid) {
        return;
    }
    console.log(this.cityForm.value)
}

resetForm() {
  this.editing = false;
  this.submitted = false;
  this.cityForm.reset();
  // this.initForm();
}

}
