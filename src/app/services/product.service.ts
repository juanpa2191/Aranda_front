import { Injectable } from '@angular/core';
import { ProductModel } from '../Models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../Models/PagedResult.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:7134/api/Products'; 

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.apiUrl);
  }

  getPagedProducts(body: any): Observable<any> {

    return this.http.post<PagedResult<ProductModel>>(`${this.apiUrl}/paged`, body);
  }
}
