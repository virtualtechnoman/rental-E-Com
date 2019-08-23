import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ProductModel } from '../../products/shared/product.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { asElementData } from '@angular/core/src/view';

@Component({
  selector: 'app-challan',
  templateUrl: './challan.component.html',
  styleUrls: ['./challan.component.scss']
})
export class ChallanComponent implements OnInit {

  allChallans: any[] = [];
  allProducts: ProductModel[] = [];
  currentChallan: any;
  currentIndex: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  recievedValueForm:FormGroup;
  billedValueForm:FormGroup;
  afterStatus:any;
  constructor(private orderService: OrderService, private toasterService: ToastrService,private fb:FormBuilder,private toastr:ToastrService) { }

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
    this.recievedValueForm=this.fb.group({
      recieved:this.fb.array([])
    })
    this.billedValueForm=this.fb.group({
      billed:this.fb.array([])
    })
    this.getAllChallan();
  }

  recievedQuantityEntered(event:any,i){
    var arr;
    arr=event.target.value;
    this.recievedValueForm.value.recieved[i]=arr
    this.qw();
  }

  qw(){
    for(var i=0;i<this.recievedValueForm.value.recieved.length;i++){
      this.currentChallan.order.products[i].recieved=Number(this.recievedValueForm.value.recieved[i])
    }
  
  }

  asde(){
    const order=<any> new Object();
    order.products=this.currentChallan.order.products
    for(var i=0;i<this.currentChallan.order.products.length;i++){
      order.products[i].product=this.currentChallan.order.products[i].product._id
      delete order.products[i].accepted;
      delete order.products[i].dispatched;
      delete order.products[i].requested;
      delete order.products[i]._id;
      delete order.products[i].billed;
      
    }
    console.log(order,this.currentChallan.order._id)
    this.orderService.recievedChallanStatus(this.currentChallan.order._id,order).subscribe((res:ResponseModel)=>{
      jQuery('#ChallanModel').modal('hide');
      this.toasterService.success('Challan Recieved Quantity Entered!', 'Success!');
      console.log(res.data)
    })
  }
  getAllChallan() {
    this.orderService.getAllChallan().subscribe((res: ResponseModel) => {
      if (res.error) {
        this.toasterService.warning('Error', res.error);
      } else {
        this.allChallans = res.data;
        console.log(this.allChallans);
      }
    });
  }

  deleteChallan(i) {
    if (confirm('You Sure you want to delete this Order')) {
      this.orderService.deleteReturnOrder(this.allChallans[i]._id).toPromise().then(() => {
        this.toasterService.warning('Products Deleted!', 'Deleted!');
        this.allChallans.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }

  selectChallan(i) {
    this.currentIndex = i;
    this.currentChallan = this.allChallans[i];
    console.log(this.currentChallan);
    this.allProducts = this.currentChallan.order.products;
    console.log(this.allProducts);
  }

  // deleteChallan(i) {
  //   if (confirm('You Sure you want to delete this Challan')) {
  //     this.orderService.deleteChallan(this.allChallans[i]._id).toPromise().then(() => {
  //       this.toasterService.warning('Challan Deleted!', 'Deleted!');
  //       this.allChallans.splice(i, 1);
  //     }).catch((err) => console.log(err));
  //   }
  // }

  changeChallanStatus() {
    console.log(this.currentChallan._id)
    this.orderService.updateChallanStatus(this.currentChallan._id).subscribe((res: ResponseModel) => {
      jQuery('#ChallanModel').modal('hide');
      this.toasterService.success('Challan Accepted!', 'Success!');
      console.log(res.data)
    });
  }

  billedQuantityEntered(event:any,i){
    var arr;
    arr=event.target.value;
    this.billedValueForm.value.billed[i]=arr
    this.billedArray();
  }

  billedArray(){
    for(var i=0;i<this.billedValueForm.value.billed.length;i++){
      this.currentChallan.order.products[i].billed=Number(this.billedValueForm.value.billed[i])
    }
  }

  billProductQuantity(){
    console.log(this.currentChallan.order)
    const order=<any> new Object();
    order.products=this.currentChallan.order.products
    for(var i=0;i<this.currentChallan.order.products.length;i++){
      order.products[i].product=this.currentChallan.order.products[i].product._id
      delete order.products[i].accepted;
      delete order.products[i].dispatched;
      delete order.products[i].recieved;
      delete order.products[i]._id;
      delete order.products[i].requested;
      
    }
    console.log(order,this.currentChallan.order._id)
    this.orderService.recievedBillQuantity(this.currentChallan.order._id,order).subscribe((res:ResponseModel)=>{
      jQuery('#ChallanModel').modal('hide');
      this.toasterService.success('Billed Challan!', 'Success!');
      console.log(res.data)
    })
  }
}
