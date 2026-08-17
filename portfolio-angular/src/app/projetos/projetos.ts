import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProjetoService, Projeto } from '../projeto.service';

@Component({
  selector: 'app-projetos',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
})
export class Projetos implements OnInit {
  private service = inject(ProjetoService);
  projetos = signal<Projeto[]>([]);
  carregando = signal(true);
  erro = signal('');

  ngOnInit() {
    this.service.listar().subscribe({
      next: (lista) => { this.projetos.set(lista); this.carregando.set(false); },
      error: () => { this.erro.set('Falha ao carregar os projetos.'); this.carregando.set(false); }
    });
  }
}