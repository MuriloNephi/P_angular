// src/app/contato/contato.ts
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContatoService } from '../contato.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contato.html',
})
export class Contato {
  private fb = inject(FormBuilder);
  private service = inject(ContatoService);
  enviando = false; sucesso = ''; erro = '';

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit() {
    this.sucesso = ''; this.erro = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    const dados = {
      nome: this.form.value.nome ?? '',
      email: this.form.value.email ?? '',
      mensagem: this.form.value.mensagem ?? '',
    };
    this.service.enviar(dados).subscribe({
      next: (resp) => {
        this.sucesso = resp.mensagem;
        this.form.reset();
        this.enviando = false;
      },
      error: () => {
        this.erro = 'Nao foi possivel enviar. Tente novamente.';
        this.enviando = false;
      },
    });
  }
}
