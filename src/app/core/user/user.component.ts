import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from './shared/user-service.service';
import { UserModel, UserRoleModel } from './shared/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { Subject } from 'rxjs';
import { UserRoleService } from './shared/userrole.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ResponseModel } from '../../shared/shared.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  // id = 'EMP' + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second()
  admin:boolean=false
  allTherapies: any[] = [];
  allTherayId: any[] = [];
  allUsers: any[] = [];
  allUserRole: any[] = [];
  CSV: File = null;
  confirmPassword: any = '';
  currentUser: UserModel;
  currentUserId: string;
  currentIndex: number;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: Boolean = false;
  jQuery: any;
  maxDate = new Date().toISOString().substring(0, 10);
  parsedCSV;
  passwordMatched: Boolean = false;
  showPassword: Boolean = false;
  submitted: Boolean = false;
  selectedUserRole: UserRoleModel;
  userForm: FormGroup;
  allUserRoles: any[] = [];
  userRole;
  uploading: Boolean = false;
  viewArray:any=[];
  fullTable:boolean=true;
  registerForm: FormGroup;
  constructor(private userService: UserService, private formBuilder: FormBuilder,
    private UserroleService: UserRoleService, private toastr: ToastrService, private activatedRoute: ActivatedRoute) {
    this.initForm();
    this.getUserRoles();
    this.userService.getAllUsers().subscribe((res: any) => {
      console.log('userResposne', res);
      if (res.error) {
        this.toastr.warning('No Data Available', res.error);
      } else {
        console.log(res.data);
        this.allUsers = res.data;
      }
    });
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
      // dom: '<'html5buttons'B>lTfgitp',
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      },
      dom: 'Bfrtip',
      buttons: [
        // 'colvis',
        'copy',
        'print',
        'excel',
      ]
    };
    this.registerForm = this.formBuilder.group({
      full_name: ['', Validators.required],
      mobile_number: ['', Validators.required],
      landmark: ['', Validators.required],
      street_address: ['', Validators.required ],
      city:['', Validators.required],
      dob:['', Validators.required]
  });
  }

  get f() { return this.userForm.controls; }
  get f2() { return this.registerForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
}
  submit() {
    console.log('USER FORM VALUES ====>>>', this.userForm.value);
    this.submitted = true;
    if (this.userForm.invalid && !this.passwordMatched) {
      return;
    }
    this.currentUser = this.userForm.value;
    if (this.editing) {
      this.updateUser(this.currentUser);
    } else {
      this.addUser(this.currentUser);
    }
  }

  addUser(user) {
    console.log(user)
    try {
      this.userService.addUser(user).subscribe((res:ResponseModel) => {
        console.log(res);
        jQuery('#modal3').modal('hide');
        this.toastr.success('User Added!', 'Success!');
        this.allUsers.push(res.data);
        this.resetForm();
      });
    } catch (error) {
      console.log(error);
    }

  }

  editUser(i) {
    this.editing = true;
    this.currentUser = this.allUsers[i];
    this.currentIndex = i;
    this.setFormValue(this.currentUser);
  }

  deleteUser(i) {
    if (confirm('You Sure you want to delete this user')) {
      this.userService.deleteUser(this.allUsers[i]._id).toPromise().then(() => {
        this.toastr.warning('User Deleted!', 'Deleted!');
        this.allUsers.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  viewUser(i){
    this.viewArray=this.allUsers[i]
    console.log(this.allUsers[i])
  }

  updateUser(user) {
    console.log(user,this.allUsers[this.currentIndex]._id)
    // this.userService.updateUser(this.allUsers[this.currentIndex]._id, user).subscribe(res => {
    //   jQuery('#modal3').modal('hide');
    //   console.log('UPDATED USER VALUE');
    //   console.log(res);
    //   this.allUsers.splice(this.currentIndex, 1, res);
    //   this.toastr.info('Therapy Updated Successfully!', 'Updated!!');
      
    //   this.resetForm();
    //   window.location.reload();
    // })

  }

  initForm() {
    this.userForm = this.formBuilder.group({
      full_name: ['', Validators.required],
      email: ['', Validators.required],
      is_active: [true, Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      mobile_number: ['', Validators.required],
    });
  }

  resetForm() {
    this.submitted = false;
    this.editing = false;
    this.userForm.reset();
    this.initForm();
  }

  getUserRoles() {
    this.UserroleService.getAllUserRoles().subscribe((res: ResponseModel) => {
      this.allUserRoles = res.data;
      console.log(this.allUserRoles)
    });
  }

  setFormValue(user) {
    console.log(user)
    if(user.role._id=='5d5692a8d542231cd89861cc'){
    this.userForm.controls['email'].setValue(user.email);
    this.userForm.controls['full_name'].setValue(user.full_name);
    this.userForm.controls['password'].setValue(user.password);
    this.userForm.controls['role'].setValue(user.role._id);
    this.userForm.controls['is_active'].setValue(user.is_active);
    this.userForm.controls['mobile_number'].setValue(user.mobile_number);
    }
    if(user.role._id=='5d5692a8d542231cd89861cd'){
      var dob= user.dob.substring(0, 10)
    this.registerForm.controls['city'].setValue(user.city);
    this.registerForm.controls['mobile_number'].setValue(user.mobile_number);
    this.registerForm.controls['full_name'].setValue(user.full_name);
    this.registerForm.controls['dob'].setValue(dob);
    this.registerForm.controls['landmark'].setValue(user.landmark);
    this.registerForm.controls['street_address'].setValue(user.street_address);
      }
  }

  getUserbyRole() {
    this.allUsers.length=0
    console.log(this.allUsers)
    console.log(this.selectedUserRole);
    this.userService.getUserByRole(this.selectedUserRole._id).subscribe((res: ResponseModel) => {
      if (res.error) {
        this.toastr.warning('No Data Available', res.error);
      } else {
        this.allUsers = res.data;
        console.log(res)
        console.log('Data from client to server', this.allUsers);
        this.dtTrigger.next();
      }
    });
  }

  public uploadCSV(files: FileList) {
    if (files && files.length > 0) {
      let file: File = files.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.parsedCSV = reader.result;
        // let csv = reader.result;
        // this.extractData(csv)
      }
    }
  }

  public extractData() {
    this.uploading = true;
    var lines = this.parsedCSV.split(/\r\n|\n/);
    var result = [];
    var headers: any[] = lines[0].split(',');
    if (headers[0] == 'first_name' && headers[1] == 'last_name' && headers[2] == 'email' && headers[3] == 'password'
      && headers[4] == 'joining_date' && headers[5] == 'job_title' && headers[6] == 'is_active' && headers[7] == 'therapy_line_id'
      && headers[8] == 'manager_id' && headers[9] == 'position' && headers[10] == 'title' && headers[11] == 'mobile_phone'
      && headers[12] == 'home_phone' && headers[13] == 'business_phone' && headers[14] == 'business_extension' && headers[15] == 'region'
      && headers[16] == 'city' && headers[17] == 'district' && headers[18] == 'address' && headers[19] == 'postal_code'
      && headers[20] == 'notes'
    ) {
      for (var i = 1; i < lines.length - 1; i++) {
        var obj = {};
        var currentline = lines[i].split(',');
        currentline[0] = String(currentline[0]);
        currentline[1] = String(currentline[1]);
        currentline[2] = String(currentline[2]);
        currentline[3] = String(currentline[3]);
        currentline[4] = String(currentline[4]);
        currentline[5] = String(currentline[5]);
        currentline[6] = String(currentline[6]);
        currentline[7] = String(currentline[7]);
        currentline[8] = String(currentline[8]);
        currentline[9] = String(currentline[9]);
        currentline[10] = String(currentline[10]);
        currentline[11] = String(currentline[11]);
        currentline[12] = String(currentline[12]);
        currentline[13] = String(currentline[13]);
        currentline[14] = String(currentline[14]);
        currentline[15] = String(currentline[15]);
        currentline[16] = String(currentline[16]);
        currentline[17] = String(currentline[17]);
        currentline[18] = String(currentline[18]);
        currentline[19] = String(currentline[19]);
        currentline[20] = String(currentline[20]);
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      this.userService.importUser(result).subscribe(res => {
        setTimeout(() => {
          this.uploading = false;
          this.toastr.success('User added successfully', 'Upload Success');
          jQuery('#modal2').modal('hide');
          this.uploading = false;
          // this.all_bu.push(res);
        }, 1000);
      });
      // this.newproduct = result;
    } else {
      this.toastr.error('Try Again ', 'Upload Failed')
      setTimeout(() => {
        this.uploading = false;
      }, 1000);
      // this.reset();
    }
  }

  checkRegion(region) {
    if (region.region_name === this.userForm.get('region').value) {
      return true;
    }
    return false;
  }

  checkDistrict(district) {
    if (district.district_name === this.userForm.get('district').value) {
      return true;
    }
    return false;
  }

  checkCity(city) {
    if (city.city_name === this.userForm.get('city').value) {
      return true;
    }
    return false;
  }

  checkPassword() {
    console.log(this.confirmPassword);
    if (this.confirmPassword !== this.userForm.get('password').value) {
      this.passwordMatched = false;
      console.log('TRUE');
      return true;
    } else {
      this.passwordMatched = true;
      return false;
    }
  }

  togglePassword() {
    const x = <HTMLInputElement>document.getElementById('password');
    console.log(x)
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }
  selectRole(event:any){
    console.log(event)
    this.userForm.controls['role'].setValue(this.allUserRoles[event.target.selectedIndex-1]._id)
    console.log(this.userForm)
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}


