import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Tecnologia {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  ano_criacao: number;
}

interface TecnologiasResponse {
  total: number;
  tecnologias: Tecnologia[];
}

@Injectable({ providedIn: 'root' })
export class TecnologiaService {
  private http = inject(HttpClient);
  private url = 'https://urban-space-train-pjv6pqjg4qrw37j55-8000.app.github.dev/api/tecnologias.php';

  listar(): Observable<Tecnologia[]> {
    return this.http.get<TecnologiasResponse>(this.url).pipe(
      map(resposta => resposta.tecnologias)
    );
  }
}
