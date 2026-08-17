import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  tecnologias: string;
  link_github: string;
  ano: number;
}

interface ProjetosResponse {
  total: number;
  projetos: Projeto[];
}

@Injectable({ providedIn: 'root' })
export class ProjetoService {
  private http = inject(HttpClient);
  private url = 'https://urban-space-train-pjv6pqjg4qrw37j55-8000.app.github.dev/api/projetos.php';

  listar(): Observable<Projeto[]> {
    return this.http.get<ProjetosResponse>(this.url).pipe(
      map(resposta => resposta.projetos)
    );
  }
}