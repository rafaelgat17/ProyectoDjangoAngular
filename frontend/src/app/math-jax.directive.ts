import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

// Declaramos MathJax como variable global para acceder a ella.
declare var MathJax: {
  typesetPromise: (elements: HTMLElement[]) => Promise<void>;
};

@Directive({
  selector: '[appMathJax]',
  standalone: true
})
export class MathJaxDirective implements OnChanges {
  // Necesitamos un Input para que la directiva se ejecute cuando el contenido LaTeX cambie.
  @Input() appMathJax: string | undefined;

  constructor(private el: ElementRef) {}

  // ngOnChanges se ejecuta cuando el Input (appMathJax) cambia,
  // y también cuando el componente se inicializa con un valor.
ngOnChanges() {
    if (this.appMathJax && MathJax) {
      // 1. Establece el contenido primero
      this.el.nativeElement.innerHTML = this.appMathJax;
      
      // 2. Llama a MathJax para procesar
      setTimeout(() => { // Usamos setTimeout para dar tiempo al DOM
        MathJax.typesetPromise([this.el.nativeElement])
               .catch(err => console.error('MathJax error:', err)); // <- Añade esto para debug
      }, 0);
    }
  }
}