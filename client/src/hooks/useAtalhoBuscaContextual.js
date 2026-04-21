import { useEffect } from 'react';

// `encontrarBotaoBuscaContextualF8` centraliza no utilitario a leitura do DOM para manter o hook focado no ciclo de vida React.
import { encontrarBotaoBuscaContextualF8 } from '../utilitarios/interacoesGlobaisModais';

// Este hook registra o atalho global `F8` para abrir a busca do campo focado quando o usuario estiver em fornecedor, contato ou produto.
export function useAtalhoBuscaContextual() {
  // O listener global nasce na montagem e e removido na limpeza para evitar duplicidade quando o `App` remontar.
  useEffect(() => {
    // Cada tecla pressionada passa por esta funcao, que so reage quando existe um campo com busca contextual no foco atual.
    function tratarAtalhoBuscaContextual(evento) {
      // Ignoramos qualquer tecla diferente de `F8` para nao competir com a digitacao normal do formulario.
      if (evento.key !== 'F8') {
        return;
      }

      // O utilitario identifica o botao da busca correta com base no campo focado dentro do modal ativo.
      const botaoBuscaContextual = encontrarBotaoBuscaContextualF8();

      // Se o foco nao estiver em um campo compatível, o atalho nao produz efeito.
      if (!botaoBuscaContextual) {
        return;
      }

      // Cancelamos o comportamento nativo para garantir que o atalho seja consumido pela aplicacao.
      evento.preventDefault();
      // O clique reutiliza o mesmo fluxo manual do usuario e evita duplicar regras de abertura de modal.
      botaoBuscaContextual.click();
    }

    // O `window` recebe o listener porque o foco pode estar em `select`, `input` ou outros elementos internos do modal.
    window.addEventListener('keydown', tratarAtalhoBuscaContextual);

    // A limpeza remove o listener global e previne efeitos acumulados em remounts.
    return () => {
      window.removeEventListener('keydown', tratarAtalhoBuscaContextual);
    };
  }, []);
}
