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
  admin: Boolean = false;
  allTherapies: any[] = [];
  allTherayId: any[] = [];
  allUsers: any[] = [];
  allUsers2: any[] = [];
  allUsers3: any[] = [];
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
  viewArray: any = [];
  fullTable: Boolean = true;
  registerForm: FormGroup;
  newArray:any[]=[];
  fileSelected;
  keyProfileImage:any;
  urlProfileImage:any;
  showLicenceField:boolean=false;
  licenseInformation:any;
  showImage:boolean=false;
  image:any;
  selectedGender:any;
  constructor(private userService: UserService, private formBuilder: FormBuilder,
    private UserroleService: UserRoleService, private toastr: ToastrService, private activatedRoute: ActivatedRoute) {
    this.initForm();
    this.getAllUsers();
    this.getUserRoles();
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
      email: ['', Validators.required],
      is_active: [true, Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      mobile_number: ['', Validators.required],
      landmark: ['', Validators.required],
      street_address: ['', Validators.required],
      city: ['', Validators.required],
      profile_picture:[""],
      dl_number:[""],
      dob:['',Validators.required],
      gender:['']
    });
  }

  selectGender(event){
    console.log(event)
    if(event.target.value=="male"){
      this.selectedGender="male"
      this.registerForm.value.gender="male"
    }
    else {
      this.selectedGender="female"
      this.registerForm.value.gender="female"
    }
    console.log(this.registerForm.value)
  }

  driverField(event:any){
    console.log(event)
    var driver=event.target.value.substring(0,1)
    console.log(driver)
    if(driver==5){
      this.showLicenceField=true;
    }
    else{
      this.showLicenceField=false
    }
  }

  get f() { return this.registerForm.controls; }

  licenseNumber(event:any){
    this.licenseInformation=event.target.value;

  }
  selectFile(event:any){
    this.fileSelected=event.target.files[0];
    console.log(this.fileSelected)
  }

  onSubmit() {
    this.submitted = true;
    this.registerForm.value.gender=this.selectedGender
    console.log(this.registerForm.value)
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    
    
    if(this.showLicenceField==true){
      this.registerForm.value.dl_number=this.licenseInformation;
    }
    if(this.showLicenceField==false){
      delete this.registerForm.value.dl_number;
    }

    console.log(this.registerForm.value)
    // if(this.registerForm.value.profile_picture==null || this.registerForm.value.profile_picture==""){
    //   this.registerForm.value.profile_picture==""
    // }
    if(this.fileSelected){
      this.userService.getUrl().subscribe((res:ResponseModel)=>{
        this.keyProfileImage=res.data.key;
        this.urlProfileImage=res.data.url;
          
      if(this.urlProfileImage){
        this.userService.sendUrl(this.urlProfileImage,this.fileSelected).then(resp=>{
          if(resp.status == 200 ){
            this.registerForm.value.profile_picture=this.keyProfileImage;
            
            console.log(this.registerForm.value)  
            this.addUser(this.registerForm.value);
          }
        })
      }
      })
    }else{
      delete this.registerForm.value.profile_picture;
      this.addUser(this.registerForm.value);
    }

    }





  addUser(user) {
    console.log(user);
      this.userService.addUser(user).subscribe((res: ResponseModel) => {
        console.log(res);
        jQuery('#modal3').modal('hide');
        this.toastr.success('User Added!', 'Success!');
        this.allUsers.push(res.data);
        this.resetForm();
        console.log(res.data)
      });
    

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

  viewUser(i) {
    this.viewArray = this.allUsers[i];
    if(this.viewArray.profile_picture){
      this.showImage=true;
      this.image="https://binsar.s3.ap-south-1.amazonaws.com/" + this.viewArray.profile_picture
      console.log(this.image)
        }
    else{
      this.showImage=false;
    }
    console.log(this.allUsers[i]);
  }

  updateUser(user) {
    console.log(user, this.allUsers[this.currentIndex]._id);
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
    this.registerForm.reset();
    this.initForm();  
  }

  getUserRoles() {
    this.UserroleService.getAllUserRoles().subscribe((res: ResponseModel) => {
      this.allUserRoles = res.data;
      console.log(this.allUserRoles);
    });
  }

  setFormValue(user) {
    console.log(user);
    if (user.role._id === '5d5692a8d542231cd89861cc') {
      this.userForm.controls['email'].setValue(user.email);
      this.userForm.controls['full_name'].setValue(user.full_name);
      this.userForm.controls['password'].setValue(user.password);
      this.userForm.controls['role'].setValue(user.role._id);
      this.userForm.controls['is_active'].setValue(user.is_active);
      this.userForm.controls['mobile_number'].setValue(user.mobile_number);
    }
    if (user.role._id === '5d5692a8d542231cd89861cd') {
      const dob = user.dob.substring(0, 10);
      this.registerForm.controls['city'].setValue(user.city);
      this.registerForm.controls['mobile_number'].setValue(user.mobile_number);
      this.registerForm.controls['full_name'].setValue(user.full_name);
      this.registerForm.controls['dob'].setValue(dob);
      this.registerForm.controls['landmark'].setValue(user.landmark);
      this.registerForm.controls['street_address'].setValue(user.street_address);
    }
  }

  getAllUsers() {
    this.allUsers.length = 0;
    this.userService.getAllUsers().subscribe((res: any) => {
      console.log('userResposne', res);
      if (res.error) {
        this.toastr.warning('No Data Available', res.error);
      } else {
        console.log(res.data);
        this.allUsers = res.data;
        this.allUsers2=res.data;
        this.allUsers2=res.data;
        this.dtTrigger.next();
      }
    });
  }

  getUserbyRole(event:any) {
    console.log(event)
    if(event.target.selectedIndex==1){

      this.allUsers.length=0;
      var arr=[]
      arr.push(this.allUsers2);
      this.allUsers=arr[0]
      console.log(arr,this.allUsers)
    }else {
    this.newArray.length=0;
    console.log(this.newArray)
    for(var i=0;i<this.allUsers2.length;i++){
      if(this.allUsers2[i].role){
      if(this.allUsers2[i].role.name){
      if(this.allUsers2[i].role.name==event.target.value){
        this.newArray.push(this.allUsers2[i])
      }
    }
  }
}
    }
    if(event.target.selectedIndex!=1){
this.me(this.newArray)
    }
  // console.log(this.newArray)
  // this.allUsers.length=0;
  // if(this.newArray.length>0){
  //   for(var i=0;i<this.newArray.length;i++){
  //     this.allUsers[i]=this.newArray[i]
  //   }
  // }

  // this.allUsers.length=0;
  // this.allUsers.push(this.newArray)
  // console.log(this.allUsers)
    
  
    // if (!this.selectedUserRole) {
    //   this.getAllUsers();
    // } else {
    //   this.userService.getUserByRole(this.selectedUserRole._id).subscribe((res: ResponseModel) => {
    //     if (res.error) {
    //       this.toastr.warning('No User Available with this role', 'Error');
    //     } else {
    //       this.allUsers = res.data;
    //     }
    //   });
    // }
  }

  me(array){
    console.log(array)
    var arra2=[];
    for(var i=0;i<array.length;i++){
      arra2[i]=array[i]
    }
    this.allUsers.length=0
    this.allUsers=arra2;
    this.dtTrigger.next();
    console.log(arra2,this.allUsers)
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

  public extractData() {
    this.uploading = true;
    const lines = this.parsedCSV.split(/\r\n|\n/);
    const result = [];
    const headers: any[] = lines[0].split(',');
    if (headers[0] === 'first_name' && headers[1] === 'last_name' && headers[2] === 'email' && headers[3] === 'password'
      && headers[4] === 'joining_date' && headers[5] === 'job_title' && headers[6] === 'is_active' && headers[7] === 'therapy_line_id'
      && headers[8] === 'manager_id' && headers[9] === 'position' && headers[10] === 'title'
      && headers[11] === 'mobile_phone' && headers[12] === 'home_phone' && headers[13] === 'business_phone'
      && headers[14] === 'business_extension' && headers[15] === 'region' && headers[16] === 'city'
      && headers[17] === 'district' && headers[18] === 'address' && headers[19] === 'postal_code' && headers[20] === 'notes'
    ) {
      for (let i = 1; i < lines.length - 1; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
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
        for (let j = 0; j < headers.length; j++) {
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
      this.toastr.error('Try Again ', 'Upload Failed');
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
    if (this.confirmPassword !== this.registerForm.get('password').value) {
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
    console.log(x);
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

  selectRole(event: any) {
    console.log(event);
    this.userForm.controls['role'].setValue(this.allUserRoles[event.target.selectedIndex - 1]._id);
    console.log(this.userForm);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}


