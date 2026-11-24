export const API = 'https://urban-space-train-pjv6pqjg4qrw37j55-3000.app.github.dev';

export function msg(dados, padrao) {
  return (dados && (dados.erro || dados.mensagem || dados.message || dados.error)) || padrao;
}
