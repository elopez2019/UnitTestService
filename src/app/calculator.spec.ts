import { Calculator } from "./calculator";


describe('Test for Calculator', () => {

    describe('Test for multiply', () => {
        it('should return a nine', () => {
            //AAA
            //Arrange lo que se necesita para correr la prueba
            const calculator = new Calculator();
            //Act ejecutar el codigo a probar
            const rta = calculator.multiply(3,3);
            //Assert resolver la hipotesis, 
            //como deberia actuar y sino actuar
            //de la manera correcta debe fallar
            expect(rta).toEqual(9);
        })  
        
        it('should return a four', () => {
            //Arrange
            const calculator = new Calculator();
            //Act
            const rta = calculator.multiply(1,4);
            //Assert
            expect(rta).toEqual(4);
        })   
    });
    

    describe('Test for divide', () => {
        it('should return a some number', () => {
            //Arrange
            const calculator = new Calculator();
            //Act and Assert
            expect(calculator.divide(6,3)).toEqual(2);
            expect(calculator.divide(5,2)).toEqual(2.5);
        })   
    
        it('for a zero', () => {
            //Arrange
            const calculator = new Calculator();
            //Act and Assert
            expect(calculator.divide(6,0)).toBeNull();
            expect(calculator.divide(5,0)).toBeNull();
            expect(calculator.divide(12121212122,0)).toBeNull();
        }) 
    });
      

    describe('Test for matchers', () => {
        it('tests matchers', () => {
            const name = 'Nicolas';
            let name2;
    
            // para pruebas definidas o indefinidas
            expect(name).toBeDefined();
            expect(name2).toBeUndefined();
    
            // true o false
            expect(1 + 3 === 4).toBeTruthy(); //4
            expect(1 + 1 === 3).toBeFalsy(); 
    
            // mayor que
            expect(5).toBeLessThan(10);
            // mas grande que
            expect(20).toBeGreaterThan(10);
    
            // expresion regular
            expect('123456').toMatch(/123/);
            // contiene 
            expect(['apples', 'oranges', 'pears']).toContain('oranges'); 
        })   
    });
})