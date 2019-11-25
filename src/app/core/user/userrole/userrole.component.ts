import { Component, OnInit } from '@angular/core';
import { UserRoleService } from '../shared/userrole.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Subject } from 'rxjs';
import { ResponseModel } from '../../../shared/shared.model';
import { Title } from '@angular/platform-browser';

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
  isAdmin: Boolean = false;
  constructor(
    private userRoleService: UserRoleService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private titleService: Title) {
    this.titleService.setTitle('User Role Management');

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
    console.log(this.isAdmin);
    this.submitted = true;
    console.log(this.userRoleForm.invalid);
    if (this.editing) { delete this.userRoleForm.value.isAdmin; }
    if (this.userRoleForm.invalid) { return; }
    console.log(this.userRoleForm.invalid);
    if (this.editing) {
      this.updateUser(this.userRoleForm.value);
    } else {
      this.AddUserRole(this.userRoleForm.value);
    }
  }

  AddUserRole(userrole) {
    if (userrole.isAdmin === true) {
      userrole.privileges.ADD_NEW_CHALLAN = true;
      userrole.privileges.ADD_NEW_DRIVER = true;
      userrole.privileges.ADD_NEW_ORDER = true;
      userrole.privileges.ADD_NEW_PRODUCT = true;
      userrole.privileges.ADD_NEW_RETURN_ORDER = true;
      userrole.privileges.ADD_NEW_USER = true;
      userrole.privileges.ADD_NEW_VEHICLE = true;
      userrole.privileges.DELETE_CHALLAN = true;
      userrole.privileges.DELETE_DRIVER = true;
      userrole.privileges.DELETE_ORDER = true;
      userrole.privileges.DELETE_PRODUCT = true;
      userrole.privileges.DELETE_RETURN_ORDER = true;
      userrole.privileges.DELETE_USER = true;
      userrole.privileges.DELETE_VEHICLE = true;
      userrole.privileges.GET_ALL_CHALLAN = true;
      userrole.privileges.GET_ALL_DRIVERS = true;
      userrole.privileges.GET_ALL_ORDERS = true;
      userrole.privileges.GET_ALL_PRODUCTS = true;
      userrole.privileges.GET_ALL_RETURN_ORDERS = true;
      userrole.privileges.GET_ALL_USERS = true;
      userrole.privileges.GET_ALL_VEHICLES = true;
      userrole.privileges.GET_CHALLAN = true;
      userrole.privileges.GET_ORDER = true;
      userrole.privileges.GET_PRODUCT = true;
      userrole.privileges.GET_RETURN_ORDER = true;
      userrole.privileges.GET_USER_BY_ROLE = true;
      userrole.privileges.UPDATE_DRIVER = true;
      userrole.privileges.UPDATE_PRODUCT = true;
      userrole.privileges.UPDATE_USER = true;
      userrole.privileges.UPDATE_VEHICLE = true;
      userrole.privileges.GET_ALL_EVENTS = true;
      userrole.privileges.ADD_NEW_EVENT = true;
      userrole.privileges.CANCEL_EVENT = true;
      userrole.privileges.UPDATE_EVENT = true;
      userrole.privileges.DELETE_EVENT = true;
      userrole.privileges.GET_ALL_EVENT_LEADS = true;
      userrole.privileges.ADD_NEW_EVENT_LEAD = true;
      userrole.privileges.GET_ALL_EVENT_TYPES = true;
      userrole.privileges.ADD_NEW_EVENT_TYPE = true;
      userrole.privileges.UPDATE_EVENT_TYPE = true;
      userrole.privileges.DELETE_EVENT_TYPE = true;
      userrole.privileges.GET_ALL_EVENT_ORGANIZERS = true;
      userrole.privileges.ADD_NEW_EVENT_ORGANIZER = true;
      userrole.privileges.UPDATE_EVENT_ORGANIZER = true;
      userrole.privileges.DELETE_EVENT_ORGANIZER = true;
      userrole.privileges.GET_ALL_EVENT_LEAD_SOURCES = true;
      userrole.privileges.ADD_NEW_EVENT_LEAD_SOURCES = true;
      userrole.privileges.UPDATE_EVENT_LEAD_SOURCES = true;
      userrole.privileges.DELETE_EVENT_LEAD_SOURCES = true;
      userrole.privileges.GET_ALL_EVENT_MODES = true;
      userrole.privileges.ADD_NEW_EVENT_MODES = true;
      userrole.privileges.UPDATE_EVENT_MODES = true;
      userrole.privileges.DELETE_EVENT_MODES = true;
    }
    delete userrole.isAdmin;
    console.log(userrole);
    this.userRoleService.addUserRole(userrole).subscribe((res: ResponseModel) => {
      console.log(res.data);
      jQuery('#userRoleModal').modal('hide');
      this.allUserRoles.push(res.data);
      this.toastr.success('User role Added!', 'Added!');
    });
  }

  deleteUserRole(index) {
    if (confirm('You Sure You Want to Delete this User Role??')) {
      this.userRoleService.deleteUserRole(this.allUserRoles[index]._id).subscribe(() => {
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
    this.userRoleService.getAllUserRoles().subscribe((res: ResponseModel) => {
      this.allUserRoles = res.data;
      console.log(res.data);
      this.dtTrigger.next();
    });
  }

  initForm() {
    this.userRoleForm = this.formBuilder.group({
      name: ['', Validators.required],
      isAdmin: [false],
      privileges: this.formBuilder.group({
        // USERS
        GET_ALL_USERS: [false],
        GET_USER_BY_ROLE: [false],
        ADD_NEW_USER: [false],
        DELETE_USER: [false],
        UPDATE_USER: [false],
        // PRODUCTS
        GET_ALL_PRODUCTS: [false],
        GET_PRODUCT: [false],
        ADD_NEW_PRODUCT: [false],
        DELETE_PRODUCT: [false],
        UPDATE_PRODUCT: [false],
        // ORDERS
        GET_ALL_ORDERS: [false],
        GET_ORDER: [false],
        ADD_NEW_ORDER: [false],
        DELETE_ORDER: [false],
        // PRODUCTS CATEGORY
        GET_ALL_PRODUCT_CATEGORY: [false],
        GET_PRODUCT_CATEGORY: [false],
        ADD_NEW_PRODUCT_CATEGORY: [false],
        UPDATE_PRODUCT_CATEGORY: [false],
        DELETE_PRODUCT_CATEGORY: [false],
        // BRAND
        GET_ALL_BRANDS: [false],
        DELETE_BRAND: [false],
        UPDATE_BRAND: [false],
        ADD_NEW_BRAND: [false],
        // CUSTOMER
        GET_ALL_CUSTOMERS: [false],
        UPDATE_CUSTOMER: [false],
        ADD_NEW_CUSTOMER: [false],
        DELETE_CUSTOMER: [false],
        // GET_ALL_RETURN_ORDERS: [false],
        // GET_RETURN_ORDER: [false],
        // ADD_NEW_RETURN_ORDER: [false],
        // DELETE_RETURN_ORDER: [false],
        // GET_ALL_CHALLAN: [false],
        // GET_CHALLAN: [false],
        // ADD_NEW_CHALLAN: [false],
        // DELETE_CHALLAN: [false],
        // GET_ALL_VEHICLES: [false],
        // DELETE_VEHICLE: [false],
        // UPDATE_VEHICLE: [false],
        // ADD_NEW_VEHICLE: [false],
        // GET_ALL_DRIVERS: [false],
        // DELETE_DRIVER: [false],
        // UPDATE_DRIVER: [false],
        // ADD_NEW_DRIVER: [false],
        // GET_ALL_EVENTS: [false],
        // ADD_NEW_EVENT: [false],
        // CANCEL_EVENT: [false],
        // UPDATE_EVENT: [false],
        // DELETE_EVENT: [false],
        // GET_ALL_EVENT_LEADS: [false],
        // ADD_NEW_EVENT_LEAD: [false],
        // GET_ALL_EVENT_TYPES: [false],
        // ADD_NEW_EVENT_TYPE: [false],
        // UPDATE_EVENT_TYPE: [false],
        // DELETE_EVENT_TYPE: [false],
        // GET_ALL_EVENT_ORGANIZERS: [false],
        // ADD_NEW_EVENT_ORGANIZER: [false],
        // UPDATE_EVENT_ORGANIZER: [false],
        // DELETE_EVENT_ORGANIZER: [false],
        // GET_ALL_EVENT_LEAD_SOURCES: [false],
        // ADD_NEW_EVENT_LEAD_SOURCES: [false],
        // UPDATE_EVENT_LEAD_SOURCES: [false],
        // DELETE_EVENT_LEAD_SOURCES: [false],
        // GET_ALL_EVENT_MODES: [false],
        // ADD_NEW_EVENT_MODES: [false],
        // UPDATE_EVENT_MODES: [false],
        // DELETE_EVENT_MODES: [false],
        // GET_ALL_MARKETING_MATERIALS: [false],
        // ADD_NEW_MARKETING_MATERIAL: [false],
        // UPDATE_MARKETING_MATERIAL: [false],
        // DELETE_MARKETING_MATERIAL: [false],
      })
    });
  }


  updateUser(user) {
    console.log(user);
    this.userRoleService.updateUserRole(this.allUserRoles[this.current_user_index]._id, user).subscribe((res: ResponseModel) => {
      console.log(res);
      jQuery('#userRoleModal').modal('hide');
      this.allUserRoles.splice(this.current_user_index, 1, res.data);
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
    console.log(user);
    // USER
    this.userRoleForm.controls['privileges'].get('GET_ALL_USERS').setValue(user.privileges.GET_ALL_USERS);
    this.userRoleForm.controls['privileges'].get('GET_USER_BY_ROLE').setValue(user.privileges.GET_USER_BY_ROLE);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_USER').setValue(user.privileges.ADD_NEW_USER);
    this.userRoleForm.controls['privileges'].get('DELETE_USER').setValue(user.privileges.DELETE_USER);
    this.userRoleForm.controls['privileges'].get('UPDATE_USER').setValue(user.privileges.UPDATE_USER);
    // PRODUCTS
    this.userRoleForm.controls['privileges'].get('GET_ALL_PRODUCTS').setValue(user.privileges.GET_ALL_PRODUCTS);
    this.userRoleForm.controls['privileges'].get('GET_PRODUCT').setValue(user.privileges.GET_PRODUCT);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_PRODUCT').setValue(user.privileges.ADD_NEW_PRODUCT);
    this.userRoleForm.controls['privileges'].get('DELETE_PRODUCT').setValue(user.privileges.DELETE_PRODUCT);
    this.userRoleForm.controls['privileges'].get('UPDATE_PRODUCT').setValue(user.privileges.UPDATE_PRODUCT);
    // ORDERS
    this.userRoleForm.controls['privileges'].get('GET_ALL_ORDERS').setValue(user.privileges.GET_ALL_ORDERS);
    this.userRoleForm.controls['privileges'].get('GET_ORDER').setValue(user.privileges.GET_ORDER);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_ORDER').setValue(user.privileges.ADD_NEW_ORDER);
    this.userRoleForm.controls['privileges'].get('DELETE_ORDER').setValue(user.privileges.DELETE_ORDER);
    // CUSTOMERS
    this.userRoleForm.controls['privileges'].get('GET_ALL_CUSTOMERS').setValue(user.privileges.GET_ALL_CUSTOMERS);
    this.userRoleForm.controls['privileges'].get('UPDATE_CUSTOMER').setValue(user.privileges.UPDATE_CUSTOMER);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_CUSTOMER').setValue(user.privileges.ADD_NEW_CUSTOMER);
    this.userRoleForm.controls['privileges'].get('DELETE_CUSTOMER').setValue(user.privileges.DELETE_CUSTOMER);
    // BRANDS
    this.userRoleForm.controls['privileges'].get('GET_ALL_BRANDS').setValue(user.privileges.GET_ALL_BRANDS);
    this.userRoleForm.controls['privileges'].get('DELETE_BRAND').setValue(user.privileges.DELETE_BRAND);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_BRAND').setValue(user.privileges.ADD_NEW_BRAND);
    this.userRoleForm.controls['privileges'].get('UPDATE_BRAND').setValue(user.privileges.UPDATE_BRAND);
    // CATEGORY
    this.userRoleForm.controls['privileges'].get('GET_ALL_PRODUCT_CATEGORY').setValue(user.privileges.GET_ALL_PRODUCT_CATEGORY);
    this.userRoleForm.controls['privileges'].get('GET_PRODUCT_CATEGORY').setValue(user.privileges.GET_PRODUCT_CATEGORY);
    this.userRoleForm.controls['privileges'].get('ADD_NEW_PRODUCT_CATEGORY').setValue(user.privileges.ADD_NEW_PRODUCT_CATEGORY);
    this.userRoleForm.controls['privileges'].get('UPDATE_PRODUCT_CATEGORY').setValue(user.privileges.UPDATE_PRODUCT_CATEGORY);
    this.userRoleForm.controls['privileges'].get('DELETE_PRODUCT_CATEGORY').setValue(user.privileges.DELETE_PRODUCT_CATEGORY);
    // this.userRoleForm.controls['privileges'].get('GET_ALL_RETURN_ORDERS').setValue(user.privileges.GET_ALL_RETURN_ORDERS);
    // this.userRoleForm.controls['privileges'].get('GET_RETURN_ORDER').setValue(user.privileges.GET_RETURN_ORDER);
    // this.userRoleForm.controls['privileges'].get('ADD_NEW_RETURN_ORDER').setValue(user.privileges.ADD_NEW_RETURN_ORDER);
    // this.userRoleForm.controls['privileges'].get('DELETE_RETURN_ORDER').setValue(user.privileges.DELETE_RETURN_ORDER);
    // this.userRoleForm.controls['privileges'].get('GET_ALL_CHALLAN').setValue(user.privileges.GET_ALL_CHALLAN);
    // this.userRoleForm.controls['privileges'].get('GET_CHALLAN').setValue(user.privileges.GET_CHALLAN);
    // this.userRoleForm.controls['privileges'].get('ADD_NEW_CHALLAN').setValue(user.privileges.ADD_NEW_CHALLAN);
    // this.userRoleForm.controls['privileges'].get('DELETE_CHALLAN').setValue(user.privileges.DELETE_CHALLAN);
    // this.userRoleForm.controls['privileges'].get('GET_ALL_EVENTS').setValue(user.privileges.GET_ALL_EVENTS);
    // this.userRoleForm.controls['privileges'].get('ADD_NEW_EVENT').setValue(user.privileges.ADD_NEW_EVENT);
    // this.userRoleForm.controls['privileges'].get('CANCEL_EVENT').setValue(user.privileges.CANCEL_EVENT);
    // this.userRoleForm.controls['privileges'].get('UPDATE_EVENT').setValue(user.privileges.UPDATE_EVENT);
    // this.userRoleForm.controls['privileges'].get('DELETE_EVENT').setValue(user.privileges.DELETE_EVENT);
    // this.userRoleForm.controls['privileges'].get('GET_ALL_EVENT_LEADS').setValue(user.privileges.GET_ALL_EVENT_LEADS);
    // this.userRoleForm.controls['privileges'].get('ADD_NEW_EVENT_LEAD').setValue(user.privileges.ADD_NEW_EVENT_LEAD);
    // this.userRoleForm.controls['privileges'].get('GET_ALL_EVENT_TYPES').setValue(user.privileges.GET_ALL_EVENT_TYPES);
    // this.userRoleForm.controls['privileges'].get('ADD_NEW_EVENT_TYPE').setValue(user.privileges.ADD_NEW_EVENT_TYPE);
    // this.userRoleForm.controls['privileges'].get('UPDATE_EVENT_TYPE').setValue(user.privileges.UPDATE_EVENT_TYPE);
    // this.userRoleForm.controls['privileges'].get('DELETE_EVENT_TYPE').setValue(user.privileges.DELETE_EVENT_TYPE);
    // this.userRoleForm.controls['privileges'].get('GET_ALL_EVENT_ORGANIZERS').setValue(user.privileges.GET_ALL_EVENT_ORGANIZERS);
    // this.userRoleForm.controls['privileges'].get('ADD_NEW_EVENT_ORGANIZER').setValue(user.privileges.ADD_NEW_EVENT_ORGANIZER);
    // this.userRoleForm.controls['privileges'].get('UPDATE_EVENT_ORGANIZER').setValue(user.privileges.UPDATE_EVENT_ORGANIZER);
    // this.userRoleForm.controls['privileges'].get('DELETE_EVENT_ORGANIZER').setValue(user.privileges.DELETE_EVENT_ORGANIZER);
    // this.userRoleForm.controls['privileges'].get('GET_ALL_MARKETING_MATERIALS').setValue(user.privileges.GET_ALL_MARKETING_MATERIALS);
    // this.userRoleForm.controls['privileges'].get('ADD_NEW_MARKETING_MATERIAL').setValue(user.privileges.ADD_NEW_MARKETING_MATERIAL);
    // this.userRoleForm.controls['privileges'].get('UPDATE_MARKETING_MATERIAL').setValue(user.privileges.UPDATE_MARKETING_MATERIAL);
    // this.userRoleForm.controls['privileges'].get('DELETE_MARKETING_MATERIAL').setValue(user.privileges.DELETE_MARKETING_MATERIAL);
    // this.userRoleForm.controls['privileges'].get('GET_ALL_EVENT_LEAD_SOURCES').setValue(user.privileges.GET_ALL_EVENT_LEAD_SOURCES);
    // this.userRoleForm.controls['privileges'].get('ADD_NEW_EVENT_LEAD_SOURCES').setValue(user.privileges.ADD_NEW_EVENT_LEAD_SOURCES);
    // this.userRoleForm.controls['privileges'].get('UPDATE_EVENT_LEAD_SOURCES').setValue(user.privileges.UPDATE_EVENT_LEAD_SOURCES);
    // this.userRoleForm.controls['privileges'].get('DELETE_EVENT_LEAD_SOURCES').setValue(user.privileges.DELETE_EVENT_LEAD_SOURCES);
    // this.userRoleForm.controls['privileges'].get('GET_ALL_EVENT_MODES').setValue(user.privileges.GET_ALL_EVENT_MODES);
    // this.userRoleForm.controls['privileges'].get('ADD_NEW_EVENT_MODES').setValue(user.privileges.ADD_NEW_EVENT_MODES);
    // this.userRoleForm.controls['privileges'].get('UPDATE_EVENT_MODES').setValue(user.privileges.UPDATE_EVENT_MODES);
    // this.userRoleForm.controls['privileges'].get('DELETE_EVENT_MODES').setValue(user.privileges.DELETE_EVENT_MODES);
  }


}
