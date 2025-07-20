import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductModel } from '../../Models/product.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PagedResult } from '../../Models/PagedResult.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, HttpClientModule, TableModule, PaginatorModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products: ProductModel[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  rows: number = 10;
  filters: any = {};
  // Propiedades para ordenamiento
  sortField: string = 'nombre';
  sortOrder: number = 1; 

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData({
      first: 0,
      rows: 10,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    });
  }

  loadData(event: any) {
    this.loading = true;
    this.cdr.detectChanges();

    const page = event.first / event.rows;
    const size = event.rows;

    // Actualizar propiedades de ordenamiento
    if (event.sortField) {
      this.sortField = event.sortField;
      this.sortOrder = event.sortOrder;
    }

    // Obtener filtros del evento o del estado local
    let filters: { [key: string]: any } = {};
    if (event.filters) {
      // PrimeNG envía los filtros en event.filters
      for (const key in event.filters) {
        if (event.filters[key]?.value !== undefined && event.filters[key]?.value !== '') {
          filters[key] = event.filters[key].value;
        }
      }
    } else if (this.filters) {
      // Si no viene de PrimeNG, usa los locales
      filters = { ...this.filters };
    }

    const body = {
      pageNumber: page + 1,
      pageSize: size,
      filters: filters,
      orden: this.sortField,
      asc: this.sortOrder === 1 ? true : false,
    };

    console.log('Filtros enviados al backend:', body.filters);

    this.productService.getPagedProducts(body)
      .subscribe({
        next: (res: PagedResult<ProductModel>) => {
          this.products = res.items;
          this.totalRecords = res.totalCount;
          this.loading = false;
          this.cdr.detectChanges();
          console.log('Datos cargados:', res); // Debug
        },
        error: (err: any) => {
          console.error('Error al cargar productos:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onColumnFilter(event: any, field: string) {
    this.filters[field] = event.target.value;
    this.loadData({
      first: 0,
      rows: this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      filters: this.filters
    });
  }
}
