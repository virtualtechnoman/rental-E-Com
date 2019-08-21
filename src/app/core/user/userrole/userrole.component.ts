import { Component, OnInit } from '@angular/core';
import { UserRoleService } from '../shared/userrole.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Subject } from 'rxjs';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-userrole',
  templateUrl: './userrole.component.html',
  styleUrls: ['./userrole.component.scss']
})
export class UserroleComponent implements OnInit {
  jQuery: any;
  allUserRoles: any[] = [];
  currentUserRole: any;
  currentUserroleid: any;
  current_user_index: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  userRoleForm: FormGroup;
  editing: Boolean = false;
  submitted: Boolean = false;
  constructor(private data: UserRoleService, private formBuilder: FormBuilder, private toastr: ToastrService) {

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
      dom: '<html5buttons"B>lTfgitp',
      language: {
        search: '_INPUT_',
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
    this.initForm();
    this.getUserRole();
  }

  get f() { return this.userRoleForm.controls; }

  submit() {
    console.log(this.userRoleForm.value);
    this.submitted = true;
    if (this.userRoleForm.invalid) {
      return;
    }
    this.currentUserRole = this.userRoleForm.value;
    if (this.editing) {
      this.updateUser(this.currentUserRole);
    } else {
      this.AddUserRole(this.currentUserRole);
    }
  }

  AddUserRole(userrole) {
    if(userrole.isAdmin==true){
    userrole.privileges.ADD_NEW_CHALLAN=true
    userrole.privileges.ADD_NEW_DRIVER=true
    userrole.privileges.ADD_NEW_ORDER=true
    userrole.privileges.ADD_NEW_PRODUCT=true
    userrole.privileges.ADD_NEW_RETURN_ORDER=true
    userrole.privileges.ADD_NEW_USER=true
    userrole.privileges.ADD_NEW_VEHICLE=true
    userrole.privileges.DELETE_CHALLAN=true
    userrole.privileges.DELETE_DRIVER=true
    userrole.privileges.DELETE_ORDER=true
    userrole.privileges.DELETE_PRODUCT=true
    userrole.privileges.DELETE_RETURN_ORDER=true
    userrole.privileges.DELETE_USER=true
    userrole.privileges.DELETE_VEHICLE=true
    userrole.privileges.GET_ALL_CHALLAN=true
    userrole.privileges.GET_ALL_DRIVERS=true
    userrole.privileges.GET_ALL_ORDERS=true
    userrole.privileges.GET_ALL_PRODUCTS=true
    userrole.privileges.GET_ALL_RETURN_ORDERS=true
    userrole.privileges.GET_ALL_USERS=true
    userrole.privileges.GET_ALL_VEHICLES=true
    userrole.privileges.GET_CHALLAN=true
    userrole.privileges.GET_ORDER=true
    userrole.privileges.GET_PRODUCT=true
    userrole.privileges.GET_RETURN_ORDER=true
    userrole.privileges.GET_USER_BY_ROLE=true
    userrole.privileges.UPDATE_DRIVER=true
    userrole.privileges.UPDATE_PRODUCT=true
    userrole.privileges.UPDATE_USER=true
    userrole.privileges.UPDATE_VEHICLE=true
    }
    console.log(userrole)
    this.data.addUserRole(userrole).subscribe((data: ResponseModel) => {
      console.log(data);
      jQuery('#userRoleModal').modal('hide');
      this.allUserRoles.push(data.data);
      this.toastr.success('User role Added!', 'Added!');
    });
  }

  deleteUserRole(index) {
    if (confirm('You Sure You Want to Delete this User Role??')) {
      this.data.deleteUserRole(this.allUserRoles[index]._id).subscribe(() => {
        this.toastr.warning('User role Deleted!', 'Deleted!');
        this.allUserRoles.splice(index, 1);
      });
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
    this.data.getAllUserRoles().subscribe((res: ResponseModel) => {
      this.allUserRoles = res.data;
      console.log(res.data)
      this.dtTrigger.next();
    });
  }

  initForm() {
    this.userRoleForm = this.formBuilder.group({
      name: ['', Validators.required],
      isAdmin: [false, Validators.required],
      privileges: this.formBuilder.group({
        GET_ALL_USERS: [false],
        GET_USER_BY_ROLE: [false],
        ADD_NEW_USER: [false],
        DELETE_USER: [false],
        UPDATE_USER: [false],
        GET_ALL_PRODUCTS: [false],
        GET_PRODUCT: [false],
        ADD_NEW_PRODUCT: [false],
        DELETE_PRODUCT: [false],
        UPDATE_PRODUCT: [false],
        GET_ALL_ORDERS: [false],
        GET_ORDER: [false],
        ADD_NEW_ORDER: [false],
        DELETE_ORDER: [false],
        GET_ALL_RETURN_ORDERS: [false],
        GET_RETURN_ORDER: [false],
        ADD_NEW_RETURN_ORDER: [false],
        DELETE_RETURN_ORDER: [false],
        GET_ALL_CHALLAN: [false],
        GET_CHALLAN: [false],
        ADD_NEW_CHALLAN: [false],
        DELETE_CHALLAN: [false],
        GET_ALL_VEHICLES: [false],
        DELETE_VEHICLE: [false],
        UPDATE_VEHICLE: [false],
        ADD_NEW_VEHICLE: [false],
        GET_ALL_DRIVERS: [false],
        DELETE_DRIVER: [false],
        UPDATE_DRIVER: [false],
        ADD_NEW_DRIVER: [false]
      })
    });
  }


  updateUser(user) {
    user.id = this.allUserRoles[this.current_user_index]._id;
    this.data.updateUserRole(this.allUserRoles[this.current_user_index]._id, user).subscribe(res => {
      jQuery('#userRoleModal').modal('hide');
      console.log(res);
      this.allUserRoles.splice(this.current_user_index, 1, res);
      this.toastr.info('User role Updated!', 'Updated!');
      this.resetForm();
    });
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.userRoleForm.reset();
    this.initForm();
  }

  setFormValue() {
    const user = this.allUserRoles[this.current_user_index];
    this.userRoleForm.get('name').setValue(user.name);
    this.userRoleForm.get('isAdmin').setValue(user.isAdmin);
    this.userRoleForm.controls['privileges'].get('GET_ALL_USERS').setValue(user.privileges.GET_ALL_USERS);
    this.userRoleForm.controls['privileges'].get('GET_USER_BY_ROLE').setValue(user.privileges.GET_USER_BY_ROLE);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_USER').setValue(user.privileges.ADD_NEW_USER);
    this.userRoleForm.controls['privileges'].get('DELETE_USER').setValue(user.privileges.DELETE_USER);
    this.userRoleForm.controls['privileges'].get('UPDATE_USER').setValue(user.privileges.UPDATE_USER);
    this.userRoleForm.controls['privileges'].get('GET_ALL_PRODUCTS').setValue(user.privileges.GET_ALL_PRODUCTS);
    this.userRoleForm.controls['privileges'].get('GET_PRODUCT').setValue(user.privileges.GET_PRODUCT);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_PRODUCT').setValue(user.privileges.ADD_NEW_PRODUCT);
    this.userRoleForm.controls['privileges'].get('DELETE_PRODUCT').setValue(user.privileges.DELETE_PRODUCT);
    this.userRoleForm.controls['privileges'].get('UPDATE_PRODUCT').setValue(user.privileges.UPDATE_PRODUCT);
    this.userRoleForm.controls['privileges'].get('GET_ALL_ORDERS').setValue(user.privileges.GET_ALL_ORDERS);
    this.userRoleForm.controls['privileges'].get('GET_ORDER').setValue(user.privileges.GET_ORDER);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_ORDER').setValue(user.privileges.ADD_NEW_ORDER);
    this.userRoleForm.controls['privileges'].get('DELETE_ORDER').setValue(user.privileges.DELETE_ORDER);
    this.userRoleForm.controls['privileges'].get('GET_ALL_RETURN_ORDERS').setValue(user.privileges.GET_ALL_RETURN_ORDERS);
    this.userRoleForm.controls['privileges'].get('GET_RETURN_ORDER').setValue(user.privileges.GET_RETURN_ORDER);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_RETURN_ORDER').setValue(user.privileges.ADD_NEW_RETURN_ORDER);
    this.userRoleForm.controls['privileges'].get('DELETE_RETURN_ORDER').setValue(user.privileges.DELETE_RETURN_ORDER);
    this.userRoleForm.controls['privileges'].get('GET_ALL_CHALLAN').setValue(user.privileges.GET_ALL_CHALLAN);
    this.userRoleForm.controls['privileges'].get('GET_CHALLAN').setValue(user.privileges.GET_CHALLAN);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_CHALLAN').setValue(user.privileges.ADD_NEW_CHALLAN);
    this.userRoleForm.controls['privileges'].get('DELETE_CHALLAN').setValue(user.privileges.DELETE_CHALLAN);
  }

}
