// src/app/contato/contato.ts
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContatoService } from '../contato.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contato.html',
  styleUrl: './contato.css',
})
export class Contato {
  private fb = inject(FormBuilder);
  private service = inject(ContatoService);
  enviando = false;
  sucesso = '';
  erroGeral = '';       // erro de rede/servidor genérico
  errosBack: string[] = []; // lista de erros que a API devolveu no 400

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit() {
    this.sucesso = ''; this.erroGeral = ''; this.errosBack = [];

    if (this.form.invalid) {
      this.form.markAllAsTouched(); // forca exibir os erros de campo
      this.focarPrimeiroInvalido();
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
      error: (err: HttpErrorResponse) => {
        this.enviando = false;
        // Se o back mandou 400 com {erros:[...]}, mostra eles.
        if (err.status === 400 && err.error?.erros) {
          this.errosBack = err.error.erros;
        } else {
          this.erroGeral = 'Nao foi possivel enviar. Tente novamente.';
        }
      },
    });
  }

  private focarPrimeiroInvalido() {
    const campos = ['nome', 'email', 'mensagem'] as const;
    for (const campo of campos) {
      if (this.form.get(campo)?.invalid) {
        document.getElementById(campo)?.focus();
        break;
      }
    }
  }
}
