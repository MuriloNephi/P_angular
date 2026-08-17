import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TecnologiaService, Tecnologia } from '../tecnologia.service';

@Component({
  selector: 'app-catalogo',
  imports: [MatCardModule],
  templateUrl: './catalogo.html',
})
export class Catalogo implements OnInit {
  private service = inject(TecnologiaService);
  tecnologias = signal<Tecnologia[]>([]);
  carregando = signal(true);
  erro = signal('');

  ngOnInit() {
    this.service.listar().subscribe({
      next: (lista) => { this.tecnologias.set(lista); this.carregando.set(false); },
      error: () => { this.erro.set('Falha ao carregar o catalogo.'); this.carregando.set(false); }
    });
  }
}
