import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomersService } from '../shared/customers.service';
import { ResponseModel } from '../../../shared/shared.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  allCustomersOrders: any[] = [];
  quantityForm: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  selectedOrder: any;
  selectedOrderIndex: number;
  constructor(private customersService: CustomersService, private formBuilder: FormBuilder, private toasterService: ToastrService) {
    this.getAllOrders();
  }

  ngOnInit() {
    this.initQuantityForm();
    this.initDataTable();
  }

  getAllOrders() {
    this.customersService.getAllCustomersOrders().subscribe((res: ResponseModel) => {
      console.log(res.data);
      this.allCustomersOrders = res.data;
      this.dtTrigger.next();
    });
  }

  viewCustomerOrder(i) {
    while (this.quantityFormGetter.length > 0) {
      this.quantityFormGetter.removeAt(0);
    }

    this.selectedOrder = this.allCustomersOrders[i];
    this.selectedOrderIndex = i;
    console.log(this.selectedOrder);
    for (let index = 0; index < this.selectedOrder.products.length; index++) {
      if (this.selectedOrder.products) {
        this.quantityFormGetter.push(this.initItemRows());
        this.quantityFormGetter.controls[index].get('product').setValue(this.selectedOrder.products[index].product._id);
      }
    }
    console.log(this.quantityFormGetter.value);
  }

  initQuantityForm() {
    this.quantityForm = this.formBuilder.group({
      products: this.formBuilder.array([])
    });
  }

  get quantityFormGetter() {
    return this.quantityForm.get('products') as FormArray;
  }

  addNewRow() {
    this.quantityFormGetter.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.quantityFormGetter.removeAt(index);
  }

  initItemRows() {
    return this.formBuilder.group({
      product: [''],
      accepted: ['']
    });
  }

  initDataTable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [10, 15, 25, -1],
        [10, 15, 25, 'All']
      ],
      destroy: true,
      retrive: true,
      // dom: '<"html5buttons"B>lTfgitp',
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      }, initComplete: function (settings, json) {
        $('.button').removeClass('dt-button');
      },
      dom: "l <'bottom'B> f r t i p",
      // dom:"B<'#colvis row'><'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>",
      buttons: [
        {
          text: 'Excel',
          extend: 'excel',
          className: 'table-button btn btn-sm button btn-danger '
        },
        {
          extend: 'print',
          text: 'Print',
          className: 'table-button btn-sm button btn btn-danger '
        },
        {
          extend: 'pdf',
          text: 'PDF',
          className: 'table-button btn-sm button btn btn-danger '
        }
      ]
    };
  }

  acceptOrder() {
    const product = { products: this.quantityForm.value };
    console.log(product);
    this.customersService.acceptCustomerOrder(this.selectedOrder._id, this.quantityForm.value)
      .subscribe((res: ResponseModel) => {
        if (res.errors) {
          console.log('Error');
          this.toasterService.error('Order Not Accepted', 'Error');
        } else {
          this.allCustomersOrders.splice(this.selectedOrderIndex, 1, res.data);
          this.toasterService.success('Order Accepted', 'Accepted');
          console.log('Accepted');
        }
      });
    console.log(this.quantityForm.value);
  }
}
