import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductsService } from './products.service';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { environment } from '../../environments/environment';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

fdescribe('ProductsService', () => {
  let productsService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  afterEach(() => {
    httpController.verify();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
        }
      ]
    });
    productsService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });
  
  it('should be create', () => {
    expect(productsService).toBeTruthy();
  });

  describe('tests for getAllSimple', () => {
    it('should return a product list', () => {
      //Arrange
      const mockData: Product[] = generateManyProducts(2);
      // responderia 123
      spyOn(tokenService, 'getToken').and.returnValue('123');
      //Act
      productsService.getAllSimple()
      .subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        //doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual('Bearer 123');
      req.flush(mockData);
    });
  });


  describe('tests for getAll', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      //Act
      productsService.getAll()
      .subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    });
    
    it('should return product list width taxes', (doneFn) => {
      // Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, //100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, //200 * .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0, //0 * .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100, // = 0
        },
      ];
      //Act
      productsService.getAll()
      .subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        doneFn();
      });
       //http config
       const url = `${environment.API_URL}/api/v1/products`;
       const req = httpController.expectOne(url);
       req.flush(mockData);
       httpController.verify();
    });

    it('should send query params width limit 10 offset 3', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;
      //Act
      productsService.getAll(limit, offset)
      .subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
      httpController.verify();
    });
  });

  describe('test for create', () => {
    it('should return a new product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new Product',
        price: 100,
        images: ['img'],
        description: 'bla bla bla',
        categoryId: 12,
      };
      // Act
      productsService.create({...dto}).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('test for update', () => {
    it('should return an updated product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const id = '1';
      const dto: UpdateProductDTO = {
        title: 'update Product',
        price: 200,
        images: ['img'],
        description: 'bla bla bla bla',
        categoryId: 12,
      };
      // Act
      productsService.update(id, {...dto}).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');
    });
  });

  describe('test for delete', () => {
    it('should delete a product', (doneFn) => {
      // Arrange
      const mockData = true;
      const id = '1';
      // Act
      productsService.delete(id).subscribe((data) => {
        // Assert
        expect(data).toBe(mockData);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('test for getOne', () => {
    it('should return a product', (doneFn) => { 
        // Arrange
      const mockData = generateOneProduct(); // retorna producto
      const id = '1';
        // Act
      productsService.getOne(id)
      .subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      }); 
        
      //http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the rihth msg when status code is 404', (doneFn) => { 
        // Arrange
      const id = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound, // es igual a colocar 404
        statusText: msgError
      }
        // Act
      productsService.getOne(id)
      .subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        } // funcion error

      }); 
        
      //http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the rihth msg when status code is 409', (doneFn) => { 
        // Arrange
      const id = '1';
      const msgError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict, // es igual a colocar 409
        statusText: msgError
      }
        // Act
      productsService.getOne(id)
      .subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        } // funcion error

      }); 
        
      //http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the rihth msg when status code is 401', (doneFn) => { 
        // Arrange
      const id = '1';
      const msgError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized, // es igual a colocar 401
        statusText: msgError
      }
        // Act
      productsService.getOne(id)
      .subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('No estas permitido');
          doneFn();
        } // funcion error

      }); 
        
      //http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the rihth msg when status code undefined', (doneFn) => { 
        // Arrange
      const id = '1';
      const msgError = 'Error message';
      const mockError = {
        status: HttpStatusCode.BadRequest, // error
        statusText: msgError
      }
        // Act
      productsService.getOne(id)
      .subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('Ups algo salio mal');
          doneFn();
        } // funcion error

      }); 
        
      //http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });
});