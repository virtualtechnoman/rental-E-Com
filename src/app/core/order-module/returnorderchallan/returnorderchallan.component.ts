import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderService } from '../shared/order.service';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-returnorderchallan',
  templateUrl: './returnorderchallan.component.html',
  styleUrls: ['./returnorderchallan.component.scss']
})
export class ReturnorderchallanComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  allReturnOrders:any[]=[];
  currentIndex:any;
  currentChallan:any=[];
  allProducts:any=[]
  challanTime: any;
  constructor(private orderService:OrderService,private toastr:ToastrService) { 
    this.getReturnOrders();
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
      dom: "<'html5buttons'B>lTfgitp'",
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

  getReturnOrders(){
      this.allReturnOrders.length = 0;
      this.orderService.getAllReturnOrdersChallans().subscribe((res: ResponseModel) => {
        if (res.errors) {
          this.toastr.warning('Error', res.errors);
        } else {
          this.allReturnOrders = res.data;
          console.log(res.data)
          this.dtTrigger.next();
        }
      });
  }

  selectChallan(i) {
    this.currentIndex = i;
    this.currentChallan = this.allReturnOrders[i];
    console.log(this.currentChallan);
    this.allProducts = this.currentChallan.order.products;
    console.log(this.allProducts);
    this.challanTime=this.currentChallan.challan_date.substr(11, 8)

  }

  changeChallanStatus() {
    console.log(this.currentChallan._id)
    this.orderService.updateReturnOrderChallanStatus(this.currentChallan._id).subscribe((res: ResponseModel) => {
      jQuery('#ChallanModel').modal('hide');
      this.toastr.success('Challan Accepted!', 'Success!');
      this.allReturnOrders.splice(this.currentIndex,1,res.data)
      console.log(res.data)
    });
  }

}
