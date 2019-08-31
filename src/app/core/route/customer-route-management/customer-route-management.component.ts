import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { RouteService } from '../shared/route.service';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-customer-route-management',
  templateUrl: './customer-route-management.component.html',
  styleUrls: ['./customer-route-management.component.scss']
})
export class CustomerRouteManagementComponent implements OnInit {
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  @ViewChildren("checkboxes") checkboxes2:any;
  allRoutes:any[]=[];
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
    var customer =<any> new Object();
    customer.customers=this.customerArray;
    customer.route=this.routeId
    console.log(customer)
    this.routeService.updateCustomerRoute(customer).subscribe((res:ResponseModel)=>{
      console.log(res.data)
    })
    }

  }

  selectRouteId(event){
    this.selectedIndex=event.target.selectedIndex;
    console.log(this.selectedIndex)
    console.log(event)
    this.routeService.getCustomerByRoute(this.allRoutes[this.selectedIndex-1]._id).subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.allSelectedRoutesById=res.data;
      
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
    })
  }

  getCustomersWithNoRoutes(){
    this.allNoRouteCustomers.length=0;
    this.routeService.getAllCustomersWithNoRoutes().subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.allNoRouteCustomers=res.data
    })
  }

}
