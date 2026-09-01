import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjetoService, Projeto } from '../projeto.service';

@Component({
  selector: 'app-gestao',
  imports: [ReactiveFormsModule],
  templateUrl: './gestao.html',
  styleUrl: './gestao.css'
})
export class Gestao implements OnInit {
  private service = inject(ProjetoService);

  // A lista que a tela mostra, e os estados dela - agora como signals,
  // porque este projeto Angular nao usa zone.js: sem signal, a tela
  // nao percebe sozinha que a variavel mudou dentro do subscribe.
  projetos = signal<Projeto[]>([]);
  carregando = signal(true);
  erro = signal('');

  // Quando editandoId tem um numero, o formulario esta em modo EDICAO.
  // Quando esta null, o mesmo formulario esta em modo ADICAO.
  editandoId = signal<number | null>(null);
  salvando = signal(false);

  // O formulario vive aqui no .ts, como na Aula 18.
  // ano e obrigatorio porque a coluna do banco e YEAR NOT NULL.
  form = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descricao: new FormControl(''),
    tecnologias: new FormControl(''),
    link_github: new FormControl(''),
    ano: new FormControl(2026, [Validators.required])
  });

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.service.listar().subscribe({
      next: (lista) => { this.projetos.set(lista); this.carregando.set(false); },
      error: () => { this.erro.set('Nao foi possivel carregar os projetos.'); this.carregando.set(false); }
    });
  }

  // Editar nao busca nada na API: o projeto ja veio na lista.
  // patchValue joga os campos dele para dentro do formulario.
  editar(p: Projeto) {
    this.editandoId.set(p.id ?? null);
    this.form.patchValue(p);
  }

  salvar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando.set(true);
    this.erro.set('');
    const dados = this.form.value as Projeto;

    // ESTA linha decide tudo: com id, e PUT; sem id, e POST.
    // Um formulario, dois usos.
    const id = this.editandoId();
    const requisicao = id
      ? this.service.atualizar(id, dados)
      : this.service.criar(dados);

    requisicao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.form.reset({ nome: '', descricao: '', tecnologias: '', link_github: '', ano: 2026 });
        this.editandoId.set(null);
        this.carregar(); // atualiza a lista sem precisar de F5
      },
      error: () => { this.salvando.set(false); this.erro.set('Nao foi possivel salvar. Tente de novo.'); }
    });
  }

  excluir(p: Projeto) {
    if (!p.id) { return; }
    if (!confirm(`Excluir o projeto "${p.nome}"? Esta acao nao pode ser desfeita.`)) { return; }

    this.service.excluir(p.id).subscribe({
      // A lista local perde o item na hora - sem recarregar a pagina.
      next: () => { this.projetos.update(lista => lista.filter(x => x.id !== p.id)); },
      error: () => { this.erro.set('Nao foi possivel excluir. Tente de novo.'); }
    });
  }
}
