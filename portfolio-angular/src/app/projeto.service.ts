import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Projeto {
  id?: number;
  nome: string;
  descricao: string;
  tecnologias: string;
  link_github: string;
  ano: number;
}

@Injectable({ providedIn: 'root' })
export class ProjetoService {
  private http = inject(HttpClient);
  private url = 'https://urban-space-train-pjv6pqjg4qrw37j55-8000.app.github.dev/api/projetos.php';

  listar(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.url);
  }

  // POST: o projeto vai inteiro no corpo. Sem id - quem gera o id e o banco.
  criar(projeto: Projeto): Observable<{ id?: number; mensagem?: string }> {
    return this.http.post<{ id?: number; mensagem?: string }>(this.url, projeto);
  }

  // PUT: o id vai na URL (qual projeto) e o projeto vai no corpo (o que gravar).
  atualizar(id: number, projeto: Projeto): Observable<{ id?: number; mensagem?: string }> {
    return this.http.put<{ id?: number; mensagem?: string }>(`${this.url}?id=${id}`, projeto);
  }

  // DELETE: mesma URL com ?id=, sem corpo, verbo delete.
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}?id=${id}`);
  }
}
