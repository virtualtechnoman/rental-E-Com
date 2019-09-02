import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { RouteService } from '../shared/route.service';
import { ResponseModel } from '../../../shared/shared.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-customer-route-management',
  templateUrl: './customer-route-management.component.html',
  styleUrls: ['./customer-route-management.component.scss']
})
export class CustomerRouteManagementComponent implements OnInit {
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  @ViewChildren("checkboxes") checkboxes2:any;
  allRoutes:any[]=[];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dtOptions2: any = {};
  dtTrigger2: Subject<any> = new Subject();
  allNoRouteCustomers:any[]=[];
  selectedIndex:number;
  customerArray:any[]=[];
  customerArrayShow:boolean=false;
  routeId:any;
  allSelectedRoutesById:any[]=[]
  constructor(private routeService:RouteService) { 
    this.getRoutes()
    this.getCustomersWithNoRoutes()
  }



  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [5, 10, 15, -1],
        [5, 10, 15, 'All']
      ],
      destroy: true,
      retrive: true,
      // dom: '<'html5buttons'B>lTfgitp',
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      },
      dom: 'Bfrtip',
    };
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      lengthMenu: [
        [5, 10, 15, -1],
        [5, 10, 15, 'All']
      ],
      destroy: true,
      retrive: true,
      // dom: '<'html5buttons'B>lTfgitp',
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      },
      dom: 'Bfrtip',
    };
  }
  

  sendCustomer(){
    console.log(this.checkboxes2)
    for(var i=0;i<this.checkboxes2._results.length;i++){
      if(this.checkboxes2._results[i].nativeElement.checked==true){
          console.log(i);
          this.customerArray.push(this.allNoRouteCustomers[i]._id)
          
      }
    }
    this.routeId=this.allRoutes[this.selectedIndex-1]._id;
    if(this.routeId){
      this.allNoRouteCustomers.length=0;
    var customer =<any> new Object();
    customer.customers=this.customerArray;
    customer.route=this.routeId
    console.log(customer)
    this.routeService.updateCustomerRoute(customer).subscribe((res:ResponseModel)=>{
      console.log(res.data)
      
    })
    this.routeService.getAllCustomersWithNoRoutes().subscribe((res:ResponseModel)=>{
      this.allNoRouteCustomers.length=0;
      console.log(res.data)
      this.allNoRouteCustomers=res.data
    })

    
    }

    this.routeService.getAllCustomersWithNoRoutes().subscribe((res:ResponseModel)=>{
      this.allNoRouteCustomers.length=0;
      console.log(res.data)
      this.allNoRouteCustomers=res.data
      this.dtTrigger.next()
    })
  }

  selectRouteId(event){
    
    this.selectedIndex=event.target.selectedIndex;
    console.log(this.selectedIndex)
    console.log(event)
    this.routeService.getCustomerByRoute(this.allRoutes[this.selectedIndex-1]._id).subscribe((res:ResponseModel)=>{
      this.allSelectedRoutesById.length=0
      console.log(res.data)
      this.allSelectedRoutesById=res.data
    })
    this.routeService.getAllCustomersWithNoRoutes().subscribe((res:ResponseModel)=>{
      this.allNoRouteCustomers.length=0;
      console.log(res.data)
      this.allNoRouteCustomers=res.data
    })

  }

  getRoutes(){
    this.routeService.getAllRoutes().subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.allRoutes=res.data
      this.dtTrigger.next()
    })
  }

  getCustomersWithNoRoutes(){
    this.allNoRouteCustomers.length=0;
    this.routeService.getAllCustomersWithNoRoutes().subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.allNoRouteCustomers=res.data
      this.dtTrigger.next()
    })
  }

}
