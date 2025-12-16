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
      // Usamos setTimeout para asegurar que el contenido HTML haya sido pintado por Angular
      setTimeout(() => {
        // Establecer el contenido del elemento
        this.el.nativeElement.innerHTML = this.appMathJax;

        // Llamar a MathJax para procesar el contenido
        MathJax.typesetPromise([this.el.nativeElement]);
      }, 0);
    }
  }
}