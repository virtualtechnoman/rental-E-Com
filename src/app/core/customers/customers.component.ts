import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CustomersService } from './shared/customers.service';
import { CustomerModel, CustomerTypeModel, DistirbutorModel, SectorModel } from './shared/customer.model';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  jQuery: any;
  allcustomers: any[] = [];
  currentcustomer: CustomerModel;
  currentcustomerId: string;
  current_customer_index: number;
  customerForm: FormGroup;
  customer_type_form: FormGroup;
  CSV: File = null;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  fileReader: FileReader = new FileReader();
  parsedCSV;
  uploading: Boolean = false;
  editing: Boolean = false;
  submitted = false;
  constructor(private customerService: CustomersService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.currentcustomer = new CustomerModel();
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
    this.get_customers();
  }
  get f() { return this.customerForm.controls; }

  submit() {
    this.submitted = true;
    if (this.customerForm.get('district').value == null) {
      this.customerForm.removeControl('district');
    }
    if (this.customerForm.invalid) {
      return;
    }
    this.currentcustomer = this.customerForm.value;
    if (this.editing) {
      this.updateCustomer(this.currentcustomer);
    } else {
      this.addCustomer(this.currentcustomer);
    }
  }

  addCustomer(customer) {
    console.log(customer);
    this.customerService.addCustomer(customer).subscribe(res => {
      jQuery('#modal3').modal('hide');
      this.toastr.success('Customer Added', 'Success!');
      this.allcustomers.push(res);
      this.resetForm();
    });
  }

  editCustomer(i) {
    this.editing = true;
    this.currentcustomer = this.allcustomers[i];
    this.currentcustomerId = this.allcustomers[i]._id;
    this.current_customer_index = i;
    this.setFormValue();
  }

  deleteCustomer(i) {
    if (confirm('You Sure you want to delete this customer')) {
      this.customerService.deleteCustomer(this.allcustomers[i]._id).toPromise().then(() => {
        this.allcustomers.splice(i, 1);
        this.toastr.warning('Customer Deleted!', 'Deleted!');
      }).catch((err) => console.log(err));
    }
  }

  get_customers() {
    this.allcustomers.length = 0;
    this.customerService.getAllCustomers().subscribe((res: CustomerModel[]) => {
      console.log(res);
      this.allcustomers = res;
      console.log('All Customers', this.allcustomers);
      this.dtTrigger.next();
    });
  }

  updateCustomer(customer) {
    this.customerService.updateCustomer(this.allcustomers[this.current_customer_index]._id, customer).subscribe(res => {
      this.toastr.info('Customer Updated Successfully!', 'Updated!');
      jQuery('#modal3').modal('hide');
      this.allcustomers.splice(this.current_customer_index, 1, res);
      this.resetForm();
    });
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.customerForm.reset();
    this.initForm();
  }

  resetFrom2() {
    this.customer_type_form.reset();
    this.initForm();
  }

  initForm() {
    this.customerForm = this.formBuilder.group({
      city: ['', Validators.required],
      customer_name: ['', Validators.required],
      is_active: [true, Validators.required],
      notes: [''],
      region: ['', Validators.required],
      sector: ['', Validators.required],
      customer_type: ['', Validators.required],
    });

    this.customer_type_form = this.formBuilder.group({
      is_active: ['', Validators.required],
      customer_type: ['', Validators.required],
      customer_id: ['', Validators.required]
    });
  }

  setFormValue() {
    const customer = this.allcustomers[this.current_customer_index];
    console.log(customer);
    this.customerForm.controls['city'].setValue(customer.city);
  }

  setform2Value(customerType) {
    this.customer_type_form.controls['customer_id'].setValue(customerType.customer_id);
    this.customer_type_form.controls['customer_type'].setValue(customerType.customer_type);
    this.customer_type_form.controls['is_active'].setValue(customerType.is_active);
  }


  public uploadCSV(files: FileList) {
    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.parsedCSV = reader.result;
        // let csv = reader.result;
        // this.extractData(csv)
      };
    }
  }

  checkRegion(region) {
    if (region.region === this.customerForm.get('region').value) {
      console.log(region.region, this.customerForm.get('region').value);
      return true;
    }
    return false;
  }

  checkDistrict(district) {
    if (district.district === this.customerForm.get('district').value) {
      return true;
    }
    return false;
  }

  checkCity(city) {
    if (city.city === this.customerForm.get('city').value) {
      return true;
    }
    return false;
  }

  public extractData() {
    this.uploading = true;
    const lines = this.parsedCSV.split(/\r\n|\n/);
    const result = [];
    const headers: any[] = lines[0].split(',');
    if (
      headers[0] === 'city' && headers[1] === 'is_active' && headers[2] === 'customer_name'
      && headers[3] === 'distirbutor_1_name' && headers[4] === 'distirbutor_2_name' && headers[5] === 'distirbutor_3_name'
      && headers[6] === 'share_1' && headers[7] === 'share_2' && headers[8] === 'share_3' && headers[9] === 'district'
      && headers[10] === 'notes' && headers[11] === 'region' && headers[12] === 'sector' && headers[13] === 'type') {
      for (let i = 1; i < lines.length - 1; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        // currentline[0] = String(currentline[0]);
        // currentline[1] = String(currentline[1]);
        // currentline[2] = String(currentline[2]);
        // currentline[3] = String(currentline[3]);
        // currentline[4] = String(currentline[4]);
        // currentline[5] = String(currentline[5]);
        // currentline[6] = String(currentline[6]);
        // currentline[7] = String(currentline[7]);
        // currentline[8] = String(currentline[8]);
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      this.customerService.importCustomer(result).subscribe(res => {
        setTimeout(() => {
          this.uploading = false;
          console.log(res);
          this.toastr.success('Customers Imported successfully', 'Upload Success');
          jQuery('#modal2').modal('hide');
        }, 1000);
        this.uploading = false;
      });
      // this.newproduct = result;
    } else {
      this.toastr.error('Try Again', 'Upload Failed');
      // this.reset();
      this.uploading = false;
    }
  }

}
