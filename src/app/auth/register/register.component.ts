import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors, FormBuilder } from '@angular/forms';


import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit {

  city : any[]=["Delhi", "Noida", "Gurgoan", "Benglore"];
  district: any[]=["Dist1", "Dist2", "Dist3"];
  region: any[]=["South", "East", "West", "North"];
  title: any[]=["Mr.","Ms.","Mrs."]
  userRoles: any[] = [
    "Country Manager", "Business Unit Director (BUD)", "Regional Sales Manager", "First Line Manage (FLM)", "Representative (Rep)", "Commercial Excellence Director", "Key Account Manager", "Finance Manager", "HR Manager", "Supply Chain Manager"
  ];
  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  passwordsMatchValidator(control: FormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

  userForm = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator])
  })

  get fullname(): any { return this.userForm.get('fullname'); }
  get email(): any { return this.userForm.get('email'); }
  get password(): any { return this.userForm.get('password'); }
  get repeatPassword(): any { return this.userForm.get('repeatPassword'); }

  // register() {
  //   if(!this.userForm.valid) return
  //   let { fullname, email, password, repeatPassword } = this.userForm.getRawValue();
  //   this.authService.register(fullname, email, password, repeatPassword)
  //   .subscribe(data => {
  //     // this.router.navigate(['']);
  //     console.log("USER ADDED")
  //   })
  // }

  submit() {
    const user = this.userForm.value;
    console.log(user)
    this.authService.register(user).subscribe(res => {
      console.log(res);
      console.log(user)
    })
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      employee_id: ['001', Validators.required],
      first_name: ['Admin', Validators.required],
      last_name: ['example', Validators.required],
      email: ['admin@example.com', Validators.required],
      // is_active: ['true', Validators.required],
      joining_date: new Date(),
      password: ['asd123', Validators.required],
      therapy_line: ['therapy', Validators.required],
      therapy_line_id: ['th1', Validators.required],
      manager_id: ['mg001', Validators.required],
      position: ['admin', Validators.required],
      title: ['Mr', Validators.required],
      mobile_phone: ['9999999999', Validators.required],
      home_phone: ['9999999999', Validators.required],
      business_phone: ['9999999999', Validators.required],
      business_extension: ['+23', Validators.required],
      region: ['North', Validators.required],
      city: ['New Delhi', Validators.required],
      district: ['Delhi', Validators.required],
      address: ['Long Address here', Validators.required],
      postal_code: ['110022', Validators.required],
      notes: ['NOne ', Validators.required],
      photo: ['', Validators.required],
      attachments: ['', Validators.required],
      // repeatPassword: ['', Validators.required],
    })
  }

}
