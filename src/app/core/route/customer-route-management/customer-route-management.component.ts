import { Component, OnInit } from '@angular/core';
import { RouteService } from '../shared/route.service';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-customer-route-management',
  templateUrl: './customer-route-management.component.html',
  styleUrls: ['./customer-route-management.component.scss']
})
export class CustomerRouteManagementComponent implements OnInit {
  allRoutes:any[]=[];
  allNoRouteCustomers:any[]=[]
  constructor(private routeService:RouteService) { 
    this.getRoutes()
    this.getCustomersWithNoRoutes()
  }

  ngOnInit() {
  }

  getRoutes(){
    this.routeService.getAllRoutes().subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.allRoutes=res.data
    })
  }

  getCustomersWithNoRoutes(){
    this.routeService.getAllCustomersWithNoRoutes().subscribe((res:ResponseModel)=>{
      console.log(res.data)
      this.allNoRouteCustomers=res.data
    })
  }

}
