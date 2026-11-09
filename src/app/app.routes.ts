import { Routes } from '@angular/router';
import { Body } from './layout/body/body';
import { Home } from './Pages/home/home';
import { Login } from './Pages/auth/login/login';
import { PanelBody } from './Panel/layout/panel-body/panel-body';
import { Dashbored } from './Panel/pages/dashbored/dashbored';
import { Products } from './Panel/pages/products/products';
import { Categories } from './Panel/pages/categories/categories';

export const routes: Routes = [
     {
    path: '',
    component: Body,
    children: [
      { path: '', component: Home },
      {path:'account', component: Login}
    ]
  },
  {
    path: 'panel',
    component: PanelBody,
    children: [
      { path: '', component: Dashbored },
      {path:'products', component:Products},
      {path:'categories', component:Categories}
    ]
  }
];
