import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';

export const routes: Routes = [
  { path: 'productos', component: ProductList },
  { path: '', redirectTo: 'productos', pathMatch: 'full' } 
];
