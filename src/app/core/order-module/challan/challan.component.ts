import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { ResponseModel } from '../../../shared/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ProductModel } from '../../products/shared/product.model';

@Component({
  selector: 'app-challan',
  templateUrl: './challan.component.html',
  styleUrls: ['./challan.component.scss']
})
export class ChallanComponent implements OnInit {

  allChallans: any[] = [];
  allProducts: ProductModel[] = [];
  currentChallan: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private orderService: OrderService, private toasterService: ToastrService) { }

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
    this.getAllChallan();
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

  deleteChallan(i){
    if (confirm('You Sure you want to delete this Order')) {
      this.orderService.deleteReturnOrder(this.allChallans[i]._id).toPromise().then(() => {
        this.toasterService.warning('Products Deleted!', 'Deleted!');
        this.allChallans.splice(i, 1);
      }).catch((err) => console.log(err));
    }
  }
  selectChallan(i) {
    this.currentChallan = this.allChallans[i];
    console.log(this.currentChallan)
    this.allProducts = this.currentChallan.products;
    console.log(this.allProducts)
  }


  // resetForm() {
  //   this.editing = false;
  //   this.submitted = false;
  //   this.cha.reset();
  // }
}
