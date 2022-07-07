import { TestBed } from "@angular/core/testing";

import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  // ejecuta esta instancia antes de cada prueba (it)
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ValueService ]
    });
    // instancia nueva para cada prueba al tener lo del 
    // TestBed ya no es necesario porque angular tiene
    // dependencias sin crear muchas instancias
    // service = new ValueService;
    service = TestBed.inject(ValueService);
  });

  it('should be create', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for getValue', () => {
    it('should return "my value"', () => {
      expect(service.getValue()).toBe("my value");
    });
  });

  describe('Tests for setValue', () => {
    it('should change the value', () => {
      expect(service.getValue()).toBe("my value");
      service.setValue('change');
      expect(service.getValue()).toBe('change');
    });
  });

  describe('Tests for getPromiseValue', () => {
    it('should return "promise value" from promise with then', (doneFn) => {
      service.getPromiseValue()
      .then((value) => {
        // assert (hipotesis)
        expect(value).toBe('promise value');
        // permite decir donde termina la prueba
        // y se usa cuando se tiene callback
        doneFn();
      });
    });

    it('should return "promise value" from promise using async', async() => {
      const rta = await service.getPromiseValue()
      expect(rta).toBe('promise value');
    });
  });

  describe('Tests for getObservable', () => {
    it('should return "observable value" from promise with subscribe', (doneFn) => {
      service.getObservable()
      .subscribe((value) => {
        // assert (hipotesis)
        expect(value).toBe('observable value');
        // permite decir donde termina la prueba
        // y se usa cuando se tiene callback
        doneFn();
      });
    });
  });
  

});
