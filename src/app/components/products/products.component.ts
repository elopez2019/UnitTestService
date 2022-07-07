import { Component, OnInit } from '@angular/core';
import { Product } from './../../models/product.model';

import { ProductsService } from "./../../services/products.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {


  products: Product[] = [];

  constructor(
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllSimple()
    .subscribe(products => {
      this.products = products;
    });
  }
}
