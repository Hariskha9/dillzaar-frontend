import { Routes } from '@angular/router';
import { Body } from './layout/body/body';
import { Home } from './Pages/home/home';
import { Login } from './Pages/auth/login/login';
import { PanelBody } from './Panel/layout/panel-body/panel-body';
import { Dashbored } from './Panel/pages/dashbored/dashbored';
import { Products } from './Panel/pages/products/products';
import { Categories } from './Panel/pages/categories/categories';
import { Order } from './Panel/pages/order/order';
import { Users } from './Panel/pages/users/users';
import { CategoryCreate } from './Panel/pages/categories/components/category-create/category-create';
import { ProductCreate } from './Panel/pages/products/component/product-create/product-create';
import { ProductEdit } from './Panel/pages/products/component/product-edit/product-edit';
import { authGuard } from './core/guards/auth/auth-guard';
import { roleGuard } from './core/guards/role/role-guard';
import { guestGuard } from './core/guards/guest/guest-guard';
import { CategoryEdit } from './Panel/pages/categories/components/category-edit/category-edit';
import { ProductDetail } from './Pages/product-detail/product-detail';

export const routes: Routes = [
     {
    path: '',
    component: Body,
    children: [
      { path: '', component: Home },
       { path: 'product/:slug', component: ProductDetail },
      {path:'login', component: Login,  canActivate: [guestGuard],}
    ]
  },
  {
    path: 'panel',
    component: PanelBody,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashbored, 
                canActivate: [roleGuard],
                data: {
          roles: [
            'super_admin',
            'admin',
            'employee',
            'client'
          ]
        }

      },

      {path:'products', component:Products},
      { path: 'products/:id/edit', component: ProductEdit },
      { path: 'products/create', component: ProductCreate },
      {path:'categories', component:Categories},
      { path: 'categories/create', component: CategoryCreate },
      {
  path: 'categories/edit/:id',
  component: CategoryEdit
 },
      {path:'orders', component:Order},
      {path:'users', component:Users},

    ]
  }
];
