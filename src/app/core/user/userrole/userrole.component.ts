import { Component, OnInit } from '@angular/core';
import { UserRoleService } from '../shared/userrole.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-userrole',
  templateUrl: './userrole.component.html',
  styleUrls: ['./userrole.component.scss']
})
export class UserroleComponent implements OnInit {
  jQuery: any;
  allUserRoles: any[] = [];
  can_access_bu: boolean = false;
  can_access_company: boolean = false;
  can_access_country: boolean = false;
  can_access_customer: boolean = false;
  can_access_district: boolean = false;
  can_access_region: boolean = false;
  can_access_therapy: boolean = false;
  can_access_users: boolean = false;
  can_access_city: boolean = false;
  currentUserRole: any;
  currentUserroleid: any;
  current_user_index: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  userRoleForm: FormGroup;
  editing: boolean = false;
  submitted: boolean = false;
  constructor(private data: UserRoleService, private formBuilder: FormBuilder, private toastr: ToastrService) {

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
    this.initForm();
    this.getUserRole();
  }

  AddUserRole(userrole) {
    this.data.addUserRole(userrole).subscribe(data => {
      console.log("ADDED")
        jQuery("#userRoleModal").modal("hide");
        this.allUserRoles.push(data);
        this.toastr.success('User role Added!', 'Added!');
      })
  }

  deleteUser(index) {
    if (confirm("You Sure You Want to Delete this USer??")) {
      this.data.deleteUserRole(this.allUserRoles[index]._id).subscribe(() => {
        this.toastr.warning('User role Deleted!', 'Deleted!');
        this.allUserRoles.splice(index, 1);
      })
    }
  }

  get f() { return this.userRoleForm.controls; }

  submit() {
    console.log("SUBMITED")
    this.submitted = true;
    if (this.userRoleForm.invalid) {
      debugger
      return;
    }
    this.currentUserRole = this.userRoleForm.value;
    if (this.editing) {
      debugger
      this.updateUser(this.currentUserRole)
    } else {
      debugger
      this.AddUserRole(this.currentUserRole);
    }
  }

  editUserRole(i) {
    this.editing = true;
    this.currentUserRole = this.allUserRoles[i];
    this.currentUserroleid = this.allUserRoles[i]._id;
    this.current_user_index = i;
    this.setFormValue();
  }

  getUserRole() {
    this.allUserRoles.length = 0;
    this.data.getAllUserRoles().subscribe((res: any[]) => {
      this.allUserRoles = res;
      this.dtTrigger.next();
    })
  }

  initForm() {
    this.userRoleForm = this.formBuilder.group({
      user_role: ['', Validators.required],
      can_access_bu: [false],
      can_access_city: [false],
      can_access_country: [false],
      can_access_customer: [false],
      can_access_customer_type: [false],
      can_access_distirbutor: [false],
      can_access_district: [false],
      can_access_g2n: [false],
      can_access_inventory: [false],
      can_access_incentive_period: [false],
      can_access_incentive_share: [false],
      can_access_products: [false],
      can_access_region: [false],
      can_access_reports: [false],
      can_access_sales: [false],
      can_access_target_setting: [false],
      can_access_target_forecasting: [false],
      can_access_therapy: [false],
      can_access_users: [false],
      can_access_user_role: [false],
    })
  }


  updateUser(user) {
    debugger
    this.data.updateUserRole(this.allUserRoles[this.current_user_index]._id, user).subscribe(res => {
      debugger
      jQuery("#userRoleModal").modal("hide");
      console.log(res)
      this.allUserRoles.splice(this.current_user_index, 1, res)
      this.toastr.info('User role Updated!', 'Updated!');
      this.resetForm();
    })
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.userRoleForm.reset();
    this.initForm();
  }

  setFormValue() {
    var user = this.allUserRoles[this.current_user_index];
    this.userRoleForm.get('user_role').setValue(user.user_role);
    this.userRoleForm.get('can_access_bu').setValue(user.can_access_bu);
    this.userRoleForm.get('can_access_city').setValue(user.can_access_city);
    this.userRoleForm.get('can_access_country').setValue(user.can_access_country);
    this.userRoleForm.get('can_access_customer').setValue(user.can_access_customer);
    this.userRoleForm.get('can_access_customer_type').setValue(user.can_access_customer_type);
    // this.userRoleForm.controls['can_access_customer_assignment'].setValue(user.can_access_customer_assignment);
    this.userRoleForm.get('can_access_distirbutor').setValue(user.can_access_distirbutor);
    this.userRoleForm.get('can_access_district').setValue(user.can_access_district);
    this.userRoleForm.get('can_access_g2n').setValue(user.can_access_g2n);
    this.userRoleForm.get('can_access_inventory').setValue(user.can_access_inventory);
    this.userRoleForm.get('can_access_incentive_period').setValue(user.can_access_incentive_period);
    this.userRoleForm.get('can_access_incentive_share').setValue(user.can_access_incentive_share);
    this.userRoleForm.get('can_access_products').setValue(user.can_access_products);
    this.userRoleForm.get('can_access_region').setValue(user.can_access_region);
    this.userRoleForm.get('can_access_reports').setValue(user.can_access_reports);
    this.userRoleForm.get('can_access_sales').setValue(user.can_access_sales);
    this.userRoleForm.get('can_access_therapy').setValue(user.can_access_therapy);
    this.userRoleForm.get('can_access_target_setting').setValue(user.can_access_target_setting);
    this.userRoleForm.get('can_access_target_forecasting').setValue(user.can_access_target_forecasting);
    this.userRoleForm.get('can_access_therapy').setValue(user.can_access_therapy);
    this.userRoleForm.get('can_access_users').setValue(user.can_access_users);
    this.userRoleForm.get('can_access_user_role').setValue(user.can_access_user_role);
  }

}
