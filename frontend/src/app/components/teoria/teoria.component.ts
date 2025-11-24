import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teoria.component.html',
  styleUrl: './teoria.component.css'
})
export class TeoriaComponent implements OnInit {
  bloqueId: string = '';
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bloqueId = params['id'];
    });
  }
}