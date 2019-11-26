import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from '../products.component';
import { AuthGuard } from '../../../auth/auth-guard.service';
import { CategoryComponent } from '../category/category.component';
import { BrandComponent } from '../brand/brand.component';
import { AttributesComponent } from '../attributes/attributes.component';
import { TypesComponent } from '../types/types.component';

const routes: Routes = [
  {
    path: 'product', children: [{ path: '', component: ProductsComponent }],
    canActivate: [AuthGuard]
  },
  {
    path: 'category', children: [{ path: '', component: CategoryComponent }],
    canActivate: [AuthGuard]
  },
  {
    path: 'brand', children: [{ path: '', component: BrandComponent }],
    canActivate: [AuthGuard]
  },
  {
    path: 'attributes', children: [{ path: '', component: AttributesComponent }],
    canActivate: [AuthGuard]
  },
  {
    path: 'producttype', children: [{ path: '', component: TypesComponent }],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductsRoutingModule { }
