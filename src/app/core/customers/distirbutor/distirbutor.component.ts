import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../shared/customers.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { DistirbutorModel } from '../shared/customer.model';
import { stringify } from 'querystring';

@Component({
  selector: 'app-distirbutor',
  templateUrl: './distirbutor.component.html',
  styleUrls: ['./distirbutor.component.scss']
})
export class DistirbutorComponent implements OnInit {


  allDistirbutors: any[] = [];
  currentDistirbutors: DistirbutorModel;
  currentDistirbutorsId: string;
  current_Distirbutor_index: number;
  distirbutors_form: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: boolean = false;
  id = "DIST" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second()
  CSV: File = null;
  fileReader: FileReader = new FileReader();
  parsedCSV;
  uploading: boolean = false;
  submitted: boolean = false;
  constructor(private customerService: CustomersService, private toastr: ToastrService, private formBuilder: FormBuilder) {
    this.initForm();
  }
  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      dom: '<"html5buttons"B>lTfgitp',
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      // dom: 'Bfrtip',
      buttons: [
        // 'colvis',
        'copy',
        'print',
        'excel',
      ]
    };
    this.get_customers();
  }
  get f() { return this.distirbutors_form.controls; }
  submit() {
    this.submitted = true;
    if (this.distirbutors_form.invalid) {
      return;
    }
    this.currentDistirbutors = this.distirbutors_form.value;
    if (this.editing) {
      this.updateCustomer(this.currentDistirbutors)
    } else {
      this.addCustomer(this.currentDistirbutors);
    }
  }

  addCustomer(customer) {
    this.customerService.addDistirbutors(customer).subscribe((res:DistirbutorModel) => {
      jQuery("#modal3").modal("hide");
      this.toastr.success('Distirbutor Added', 'Success!');
      this.allDistirbutors.push(res);
      this.resetForm();
    })
  }

  editCustomer(i) {
    this.editing = true;
    this.currentDistirbutors = this.allDistirbutors[i];
    this.currentDistirbutorsId = this.allDistirbutors[i]._id;
    this.current_Distirbutor_index = i;
    this.setFormValue()
  }

  deleteCustomer(i) {
    if (confirm("You Sure you want to delete this customer")) {
      this.customerService.deleteDistirbutors(this.allDistirbutors[i]._id).toPromise().then(() => {
        this.allDistirbutors.splice(i, 1)
        this.toastr.warning('Customer Deleted!', 'Deleted!');
      }).catch((err) => console.log(err))
    }
  }

  get_customers() {
    this.allDistirbutors.length = 0;
    this.customerService.getAllDistirbutors().subscribe((res: DistirbutorModel[]) => {
      this.allDistirbutors = res;
      this.dtTrigger.next();
    })
  }

  updateCustomer(customer) {
    this.customerService.updateDistirbutors(this.allDistirbutors[this.current_Distirbutor_index]._id, customer).subscribe((res:DistirbutorModel) => {
      this.toastr.info('Distirbutor Updated Successfully!', 'Updated!');
      jQuery("#modal3").modal("hide");
      this.allDistirbutors.splice(this.current_Distirbutor_index, 1, res);
      this.resetForm();
    })
  }

  resetForm() {
    this.submitted =false;
    this.editing = false;
    this.distirbutors_form.reset();
    this.initForm();
  }

  initForm() {
    this.distirbutors_form = this.formBuilder.group({
      is_active: [false, Validators.required],
      distirbutor_name: ['', Validators.required],
      distirbutor_id: [this.id, Validators.required],
      notes : ['']
    })
  }


  setFormValue() {
    var customerType = this.allDistirbutors[this.current_Distirbutor_index];
    this.distirbutors_form.controls['distirbutor_id'].setValue(customerType.distirbutor_id);
    this.distirbutors_form.controls['distirbutor_name'].setValue(customerType.distirbutor_name);
    this.distirbutors_form.controls['is_active'].setValue(customerType.is_active);
  }

  public uploadCSV(files: FileList) {
    if (files && files.length > 0) {
      let file: File = files.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.parsedCSV = reader.result;
      }
    }
  }

  public extractData() {
    this.uploading = true;
    var lines = this.parsedCSV.split(/\r\n|\n/);
    var result = [];
    var headers: any[] = lines[0].split(",");
    if (
      headers[0] == "distirbutor_name" && headers[1] == "is_active") {
      for (var i = 1; i < lines.length - 1; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        currentline[0] = String(currentline[0]);
        currentline[1] = String(currentline[1]);
        currentline[2] = String(currentline[2]);
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      this.customerService.importDistirbutors(result).subscribe(res => {
        setTimeout(() => {
          this.uploading = false;
          this.toastr.success('Distirbutors Imported successfully', 'Upload Success');
          jQuery("#modal2").modal("hide");
        }, 1000);
      });
      // this.newproduct = result;
    }
    else {
      this.toastr.error('Try Again', 'Upload Failed')
      // this.reset();
    }
  }


}
