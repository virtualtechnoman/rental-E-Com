import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomersService } from '../shared/customers.service';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  allCustomersOrders: any[] = [];
  viewOrderArray: any = [];
  constructor(private customersService: CustomersService) {
    this.getAllOrders();
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

  getAllOrders() {
    this.customersService.getAllCustomersOrders().subscribe((res: ResponseModel) => {
      this.allCustomersOrders = res.data;
      this.dtTrigger.next();
    });
  }

  viewCustomerOrder(i) {
    this.viewOrderArray = this.allCustomersOrders[i];
  }
}
