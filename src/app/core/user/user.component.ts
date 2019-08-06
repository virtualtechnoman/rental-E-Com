import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from './shared/user-service.service';
import { UserModel, UserRoleModel } from './shared/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from "jquery";
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
  id = "EMP" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second()

  allTherapies: any[] = [];
  allTherayId: any[] = [];
  allUsers: any[] = [];
  CSV: File = null;
  confirmPassword: any = '';
  currentUser: UserModel;
  currentUserId: string;
  currentIndex: number;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  editing: boolean = false;
  jQuery: any;
  maxDate = new Date().toISOString().substring(0, 10);
  parsedCSV;
  passwordMatched: boolean = false;
  showPassword: boolean = false;
  submitted: boolean = false;
  selectedUserRole: UserRoleModel;
  userForm: FormGroup;
  allUserRoles: any[] = [];
  userRole;
  uploading: boolean = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder,
    private UserroleService: UserRoleService, private toastr: ToastrService, private activatedRoute: ActivatedRoute) {
    this.initForm();
    this.userService.getAllUsers().subscribe((res: ResponseModel) => {
      if (res.error) {
        this.toastr.warning('No Data Available', res.error)
      } else {
        console.log(res)
        this.allUsers = res.data;
      }
    })
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
      // dom: '<"html5buttons"B>lTfgitp',
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      dom: 'Bfrtip',
      buttons: [
        // 'colvis',
        'copy',
        'print',
        'excel',
      ]
    };

    this.UserroleService.getAllUserRoles().subscribe((res: any[]) => {
      this.allUserRoles = res
    })

  }

  get f() { return this.userForm.controls; }

  submit() {
    console.log("USER FORM VALUES ====>>>", this.userForm.value)
    this.submitted = true;
    if (this.userForm.invalid && !this.passwordMatched) {
      return;
    }
    this.currentUser = this.userForm.value;
    if (this.editing) {
      this.updateUser(this.currentUser)
    } else {
      this.addUser(this.currentUser);
    }
  }

  addUser(user) {
    try {
      this.userService.addUser(user).subscribe((res) => {
        console.log(res);
        jQuery("#modal3").modal("hide");
        this.toastr.success('User Added!', 'Success!');
        this.allUsers.push(res);
        this.resetForm();
      })
    } catch (error) {
      console.log(error)
    }

  }

  editUser(i) {
    this.editing = true;
    this.currentUser = this.allUsers[i];
    this.currentIndex = i;
    this.setFormValue(this.currentUser);
  }

  deleteUser(i) {
    if (confirm("You Sure you want to delete this user")) {
      this.userService.deleteUser(this.allUsers[i]._id).toPromise().then(() => {
        this.toastr.warning('User Deleted!', 'Deleted!');
        this.allUsers.splice(i, 1)
      }).catch((err) => console.log(err))
    }
  }

  updateUser(user) {
    this.userService.updateUser(this.allUsers[this.currentIndex]._id, user).subscribe(res => {
      jQuery("#modal3").modal("hide");
      console.log("UPDATED USER VALUE")
      console.log(res)
      this.allUsers.splice(this.currentIndex, 1, res);
      this.toastr.info('Therapy Updated Successfully!', 'Updated!!');
      this.resetForm();
    })
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      full_name: ['', Validators.required],
      email: ['', Validators.required],
      is_active: [true, Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      mobile_number: ['', Validators.required],
    })
  }

  resetForm() {
    this.submitted = false;
    this.editing = false;
    this.userForm.reset();
    this.initForm();
  }

  setFormValue(user) {
    this.userForm.controls['email'].setValue(user.email);
    this.userForm.controls['full_name'].setValue(user.full_name);
    this.userForm.controls['password'].setValue(user.password);
    this.userForm.controls['role'].setValue(user.role);
    this.userForm.controls['is_active'].setValue(user.is_active);
    this.userForm.controls['mobile_number'].setValue(user.mobile_number);
  }

  getUserbyRole() {
    console.log(this.selectedUserRole)
    this.userService.getUserByRole(this.selectedUserRole._id).subscribe((res: ResponseModel) => {
      if (res.error) {
        this.toastr.warning('No Data Available', res.error)
      } else {
        this.allUsers = res.data;
        console.log(res)
        console.log("Data from client to server", this.allUsers);
        this.dtTrigger.next();
      }
    })
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
    var headers: any[] = lines[0].split(",");
    if (headers[0] == "first_name" && headers[1] == "last_name" && headers[2] == "email" && headers[3] == "password"
      && headers[4] == "joining_date" && headers[5] == "job_title" && headers[6] == "is_active" && headers[7] == "therapy_line_id"
      && headers[8] == "manager_id" && headers[9] == "position" && headers[10] == "title" && headers[11] == "mobile_phone"
      && headers[12] == "home_phone" && headers[13] == "business_phone" && headers[14] == "business_extension" && headers[15] == "region"
      && headers[16] == "city" && headers[17] == "district" && headers[18] == "address" && headers[19] == "postal_code"
      && headers[20] == "notes"
    ) {
      for (var i = 1; i < lines.length - 1; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
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
          jQuery("#modal2").modal("hide");
          this.uploading = false;
          // this.all_bu.push(res);
        }, 1000);
      });
      // this.newproduct = result;
    }
    else {
      this.toastr.error('Try Again ', 'Upload Failed')
      setTimeout(() => {
        this.uploading = false;
      }, 1000);
      // this.reset();
    }
  }

  checkRegion(region) {
    if (region.region_name == this.userForm.get('region').value) {
      return true;
    }
    return false
  }

  checkDistrict(district) {
    if (district.district_name == this.userForm.get('district').value) {
      return true;
    }
    return false
  }

  checkCity(city) {
    if (city.city_name == this.userForm.get('city').value) {
      return true;
    }
    return false
  }

  checkPassword() {
    console.log(this.confirmPassword)
    if (this.confirmPassword != this.userForm.get('password').value) {
      this.passwordMatched = false;
      console.log("TRUE")
      return true;
    } else {
      this.passwordMatched = true;
      return false
    };
  }

  togglePassword() {
    var x = <HTMLInputElement>document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}


