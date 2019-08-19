import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from '../products.component';
import { AuthGuard } from '../../../auth/auth-guard.service';
import { CategoryComponent } from '../category/category.component';

const routes: Routes = [
    { path: 'product', children: [{  path: '', component: ProductsComponent }],
    canActivate: [AuthGuard]
    },
    { path: 'category', children: [{  path: '', component: CategoryComponent }],
    canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductsRoutingModule {}
