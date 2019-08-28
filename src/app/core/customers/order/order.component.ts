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
  allCustomersOrders:any[]=[];
  viewOrderArray:any=[]
  constructor(private customersService:CustomersService) {
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
      dom: '<"html5buttons"B>lTfgitp',
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
  }

  getAllOrders(){
  this.customersService.getAllCustomersOrders().subscribe((res:ResponseModel)=>{
    console.log(res.data)
    this.allCustomersOrders=res.data;
    this.dtTrigger.next();
  })
  }

  viewCustomerOrder(i){
    this.viewOrderArray=this.allCustomersOrders[i]
    console.log(this.viewOrderArray)
  }
}
