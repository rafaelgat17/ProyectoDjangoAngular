// src/app/math-jax.directive.spec.ts

import { MathJaxDirective } from './math-jax.directive';
import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// 1. Componente de prueba simple que usa la directiva
@Component({
  template: '<div appMathJax>Test</div>', // Usamos la directiva en un elemento
  standalone: true, 
  imports: [MathJaxDirective]
})
class TestComponent {}

describe('MathJaxDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[];

  beforeEach(() => {
    // 2. Configurar el TestBed e importar la directiva y el componente de prueba
    TestBed.configureTestingModule({
      imports: [MathJaxDirective, TestComponent]
    }).compileComponents();
    
    // 3. Crear el fixture (instancia del componente de prueba)
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges(); // Ejecutar ngOnInit y aplicar la directiva

    // 4. Obtener el elemento que tiene la directiva adjunta
    des = fixture.debugElement.queryAll(By.directive(MathJaxDirective));
  });

  // El test básico
  it('should create an instance and apply to the element', () => {
    // Si la lista 'des' contiene un elemento, la directiva se aplicó correctamente.
    expect(des.length).toBe(1);
  });
  
  // Aquí irían más pruebas para verificar la llamada a MathJax.typesetPromise
  // (lo cual requeriría simular la función global MathJax).
});

// Nota: Si usaste `ng generate directive math-jax`, el archivo .spec
// ya debería tener una estructura similar a esta.